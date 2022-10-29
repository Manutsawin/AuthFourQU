import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Res } from '@nestjs/common';
import { CentralService } from './central.service';



@Controller('central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Post('userPayment')
  userPayment( @Req() req, @Res() res){
    // userPayment 
  }

  @Post('shopPayment')
  shopPayment( @Req() req, @Res() res){
    // shopPayment 
  }

  @Get('statement')
  statement( @Req() req, @Res() res){
    // get statement transaction Api
  }

  @Get('shopPayment')
  getShoppayment() {
    // get shop payment transaction Api
  }

}
