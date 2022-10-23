import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { OtpModule } from '../otp/otp.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports:[
    JwtModule,PrismaModule,OtpModule,
    MulterModule.register({
      dest:'./public',
    }) 
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService],
})
export class AuthModule {
}
