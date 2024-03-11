import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_FILTER } from '@nestjs/core';
import { GlobalExceptionsFilter } from './filters/exception-filter';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongo.config';
import { ModelsProvider } from './schemas/model.provider';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      useClass: MongooseConfig,
    }),
    MongooseModule.forFeature(ModelsProvider),
    JwtModule.register({
      secret: '%!secrect!%',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    JwtService,
    { provide: APP_FILTER, useClass: GlobalExceptionsFilter },
  ],
})
export class AppModule {}
