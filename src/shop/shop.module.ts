import { Module } from '@nestjs/common';
import { ShopService } from './shop.service';
import { ShopController } from './shop.controller';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule,AuthModule],
  controllers: [ShopController],
  providers: [ShopService],
  exports:[ShopService]
})
export class ShopModule {}
