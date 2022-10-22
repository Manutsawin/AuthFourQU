import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService} from '../auth/auth.service'
import { forwardRef, Module } from '@nestjs/common';
import { Request,Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import {otpDto} from '../otp/dto/otp.dto'


@Injectable()
export class OtpService {
  
  constructor(
    @Inject(forwardRef(() => AuthService))
    private auth : AuthService ,
    private prisma : PrismaService ,
    ){}

  async createOTP(accountID:string) {
    const expDate = new Date()
    expDate.setUTCMinutes(expDate.getUTCMinutes()+15)
    var otpNum = await this.randomOTP()
    var OtpNumber = String(otpNum)
    var duplicate = await this.prisma.oTP.findMany({where:{OtpNumber}})
    while(duplicate){
      otpNum = await this.randomOTP()
      OtpNumber = String(otpNum)
      duplicate = await this.prisma.oTP.findMany({where:{OtpNumber}})
    }

    const otp= await this.prisma.oTP.create({
      data:{
        accountID:accountID,
        expiredTime:expDate,
        OtpNumber:String(otpNum)
      }
    })
    return otp;
  }
 
  //not test
  async checkOTP(dto:otpDto,req:Request ,res:Response) {
    try {
      const otp = await this.prisma.oTP.findUnique({where:dto})
      if(otp.OtpNumber==dto.OtpNumber){
        await this.auth.UserIsVerified(dto.id)
        await this.prisma.oTP.delete({ where: dto})
        const token = await this.auth.signRefreshToken(dto.id)
        return res.send(token).status(200)
      }
      return res.send({message:'notfound'}).status(304)
    } catch (error) {
      throw new BadRequestException('not authorized')
    }
  }

  async sendOTP(accountID:string) {
    const otp = await this.createOTP(accountID)
    //send otp to mail
  }

  async randomOTP(){
    return await Math.floor(Math.random() * (999999 - 100000) + 100000)
  }
}
