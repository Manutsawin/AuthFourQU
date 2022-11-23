import { Controller, Get, Post, Body, Req,Res, UseGuards } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('signup')
  signup(@Body()dto:CreateShopDto,@Req() req, @Res() res) {
    return this.shopService.create(dto,req,res);
  }

  @UseGuards(JwtAuthGuard)
  @Get('information')
  getInformation(@Req() req, @Res() res) {
    return this.shopService.getInformation(req,res)
  }

  @Get('getAllShop')
  getIAllShop( @Req() req, @Res() res){
    return this.shopService.getAllShop(req,res)
  }

}
