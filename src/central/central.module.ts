import { Module } from '@nestjs/common';
import { CentralService } from './central.service';
import { CentralController } from './central.controller';

@Module({
  controllers: [CentralController],
  providers: [CentralService]
})
export class CentralModule {}
