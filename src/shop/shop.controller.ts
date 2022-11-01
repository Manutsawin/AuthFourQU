import { Controller, Get, Post, Body, Req,Res } from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';

@Controller('shop')
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('signup')
  signup(@Body()dto:CreateShopDto,@Req() req, @Res() res) {
    return this.shopService.create(dto,req,res);
  }

  @Get('information')
  getInformation(@Body()dto:CreateShopDto,@Req() req, @Res() res) {
    return this.shopService.getInformation(req,res)
  }

}
