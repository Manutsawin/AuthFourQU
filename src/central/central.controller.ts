import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Res } from '@nestjs/common';
import { CentralService } from './central.service';



@Controller('central')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Post('transfer')
  transfer( @Req() req, @Res() res){
  }

  @Get('statement')
  statement( @Req() req, @Res() res){
  }

}
