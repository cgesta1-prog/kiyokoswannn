import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';
import type { HelloResponseDto } from './dto/hello.dto';
import type { HealthResponseDto } from './dto/health.dto';
import { BadRequestException } from '@nestjs/common';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  hello(): string {
    return this.appService.hello();
  }

  @Get('hello/:name')
  helloName(@Param('name') name: string): HelloResponseDto {
    return this.appService.helloName(name);
  }

  @Get('square/:n')
square(@Param('n') n: string) {
  const value = Number(n);

  if (!Number.isFinite(value)) {
    throw new BadRequestException('n must be a number');
  }

  return {
    n: value,
    square: value * value,
  };
}


  @Get('health')
  health(): HealthResponseDto {
    return this.appService.health();
  }
}