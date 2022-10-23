import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Accounts} from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { AddressDto } from './dto/address.dto';
import { JwtService } from '@nestjs/jwt';
import {jwtSecret,jwtSecretAcess} from '../utils/constants';
import { Request,Response } from 'express';
import { OtpService } from '../otp/otp.service';


@Injectable()
export class AuthService {
  constructor(private prisma : PrismaService,private jwt:JwtService,private readonly otpService: OtpService){}

  async signup(dto:AuthDto,req:Request ,res:Response){ 
    const {LaserID,SSN,firstName,middleName,lastName,BoD,phone,citizenship,email,title,country,salary,careerID,gaID,houseNO,village,lane,road}=dto
    const foundSSN = await this.prisma.accounts.findUnique({where:{SSN}});
    if(foundSSN){
      throw new BadRequestException('Wrong credentail');
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
    // return  res.send(user.id).status(201);
    return res.send({token})
    
  }

  async updateCurrentAddress(dto:AddressDto,req:Request ,res:Response){
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
    return res.status(200).send({message:'updated'})
  }

  async validateRefreshToken(token:string){
    try {
      const payload = await this.jwt.verify(token,{secret:jwtSecret})
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
      const time1 = new Date(payload.timeExp)
      const time2 = new Date()
      if(time1<time2){
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
    }
    return await this.jwt.signAsync(payload,{secret:jwtSecret})
  }

  async signAcessToken(req:Request ,res:Response){
    const payload = await this.validateRefreshToken(req.body.token)
    const {id,LaserID,SSN,firstName,middleName,lastName,citizenship} = payload
    const exp = new Date()
    exp.setUTCMinutes(exp.getUTCMinutes()+5)
    const data = {
      id,
      LaserID,
      SSN,
      firstName,
      middleName,
      lastName,
      citizenship,
      timeExp:exp.toISOString()
    }
    const token = await this.jwt.signAsync(data,{secret:jwtSecretAcess})
    return res.status(200).send({token})
  }

  async UserIsVerified(id:string): Promise<Accounts>{
    const foundUser = await this.prisma.accounts.update({
      where:{id:id},
      data:{ isVerified : true }
    })
    return foundUser
  }

  async getUserInformation(req:Request ,res:Response){
    const payload = await this.validateAccessToken(req.headers.authorization.split(' ')[1])
    const foundUser = await this.prisma.account.findUnique({ where: payload.id })
    if(!foundUser){
      new BadRequestException('not authorized')
    }
    const {firstName,middleName,lastName,BoD,phone,email}=foundUser
    const data ={
      firstName,
      middleName,
      lastName,
      BoD,
      phone,
      email
    }
    return res.status(200).send({data})
  }

}
