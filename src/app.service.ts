import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// handle logic and return data to Controller
@Injectable()
export class AppService implements OnModuleInit {
  constructor(private configService: ConfigService) {}

  private readonly logger = new Logger(AppService.name);

  onModuleInit() {
    this.logger.log('AppService initialized');
  }

  doSomething() {
    this.logger.debug('Debugging something...');
    this.logger.warn('This is a warning!');
    this.logger.error('Something went wrong!');
  }

  getHello(): string {
    const port = this.configService.get<number>('port');
    return `App running on port: ${port}`;
  }
}
