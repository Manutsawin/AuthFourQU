import { Controller, Get, Post,Req,Res ,Patch, UseGuards} from '@nestjs/common';
import { CentralService } from './central.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('access')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}
  
  @UseGuards(JwtAuthGuard)
  @Post('userPayment')
  userPayment( @Req() req, @Res() res){
    return this.centralService.userPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Post('shopPayment')
  shopPayment( @Req() req, @Res() res){
    this.centralService.shopPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('userStatement')
  getStatement( @Req() req, @Res() res){
    this.centralService.statement(req,res)
  }
  
  @UseGuards(JwtAuthGuard)
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
