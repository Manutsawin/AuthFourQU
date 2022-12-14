import { OtpService } from './otp.service';
import { Controller, Post, Body, Req,Res } from '@nestjs/common';
import {otpDto} from '../otp/dto/otp.dto'

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('create')
  create(@Req() req, @Res() res) {
    return this.otpService.createOTP(req.body.id,req);
  }

  @Post('check')
  checkOTP(@Body()dto:otpDto,@Req() req, @Res() res) {
    return this.otpService.checkOTP(dto,req,res);
  }

 
}
