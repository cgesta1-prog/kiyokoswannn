import { Injectable } from '@nestjs/common';
import { HelloResponseDto } from './dto/hello.dto';
import { HealthResponseDto } from './dto/health.dto';

@Injectable()
export class AppService {
  square(n: string) {
    throw new Error('Method not implemented.');
  }
  health(): HealthResponseDto {
  return {
    status: 'ok',
    uptimeSeconds: Math.floor(process.uptime()),
    now: new Date().toISOString(),
  };
}

  hello(): string {
    return 'Hello World';
  }
  
  helloName(name: string): HelloResponseDto {
    const cleaned = name.trim();

    return {
      message: `Hello, ${cleaned}!`,
      at: new Date().toISOString(),
    };
  }
}
