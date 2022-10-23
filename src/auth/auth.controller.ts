import { Controller, Get, Post, Body, Patch, Param, Delete, Req,Res, UseInterceptors, UploadedFile, ParseFilePipe, FileTypeValidator } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import {AddressDto} from'./dto/address.dto';
import { FilesInterceptor } from '@nestjs/platform-express';

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
  
  @Post('updateCurrentAddress')
  updateCurrentAddress(@Body()dto:AddressDto ,@Req() req, @Res() res){
    return this.authService.updateCurrentAddress(dto,req,res)
  }

  @Get('information')
  getInformation( @Req() req, @Res() res){
    return this.authService.getUserInformation(req,res)
  }

  @Post('/file')
  @UseInterceptors(FilesInterceptor('image'),)
  async auploadFile(@Req() req,@UploadedFile() file: Express.Multer.File){
    console.log(file)
  }

  @Post('token')//test
  async validateAcessToken( @Req() req, @Res() res) {
    const payload = await this.authService.validateAccessToken(req.body.token)
    return res.status(200).send({payload});
  }
}
