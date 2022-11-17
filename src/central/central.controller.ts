import { Controller, Get, Post,Req,Res ,Patch} from '@nestjs/common';
import { CentralService } from './central.service';

@Controller('access')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}

  @Post('userPayment')
  userPayment( @Req() req, @Res() res){
    return this.centralService.userPayment(req,res)
  }

  @Post('shopPayment')
  shopPayment( @Req() req, @Res() res){
    this.centralService.shopPayment(req,res)
  }

  @Get('userStatement')
  getStatement( @Req() req, @Res() res){
    this.centralService.statement(req,res)
  }

  @Get('shopStatement')
  getShopStatement(@Req() req, @Res() res) {
    this.centralService.shopStatement(req,res)
  }

  @Post('test')
  postTest(@Req() req, @Res() res) {
    this.centralService.testPost(req,res)
  }

  @Patch('test')
  getTest(@Req() req, @Res() res) {
    this.centralService.testGet(req,res)
  }

}
