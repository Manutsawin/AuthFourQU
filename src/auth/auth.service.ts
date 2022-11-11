import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Accounts} from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { AddressDto } from './dto/address.dto';
import { JwtService } from '@nestjs/jwt';
import {jwtSecret,jwtSecretAcess} from '../utils/constants';
import { Request,Response } from 'express';
import { OtpService } from '../otp/otp.service';
import { JwtRefreshService } from '../jwt-refresh/jwt-refresh.service';

@Injectable()
export class AuthService {
  constructor(private prisma : PrismaService,private jwt:JwtService,private jwtRefresh:JwtRefreshService,private readonly otpService: OtpService){}

  async signup(dto:AuthDto,req:Request ,res:Response){ 
    try{
      const {LaserID,SSN,firstName,middleName,lastName,BoD,phone,citizenship,email,title,country,salary,careerID,gaID,houseNO,village,lane,road}=dto
      
      const foundSSN = await this.prisma.accounts.findUnique({where:{SSN}});
      if(foundSSN){
        throw new BadRequestException('Bad Request');
      }
      let myDate: any = new Date();// date test
      const user = await this.prisma.accounts.create({
        data:{
          LaserID,
          SSN,
          firstName,
          middleName,
          lastName,
          BoD:myDate,//date test
          phone,
          citizenship,
          email,
          title,
          country
        }
      })
      
      await this.prisma.accountCareer.create({
        data:{
          accountID:user.id,
          careerID: careerID,
          salary: Number(salary),
        }
      })

      await this.prisma.userAdress.create({
        data:{
          accountID:user.id,
          gaID:gaID,
          houseNo:houseNO,
          village:village,
          lane:lane,
          road:road,      
        }
      })
      
      // await this.otpService.sendOTP(user.id)

      const token = await this.signRefreshToken(user.id)
      // return  res.status(201).send(user.id);
      return res.status(201).send({token,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
  }

  async signin(req:Request ,res:Response){ 
    
    try{
      const email = req.body.email
      const foundUser = await this.prisma.accounts.findUnique({where:{email}})
      if(!foundUser){
        throw new BadRequestException('Bad Request');
      }
      if(foundUser.SSN!=req.body.SSN){
        throw new BadRequestException('Bad Request');
      }
      const token = await this.signRefreshToken(foundUser.id)
      return res.status(201).send({token,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Badasd Request"})
    }
  }

  async updateCurrentAddress(dto:AddressDto,req:Request ,res:Response){

    try{
      const {gaID,houseNo,village,lane}=dto
      const payload = await this.validateAccessToken(req.headers.authorization.split(' ')[1])
      const foundUser = await this.prisma.account.findUnique({ where: payload.id })

      await foundUser.update({
        data:{ 
          gaID : gaID,
          houseNo : houseNo,
          village : village,
          lane : lane,
        }
      })
      return res.status(200).send({message:'updated',time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(304).send({message:"Not Modified"})
    }
  }

  async validateRefreshToken(token:string){
    try {
      const payload = await this.jwt.verify(token,{secret:jwtSecret})
      
      if(!payload){
        throw new BadRequestException('not authorized')
      }
  
      return  payload
    } catch (error) {
      throw new BadRequestException('not authorized')
    } 
  }

  async validateAccessToken(token:string){
    try {
      const payload = await this.jwt.verify(token,{secret:jwtSecretAcess})
      if(!payload){
        throw new BadRequestException('not authorized')
      }
      return  payload
    } catch (error) {
      throw new BadRequestException('not authorized')
    } 
  }

  async signRefreshToken(id:string){
    const user = await this.prisma.accounts.findUnique({where:{id}})
    const payload = {
      id:user.id,
      LaserID:user.LaserID,
      SSN:user.SSN,
      firstName:user.firstName,
      middleName:user.middleName,
      lastName:user.lastName,
      citizenship:user.citizenship,
      time_stamp:new Date().toISOString()
    }
    return await this.jwtRefresh.signRefreshToken(payload)
    // return await this.jwt.signAsync(payload,{secret:jwtSecret})
  }

  async signAcessToken(req:Request ,res:Response){
    const payload = await this.validateRefreshToken(req.body.token)
    const {id,LaserID,SSN,firstName,middleName,lastName,citizenship} = payload
    const data = {
      id,
      LaserID,
      SSN,
      firstName,
      middleName,
      lastName,
      citizenship,
      time_stamp: new Date().toISOString()
    }
    const token = await this.jwt.signAsync(data,{secret:jwtSecretAcess})
    return res.status(200).send({token,time_stamp:new Date().toUTCString()})
  }

  async UserIsVerified(id:string): Promise<Accounts>{
    try{
      const foundUser = await this.prisma.accounts.update({
        where:{id:id},
        data:{ isVerified : true }
      })
      return foundUser
    }
    catch{
      return null
    }
  }

  async getUserInformation(req:Request ,res:Response){
    try{
      const payload = await this.validateAccessToken(req.body.token)
      const foundUser = await this.prisma.accounts.findUnique({ where: {id:payload.id} })
      
      if(!foundUser){
        new BadRequestException('not authorized')
      }
      const {firstName,middleName,lastName,BoD,phone,email,pictureProfile}=foundUser
      const data ={
        firstName,
        middleName,
        lastName,
        BoD,
        phone,
        email,
        pictureProfile
      }
      return res.status(200).send({data,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async editPic(req:Request ,res:Response,path:string){
    try{
      const payload = await this.jwt.verify(req.body.token, { secret: jwtSecretAcess })
      const foundUser = await this.prisma.accounts.update({
        where:{id:payload.id},
        data:{ pictureProfile : path }
      })
      if (!foundUser) {
        return false;
      }
      return true
    }
    catch{
      return false
    }
  }

}
