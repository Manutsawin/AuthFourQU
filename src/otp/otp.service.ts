import { Body, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AuthService} from '../auth/auth.service'
import { forwardRef, Module } from '@nestjs/common';
import { Request,Response } from 'express';
import { BadRequestException } from '@nestjs/common';
import {otpDto} from '../otp/dto/otp.dto'
import { userInfo } from 'os';
import { HttpService } from '@nestjs/axios';
import { TRANSACTION_SERVICE_URL } from 'src/httpConfig';


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
      // const resCreateTransacOtp = await this.httpService.axiosRef.post('${TRANSACTION_SERVICE_URL}/otp-transaction',bodyOtp);
      
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
        // const qresponseOtpUpdate = await this.httpService.axiosRef.patch(`${TRANSACTION_SERVICE_URL}/otp-transaction`,{id:user.id});

        console.log("api transaction")
        const bodyRegister = {
            "destEmail":user.email,
            "transactionID":"",
            "accountID":user.id,
            "IPAddress":req.ip,
            "timeStamp": new Date().toUTCString()
        }
        console.log("send email register")
        // const responseMailRegis = await this.httpService.axiosRef.post('https://quplus-noti-service.herokuapp.com/email-notification/welcome',bodyRegister);
        
        const bodyAct = {
          "destEmail":user.email,
          "transactionID":"",
          "accountID":user.id,
          "IPAddress":req.ip,
          "timeStamp": new Date().toUTCString()
        }
        console.log("send email activity")
        // const responseMailAct = await this.httpService.axiosRef.post('https://quplus-noti-service.herokuapp.com/email-notification/activity',bodyAct);

        console.log("create activity")
        const bodyActTransac = {
          "accountID":user.id,
          "IPAddress":req.ip
        }
        // const createActTransac = await this.httpService.axiosRef.post(`${TRANSACTION_SERVICE_URL}/activity-transaction/`,bodyActTransac);

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
      console.log("beforeCreateBody")
      const body={
        "destEmail" : email,
        "OTP": otp.OtpNumber
      }
      console.log("beforesendmail")
      const responseMail = await this.httpService.axiosRef.post('https://quplus-noti-service.herokuapp.com/email-notification/otp',body);
      //send otp to mail
      console.log("sendmail")
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
