import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'prisma/prisma.module';
import { OtpModule } from '../otp/otp.module';
import { JwtRefreshModule } from '../jwt-refresh/jwt-refresh.module';
import { FileSystemStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import {jwtSecretAcess} from '../utils/constants';


@Module({
  imports:[
    JwtModule.register({
      secret:jwtSecretAcess,
      signOptions:{ expiresIn:'60m'}
    }),
    JwtRefreshModule,
    PrismaModule,
    OtpModule,
    NestjsFormDataModule.config({
      storage: FileSystemStoredFile,
      fileSystemStoragePath: './public/picProfile',
      autoDeleteFile:false
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports:[AuthService],
})
export class AuthModule {
}
