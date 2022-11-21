import { Injectable} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request,Response } from 'express';
import { AuthService } from '../auth/auth.service'
import { BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { payload } from '../auth/jwt.strategy';
import { PAYMENT_SERVICE_URL } from 'src/httpConfig';

@Injectable()
export class ShopService {
  constructor(private prisma : PrismaService,private auth:AuthService,private readonly httpService: HttpService){}

  async create(dto: CreateShopDto,req:Request ,res:Response) {
    try{

      
      const payload = await this.auth.validateAdminToken(req.headers.authorization.split(" ")[1])
    
      const {accountID,shopName,bussinessType,createdDate,salesPerYear,postalCode,province,district,subDistrict,houseNO,village,lane,road} = dto
      const d = new Date() //test time
   
      const account = await this.prisma.accounts.findUnique({where:{id:accountID}})
   
      const shop = await this.prisma.shop.create({
        data:{
          accountID:accountID,
          shopName:shopName,
          bussinessType:bussinessType,
          createdDate:d, //must edit later
          salesPerYear:salesPerYear,
        }
      })

      
      
      await this.prisma.shopAddress.create({
        data:{
          shopID:shop.id,
          postalCode,
          province,
          district,
          subDistrict,
          houseNO:houseNO,
          village:village,
          lane:lane,
          road:road,
        }
      })
      

      const bodyCreateShopPayment = {
        "shopID":shop.id,
        "callbackURL":req.body.callbackURL
      }
      const createShopPaymentRes = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}/shop-payment/create`,bodyCreateShopPayment);

      const bodymail = {  
        "destEmail" : account.email,
        "name" : account.firstName,
        "shopName" : shop.shopName
      }
     
      
      const mailShop = await this.httpService.axiosRef.post('http://192.168.1.38:8090/email-notification/shop-registered',bodymail);
     

      return res.status(201).send({shop:shop,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"can't create"})
    }
    
    
  }

  async getInformation(req:Request ,res:Response){
    try {
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const address = await this.prisma.shopAddress.findUnique({where:{shopID:shop.id}})
      const {postalCode,province,district,subDistrict,houseNO,village,lane,road}=address
      const data = {
        id:shop.id,
        acountID:shop.accountID,
        shopName:shop.shopName,
        bussinessType:shop.bussinessType,
        address:{
          postalCode,
          province,
          district,
          subDistrict,
          houseNO,
          village,
          lane,
          road
        }
      }
      return res.status(200).send({data,time_stamp:new Date().toUTCString()})
    } catch (error) {
      throw new BadRequestException('not authorized')
    }
  }

}