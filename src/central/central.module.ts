import { Module } from '@nestjs/common';
import { CentralService } from './central.service';
import { CentralController } from './central.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports:[AuthModule],
  controllers: [CentralController],
  providers: [CentralService]
})
export class CentralModule {}
