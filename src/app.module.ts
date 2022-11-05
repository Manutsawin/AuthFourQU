import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { OtpModule } from './otp/otp.module';
import { ShopModule } from './shop/shop.module';
import { CentralModule } from './central/central.module';
import { MulterModule } from '@nestjs/platform-express';
import { JwtRefreshModule } from './jwt-refresh/jwt-refresh.module';

@Module({
  imports: [
    AuthModule,
    PrismaModule, 
    OtpModule, 
    ShopModule, 
    CentralModule,
    MulterModule.register({
      dest:'./public',
    }),
    JwtRefreshModule 
  ],
})
export class AppModule {}
