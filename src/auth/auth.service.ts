import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@users/users.service';
import { AuditService } from '@audit/audit.service';
import { User } from '@entities/user.entity';
import { Role } from '@users/role.enum';

// Rate limiter to prevent brute-force attacks
const limiter = new RateLimiterMemory({
  points: 5, // 5 requests
  duration: 60, // per 60 seconds by IP
});
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private auditService: AuditService,
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    // searchByUsername trả về mảng users (LIKE search). 
    // Tìm user khớp chính xác theo username (case-insensitive), nếu không có thì dùng phần tử đầu tiên.
    const users = await this.usersService.searchByUsername(username);
    if (!users || users.length === 0) {
      return null;
    }

    const matched = users.find(u => u.username.toLowerCase() === username.toLowerCase()) ?? users[0];

    if (matched && (await bcrypt.compare(pass, matched.password))) {
      return matched;
    }
    return null;
  }

  async login(user: User, ip?: string) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '4h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    await this.auditService.createLog({
      userId: user.id.toString(),
      action: 'LOGIN_SUCCESS',
      details: { username: user.username },
      ipAddress: ip,
    });

    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signup(username: string, email: string, password: string): Promise<User> {
    const existing = await this.usersService.searchByUsername(username);
    if (existing && existing.length) {
      throw new BadRequestException('Username already exists');
    }
    // UsersService.register already hashes the password, so pass plain password
    return this.usersService.register({ username, email, password });
  }

  async createUser(username: string, email: string, password: string, role: Role, currentUser?: any): Promise<User> {
    if (currentUser?.role !== Role.Admin) {
      throw new UnauthorizedException('Only admins can create users with specific roles');
    }
    // UsersService.create will hash the password, so pass plain password
    return this.usersService.create({ username, email, password, role });
  }

  async refreshToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });
      const newAccessToken = this.jwtService.sign(
        { username: payload.username, sub: payload.sub, role: payload.role },
        { secret: process.env.JWT_ACCESS_SECRET, expiresIn: '4h' },
      );
      return { access_token: newAccessToken };
    } catch (e) {
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  // Rate-limited login flow
  async attemptLogin(ip: string, username: string, password: string) {
    try {
      await limiter.consume(ip); // reduce quota
    } catch {
      throw new ForbiddenException('Too many login attempts, please try later');
    }

    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.login(user);
  }
}
