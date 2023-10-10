import * as joi from 'joi';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WhatsappModule } from './whatsapp/whatsapp.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as dotenv from 'dotenv';
import { CategoriesModule } from './categories/categories.module';

dotenv.config();

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
      cache: false,
      isGlobal: true,
      validationSchema: joi.object({
        TWILIO_ACCOUNT_SID: joi.string().required(),
        TWILIO_AUTH_TOKEN: joi.string().required(),
        TWILIO_APP_WA_ID: joi.string().required(),
      }),
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://postgres:EEJfHofgGnnTMF7g@db.wofylnqdnasreblhljse.supabase.co:5432/postgres',
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      autoLoadEntities: true,
      synchronize: process.env.ENV !== 'production',
      logging: process.env.ENV !== 'production',
    }),
    CategoriesModule,
    WhatsappModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
