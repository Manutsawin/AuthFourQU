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
import { PAYMENT_SERVICE_URL ,TRANSACTION_SERVICE_URL} from 'src/httpConfig';
import * as bcrypt from 'bcrypt';


@Injectable()
export class AuthService {
  constructor(private prisma : PrismaService,private jwt:JwtService,private jwtRefresh:JwtRefreshService,private readonly otpService: OtpService,private readonly httpService: HttpService){}

  async signup(dto:AuthDto,req:Request ,res:Response){ 
    try{
      const {LaserID,SSN,firstName,middleName,lastName,BoD,phone,citizenship,email,title,country,salary,careerID,postalCode,province,district,subDistrict,houseNO,village,lane,road}=dto
     
      const foundSSN = await this.prisma.accounts.findUnique({where:{SSN}});
      if(foundSSN){
        throw new BadRequestException('Bad Request SSN');
      }
      console.log("ok")
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
          country,
          accountNumber:""
        }
      })
      console.log("created")
      await this.prisma.accountCareer.create({
        data:{
          accountID:user.id,
          careerID: careerID,
          salary: Number(salary),
        }
      })
      console.log("career created")
      await this.prisma.userAdress.create({
        data:{
          accountID:user.id,
          postalCode:postalCode,
          province:province,
          district:district,
          subDistrict:subDistrict,
          houseNo:houseNO,
          village:village,
          lane:lane,
          road:road,      
        }
      })

      console.log("create payment Account")
      // const bodyCreatePayment = {
      //   "accountID":user.id,
      // }
      // const createPaymentRes = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}/user-payment/create`,bodyCreatePayment);
      // const updateUser = await this.prisma.accounts.update({
      //   where:{id:user.id},
      //   data:{ accountNumber : createPaymentRes.data.userPayment.accountNumber}
      // })
      
      console.log("send OTP")
      
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

      const bodyActTransac = {
        "accountID":foundUser.id,
        "IPAddress":req.ip
      }

      // const createActTransac = await this.httpService.axiosRef.post(`${TRANSACTION_SERVICE_URL}/activity-transaction/`,bodyActTransac);
      
      const bodyAct = {
        "destEmail":foundUser.email,
        "transactionID":"",
        "accountID":foundUser.id,
        "IPAddress":req.ip,
        "timeStamp": new Date().toUTCString()
      }
      
      const responseMail = await this.httpService.axiosRef.post('https://quplus-noti-service.herokuapp.com/email-notification/activity',bodyAct);

      const token = await this.signRefreshToken(foundUser.id)
      return res.status(201).send({token,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
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
      return res.status(200).send({AcessToken:token,time_stamp:new Date().toUTCString()})
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
      
      const address = await this.prisma.userAdress.findUnique({where:{accountID:payload.id}})
      const {postalCode,province,district,subDistrict,houseNo,village,lane,road} = address
      const {firstName,middleName,lastName,BoD,phone,email,pictureProfile}=foundUser
      const data ={
        firstName,
        middleName,
        lastName,
        BoD,
        phone,
        email,
        pictureProfile,
        address:{
          postalCode,
          province,
          district,
          subDistrict,
          houseNo,
          village,
          lane,
          road
        }
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
      
      const passhash = await bcrypt.hash(password,10)
      
      const admin = await this.prisma.admin.create({
        data:{
          firstName,
          middleName,
          lastName,
          password:passhash,
          phone,
          email
        }
      })
      return res.status(201).send({id:admin.id,firstName:admin.firstName,middleName:admin.middleName,lastName:admin.lastName})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    }
  }

  async adminLogin(req:Request,res:Response){
    try{
      const admin = await this.prisma.admin.findUnique({where:{email:req.body.email}})
      const isMatch = await bcrypt.compare(req.body.password, admin.password);
      if(isMatch){
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

  async getUserInformationByAccountNumber(req:Request ,res:Response){
    try{

      const payload = req.user as payload
      const foundUser = await this.prisma.accounts.findFirst({ where: {accountNumber:req.body.accountNumber} })
      const address = await this.prisma.userAdress.findUnique({where:{accountID:foundUser.id}})
      const {postalCode,province,district,subDistrict,houseNo,village,lane,road} = address
      const {firstName,middleName,lastName,BoD,phone,email,pictureProfile}=foundUser
      const data ={
        firstName,
        middleName,
        lastName,
        BoD,
        phone,
        email,
        pictureProfile,
        address:{
          postalCode,
          province,
          district,
          subDistrict,
          houseNo,
          village,
          lane,
          road
        }
      }
      return res.status(200).send({data,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }


}
