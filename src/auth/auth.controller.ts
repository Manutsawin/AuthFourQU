import { Controller, Get, Post, Body, Param, Req,Res, Put, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import {AddressDto} from'./dto/address.dto';
import {  FormDataRequest } from 'nestjs-form-data';
import { ImgDto } from './dto/image.dto';
import * as fs from 'fs';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body()dto:AuthDto,@Req() req, @Res() res) {
    return this.authService.signup(dto,req,res);
  }
  
  @Post('signin')
  ReqAccessToken( @Req() req, @Res() res) {
    return this.authService.signAcessToken(req,res);
  }

  @Post('signinEmail')
  signInEmail( @Req() req, @Res() res) {
    return this.authService.signin(req,res);
  }

  @Get('globalAddress')
  async getGlobalAddress(@Req() req, @Res() res){
    return await this.authService.getGlobalAddress(req,res)
  }
  
  @UseGuards(JwtAuthGuard)
  @Post('updateCurrentAddress')
  updateCurrentAddress(@Body()dto:AddressDto ,@Req() req, @Res() res){
    return this.authService.updateCurrentAddress(dto,req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Get('information')
  getInformation( @Req() req, @Res() res){
    return this.authService.getUserInformation(req,res)
  }

  @UseGuards(JwtAuthGuard)
  @Put('editPicProfile')
  @FormDataRequest()
  async editProfilePic( @Req() req, @Res() res,@Body() dto: ImgDto){
    const edited = await this.authService.editPic(req, res,dto.image.path.toString())
    if(edited){
      return res.status(200).send({message:"edited"})
    }
    fs.unlinkSync(dto.image.path.toString())
    return res.status(400).send({message:"can't edited"})
  }

  @UseGuards(JwtAuthGuard)
  @Get('img/:imgpath')
  async seeUploadedFile(@Param('imgpath')image,@Res() res){
    return await res.sendFile(image,{root:'public'})
  }


  @Post('adminSignin')
  adminSignin( @Req() req, @Res() res) {
    return this.authService.adminLogin(req,res);
  }

  @Post('changeRefreshToken')
  signInNewRefreshToken( @Req() req, @Res() res) {
    return this.authService.changeRefreshToken(req,res);
  }

  
  @Get('informationByAccountNumber')
  getInformationByAccountNumber( @Req() req, @Res() res){
    return this.authService.getUserInformationByAccountNumber(req,res)
  }

  @Get('getAllUser')
  getIAllUser( @Req() req, @Res() res){
    return this.authService.getAllUser(req,res)
  }
}
