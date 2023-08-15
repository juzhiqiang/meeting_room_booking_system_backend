import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FormatResponseInterceptor } from './format-response.interceptor';
import { InvokeRecordInterceptor } from './invoke-record.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 开启校验
  app.useGlobalPipes(new ValidationPipe());
  // 启用返回拦截器
  app.useGlobalInterceptors(new FormatResponseInterceptor());
  app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
