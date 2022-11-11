import { Module } from '@nestjs/common';
import { CentralService } from './central.service';
import { CentralController } from './central.controller';
import { AuthModule } from '../auth/auth.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[AuthModule,HttpModule],
  controllers: [CentralController],
  providers: [CentralService]
})
export class CentralModule {}
