import { Injectable, UnauthorizedException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RateLimiterMemory } from 'rate-limiter-flexible';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@users/users.service';
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
  ) {}

  async validateUser(username: string, pass: string): Promise<User | null> {
    const user = await this.usersService.findByUsername(username);
    if (user && (await bcrypt.compare(pass, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload = { username: user.username, sub: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '4h',
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async signup(username: string, email: string, password: string): Promise<User> {
    const existing = await this.usersService.findByUsername(username);
    if (existing) {
      throw new BadRequestException('Username already exists');
    }
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.register({ username, email, password: hashed });
  }

  async createUser(username: string, email: string, password: string, role: Role, currentUser?: any): Promise<User> {
    if (currentUser?.role !== Role.Admin) {
      throw new UnauthorizedException('Only admins can create users with specific roles');
    }
    const hashed = await bcrypt.hash(password, 10);
    return this.usersService.create({ username, email, password: hashed, role });
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
