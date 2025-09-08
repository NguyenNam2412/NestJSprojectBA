import { Controller, Post, Body, UnauthorizedException, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Role } from '@users/role.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('csrf-token')
  getCsrfToken(
    @Req() req: any,
  ) {
    return { csrfToken: req.csrfToken() };
  }
  

  @Post('signup')
  async signup(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
  ) {
    return this.authService.signup(username, email, password);
  }

  @Post('create')
  async create(
    @Body('username') username: string,
    @Body('email') email: string,
    @Body('password') password: string,
    @Body('role') role: Role,
    @Req() req: any,
  ) {
    return this.authService.createUser(username, email, password, role, req.user);
  }


  // Login with rate limit
  @Post('login')
  async login(
    @Body('username') username: string,
    @Body('password') password: string,
    @Req() req: any,
  ) {
    const ip = req.ip || req.connection.remoteAddress;
    return this.authService.attemptLogin(ip, username, password);
  }

  @Post('refresh')
  async refresh(@Body('refresh_token') refreshToken: string) {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    return this.authService.refreshToken(refreshToken);
  }

}
