import { Controller, Get, Post,Req,Res ,Patch, UseGuards} from '@nestjs/common';
import { CentralService } from './central.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('access')
export class CentralController {
  constructor(private readonly centralService: CentralService) {}
  
  @UseGuards(JwtAuthGuard)
  @Get('userStatement')
  getStatement( @Req() req, @Res() res){
    this.centralService.statement(req,res)
  }
  
  // @UseGuards(JwtAuthGuard)
  // @Get('shopStatement')
  // getShopStatement(@Req() req, @Res() res) {
  //   this.centralService.shopStatement(req,res)
  // }

  @Post('test')
  postTest(@Req() req, @Res() res) {
    this.centralService.testPost(req,res)
  }

  @Get('test/:id')
  getTest(@Req() req, @Res() res) {
    this.centralService.testGet(req,res)
  }

//PAYMENT
//-------->
  @UseGuards(JwtAuthGuard)
  @Post('user-payment/deposit')
  userDeposit(@Req() req, @Res() res) {
    this.centralService.userDeposit(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-payment/info/')
  userPaymentInfo(@Req() req, @Res() res) {
    this.centralService.userPaymentInfo(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-payment/balanced/')
  userPaymentBalance(@Req() req, @Res() res) {
    this.centralService.userPaymentBalance(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-payment/')
  getQrCodePayload(@Req() req, @Res() res) {
    this.centralService.getQrCodePayload(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-payment/limit/day/')
  getPaymentLimitPerDay(@Req() req, @Res() res) {
    this.centralService.getPaymentLimitPerDay(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user-payment/limit/day/')
  patchPaymentLimitPerDay(@Req() req, @Res() res) {
    this.centralService.patchPaymentLimitPerDay(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('user-payment/allow/')
  getPaymentAllow(@Req() req, @Res() res) {
    this.centralService.getPaymentAllow(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user-payment/payment/block/')
  patchBlockPayment(@Req() req, @Res() res) {
    this.centralService.patchBlockPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('user-payment/payment/unblock/')
  patchUnBlockPayment(@Req() req, @Res() res) {
    this.centralService.patchUnBlockPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Post('user-payment/')
  userPayment(@Req() req, @Res() res) {
    this.centralService.userPayment(req,res)
  }

//---->
//shop
  @UseGuards(JwtAuthGuard)
  @Get('shop-payment/info/')
  shopPaymentInfo(@Req() req, @Res() res) {
    this.centralService.shopPaymentInfo(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('shop-payment/balanced/')
  shopPaymentBalance(@Req() req, @Res() res) {
    this.centralService.shopPaymentBalance(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('shop-payment/limit/')
  getShopPaymentLimitPerDay(@Req() req, @Res() res) {
    this.centralService.getShopPaymentLimitPerDay(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('shop-payment/limit/')
  patcShopPaymentLimitPerDay(@Req() req, @Res() res) {
    this.centralService.patcShopPaymentLimitPerDay(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('shop-payment/is-allow/')
  getShopPaymentAllow(@Req() req, @Res() res) {
    this.centralService.getShopPaymentAllow(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('shop-payment/block/')
  patchShopBlockPayment(@Req() req, @Res() res) {
    this.centralService.patchShopBlockPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Patch('shop-payment/unblock/')
  patchShopUnBlockPayment(@Req() req, @Res() res) {
    this.centralService.patchShopUnBlockPayment(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Post('shop-payment/transfer/same')
  shopPayment(@Req() req, @Res() res) {
    this.centralService.shopPayment(req,res)
  }

}
