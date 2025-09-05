import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// handle logic and return data to Controller
@Injectable()
export class AppService {
  constructor(private configService: ConfigService) {}

  getHello(): string {
    const port = this.configService.get<number>('port');
    return `App running on port: ${port}`;
  }
}
