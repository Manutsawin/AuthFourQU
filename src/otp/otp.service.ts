import { Body, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService} from '../auth/auth.service'
import { forwardRef, Module } from '@nestjs/common';
import { Request,Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import {otpDto} from '../otp/dto/otp.dto'


@Injectable()
export class OtpService {
  httpService: any;
  
  constructor(
    @Inject(forwardRef(() => AuthService))
    private auth : AuthService ,
    private prisma : PrismaService ,
    ){}

  async createOTP(accountID:string) {
    try{
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
    catch{
      return null
    }
  }
 
  async checkOTP(dto:otpDto,req:Request ,res:Response) {
    try {
      const otp = await this.prisma.oTP.findUnique({where:dto})
      if(otp.OtpNumber==dto.OtpNumber){
        await this.auth.UserIsVerified(dto.id)
        await this.prisma.oTP.delete({ where: dto})
        
        const user = await this.prisma.accounts.findUnique({where:{id:dto.id}})

        console.log("api transaction")
        
        
        
        const bodyRegister = {
            "destEmail":user.email,
            "transactionID":"",
            "accountID":user.id,
            "IPAddress":req.ip,
            "timeStamp": new Date().toUTCString()
        }
        console.log("send email register")
        // const responseMail = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',bodyRegister);
        
        const bodyAct = {
          "destEmail":user.email,
          "transactionID":"",
          "accountID":user.id,
          "IPAddress":req.ip,
          "timeStamp": new Date().toUTCString()
        }
        console.log("send email activity")
        // const responseMail = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',bodyAct);

        const token = await this.auth.signRefreshToken(dto.id)
        return res.status(200).send(token)
      }
      return res.status(304).send({message:'not found'})
    } catch (error) {
      throw new BadRequestException('not authorized')
    }
  }

  async sendOTP(accountID:string,email:string) {
    try{
      const otp = await this.createOTP(accountID)
      const body={
        "destEmail" : email,
        "OTP": otp.OtpNumber
      }
      console.log("sendOTp")
      // const responseMail = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',body);
      //send otp to mail
    }
    catch(error){
      throw new BadRequestException("can't send otp")
    }
    
  }

  async randomOTP(){
    return await Math.floor(Math.random() * (999999 - 100000) + 100000)
  }
}
