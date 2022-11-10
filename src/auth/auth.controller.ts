import { Controller, Get, Post, Body, Param, Req,Res, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import {AddressDto} from'./dto/address.dto';
import {  FormDataRequest } from 'nestjs-form-data';
import { FormDataTestDto } from './dto/image.dto';
import * as fs from 'fs';


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
  
  @Post('updateCurrentAddress')
  updateCurrentAddress(@Body()dto:AddressDto ,@Req() req, @Res() res){
    return this.authService.updateCurrentAddress(dto,req,res)
  }

  @Get('information')
  getInformation( @Req() req, @Res() res){
    return this.authService.getUserInformation(req,res)
  }

  @Post('token')//test
  async validateAcessToken( @Req() req, @Res() res) {
    const payload = await this.authService.validateAccessToken(req.body.token)
    return res.status(200).send({payload});
  }

  @Put('editPicProfile')
  @FormDataRequest()
  async editProfilePic( @Req() req, @Res() res,@Body() dto: FormDataTestDto){
    const edited = await this.authService.editPic(req, res,dto.image.path.toString())
    if(edited){
      return res.status(200).send({message:"edited"})
    }
    fs.unlinkSync(dto.image.path.toString())
    return res.status(400).send({message:"can't edited"})
  }

  @Get('img/:imgpath')
  async seeUploadedFile(@Param('imgpath')image,@Res() res){
    return await res.sendFile(image,{root:'public'})
  }
}
