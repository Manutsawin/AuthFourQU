import { forwardRef, Module } from '@nestjs/common';
import { OtpService } from './otp.service';
import { OtpController } from './otp.controller';
import { AuthModule } from '../auth/auth.module'
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,forwardRef(()=> AuthModule)],
  controllers: [OtpController],
  providers: [OtpService],
  exports:[OtpService]
})
export class OtpModule {
}
