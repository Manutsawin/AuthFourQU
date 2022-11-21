import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { Accounts} from '@prisma/client';
import { AuthDto } from './dto/auth.dto';
import { AddressDto } from './dto/address.dto';
import { JwtService } from '@nestjs/jwt';
import {jwtSecret,jwtSecretAcess,jwtSecretAdmin} from '../utils/constants';
import { Request,Response } from 'express';
import { OtpService } from '../otp/otp.service';
import { JwtRefreshService } from '../jwt-refresh/jwt-refresh.service';
import { HttpService } from '@nestjs/axios';
import { payload } from './jwt.strategy';
import { PAYMENT_SERVICE_URL } from 'src/httpConfig';

@Injectable()
export class AuthService {
  constructor(private prisma : PrismaService,private jwt:JwtService,private jwtRefresh:JwtRefreshService,private readonly otpService: OtpService,private readonly httpService: HttpService){}

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

      const bodyCreatePayment = {
        "accountID":user.id,
      }
      const createPaymentRes = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}/user-payment/create`,bodyCreatePayment);

      await this.otpService.sendOTP(user.id,user.email,req)
      console.log("finished send otp to mail")

      // const token = await this.signRefreshToken(user.id)
      // return res.status(201).send({token:token,id:user.id,time_stamp:new Date().toUTCString()})

      return res.status(201).send({message:"waiting for confirmation",id:user.id,time_stamp:new Date().toUTCString()})
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

      console.log("signIn transaction api")

      const bodyActTransac = {
        "accountID":foundUser.id,
        "IPAddress":req.ip
      }

      // const createActTransac = await this.httpService.axiosRef.post('http://localhost:3001/activity-transaction/',bodyActTransac);
      
      // const bodyAct = {
      //   "destEmail":foundUser.email,
      //   "transactionID":"",
      //   "accountID":foundUser.id,
      //   "IPAddress":req.ip,
      //   "timeStamp": new Date().toUTCString()
      // }
      console.log("send email activity")
      // const responseMail = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',bodyAct);

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
      const payload = req.user as payload
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
      firstName:user.firstName,
      middleName:user.middleName,
      lastName:user.lastName,
      time_stamp:new Date().toISOString()
    }
    return await this.jwtRefresh.signRefreshToken(payload)
    // return await this.jwt.signAsync(payload,{secret:jwtSecret})
  }

  async signAcessToken(req:Request ,res:Response){
    try{
      const payload = await this.validateRefreshToken(req.headers.authorization.split(" ")[1])
      const {id,firstName,middleName,lastName} = payload
      const data = {
      id,
      firstName,
      middleName,
      lastName,
      time_stamp: new Date().toISOString()
      }
      const token = await this.jwt.signAsync(data,{secret:jwtSecretAcess})
      return res.status(200).send({token,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
    
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

      const payload = req.user as payload
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
      const payload = req.user as payload
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

  async getGlobalAddress(req:Request,res:Response){
    const addressList = await this.prisma.globalAddress.findMany()
    return res.status(200).send({addressList,time_stamp:new Date().toUTCString()})
  }

  async adminSignUp(req:Request,res:Response){
    try{
      const {firstName,middleName,lastName,password,phone,email} = req.body
      const admin = await this.prisma.admin.create({
        data:{
          firstName,
          middleName,
          lastName,
          password,
          phone,
          email
        }
      })
      return res.status(201).send({id:admin.id})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
  }

  async adminLogin(req:Request,res:Response){
    try{
      const admin = await this.prisma.admin.findUnique({where:{email:req.body.email}})
      if(admin.password==req.body.password){
        const payload = {
          "id":admin.id,
          "time_stamp":new Date().toUTCString()
        }
        const token = await this.jwtRefresh.signRefreshTokenAdmin(payload)

        return res.status(201).send({"token":token})
      }
      return res.status(400).send({message:"Bad Request"})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
  }

  async validateAdminToken(token:string){
    try {
      const payload = await this.jwt.verify(token,{secret:jwtSecretAdmin})
      
      if(!payload){
        throw new BadRequestException('not authorized')
      }
  
      return  payload
    } catch (error) {
      throw new BadRequestException('not authorized')
    } 
  }

  async changeRefreshToken(req:Request ,res:Response){
    try{
      const payload = await this.validateRefreshToken(req.headers.authorization.split(" ")[1])
      const {id,firstName,middleName,lastName} = payload
      const data = {
        id,
        firstName,
        middleName,
        lastName,
        time_stamp: new Date().toISOString()
      }
      const token = await this.jwt.signAsync(data,{secret:jwtSecret})
      return res.status(200).send({token,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
    
  }

  
  

}
