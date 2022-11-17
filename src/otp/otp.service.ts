import { Body, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService} from '../auth/auth.service'
import { forwardRef, Module } from '@nestjs/common';
import { Request,Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import {otpDto} from '../otp/dto/otp.dto'
import { userInfo } from 'os';
import { HttpService } from '@nestjs/axios';


@Injectable()
export class OtpService {
 
  constructor(
    @Inject(forwardRef(() => AuthService))
    private auth : AuthService ,
    private prisma : PrismaService ,
    private readonly httpService: HttpService
    ){}

  async createOTP(accountID:string,req:Request) {
    try{
      const expDate = new Date()
      expDate.setUTCMinutes(expDate.getUTCMinutes()+15)
      var otpNum = await this.randomOTP()
      var OtpNumber = String(otpNum)
      var duplicate = await this.prisma.oTP.findFirst({where:{OtpNumber}})
      console.log("Access")
      while(duplicate){
        otpNum = await this.randomOTP()
        OtpNumber = String(otpNum)
        duplicate = await this.prisma.oTP.findFirst({where:{OtpNumber}})
      }
  
      const otp= await this.prisma.oTP.create({
        data:{
          accountID:accountID,
          expiredTime:expDate,
          OtpNumber:String(otpNum)
        }
      })

      const bodyOtp ={
        "refNumber": accountID,
        "type":"login",
        "timeStart":new Date().toUTCString(),
        "isFinished":false,
        "IPAddress":req.ip
      }
      console.log("create OTP Transaction")
      // const resCreateTransacOtp = await this.httpService.axiosRef.post('http://localhost:3000/otp-transaction',bodyOtp);
      
      return otp;
    }
    catch{
      return null
    }
  }
 
  async checkOTP(dto:otpDto,req:Request ,res:Response) {
    try {
      
      const otp = await this.prisma.oTP.findFirst({where:{accountID:dto.id}})
      
      if(otp.OtpNumber==dto.OtpNumber){
        await this.auth.UserIsVerified(dto.id)
        console.log(otp)
        await this.prisma.oTP.delete({ where:{id:otp.id}})
        console.log("deleted")
        const user = await this.prisma.accounts.findUnique({where:{id:dto.id}})

        console.log("update Otp")
        // const responseOtpUpdate = await this.httpService.axiosRef.patch('http://localhost:3000/api/otp-transaction',{params:{id:user.id}});

        console.log("api transaction")
        const bodyRegister = {
            "destEmail":user.email,
            "transactionID":"",
            "accountID":user.id,
            "IPAddress":req.ip,
            "timeStamp": new Date().toUTCString()
        }
        console.log("send email register")
        const responseMailRegis = await this.httpService.axiosRef.post('http://localhost:8090/email-notification/welcome',bodyRegister);
        
        const bodyAct = {
          "destEmail":user.email,
          "transactionID":"",
          "accountID":user.id,
          "IPAddress":req.ip,
          "timeStamp": new Date().toUTCString()
        }
        console.log("send email activity")
        const responseMailAct = await this.httpService.axiosRef.post('http://localhost:8090/email-notification/activity',bodyAct);

        const bodyTransacAct = {
          "accountID":user.id,
          "IPAddress":req.ip
        }
        console.log("create activity")
        // const responseTransacAct = await this.httpService.axiosRef.post('http://localhost:3000/activity-transaction',bodyTransacAct);

        const token = await this.auth.signRefreshToken(dto.id)
        return res.status(200).send({token:token})
      }
      return res.status(304).send({message:'Not found'})
    } catch (error) {
      throw new BadRequestException('Not found')
    }
  }

  async sendOTP(accountID:string,email:string,req:Request) {
    
    try{
      
      const otp = await this.createOTP(accountID,req)
      const body={
        "destEmail" : email,
        "OTP": otp.OtpNumber
      }
      const responseMail = await this.httpService.axiosRef.post('http://localhost:8090/email-notification/otp',body);
      //send otp to mail
      return responseMail
    }
    catch(error){
      throw new BadRequestException("can't send otp")
      return
    }
    
  }

  async randomOTP(){
    return await Math.floor(Math.random() * (999999 - 100000) + 100000)
  }
}
