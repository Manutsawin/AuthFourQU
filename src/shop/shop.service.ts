import { Injectable } from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { PrismaService } from 'prisma/prisma.service';
import { Request,Response } from 'express';
import { AuthService } from '../auth/auth.service'
import { BadRequestException } from '@nestjs/common';

@Injectable()
export class ShopService {
  constructor(private prisma : PrismaService,private auth:AuthService){}

  async create(dto: CreateShopDto,req:Request ,res:Response) {
    try{
      const {accountID,shopName,bussinessType,createdDate,salesPerYear,gaID,houseNO,village,lane,road} = dto
      const shop = await this.prisma.shop.create({
        data:{
          accountID,
          shopName,
          bussinessType,
          createdDate,
          salesPerYear,
        }
      })
      
      await this.prisma.shopAddress.create({
        data:{
          shopID:shop.id,
          gaID,
          houseNO,
          village,
          lane,
          road,
        }
      })

      return res.status(201).send({shop,time_stamp:new Date().toUTCString()})
    }
    catch{
      return res.status(400).send({message:"can't create"})
    }
    
    
  }

  async getInformation(req:Request ,res:Response){
    try {
      const payload = await this.auth.validateAccessToken(req.headers.authorization.split(' ')[1])
      if(!payload){
        new BadRequestException('not authorized')
      }
      const shop = await this.prisma.shop.findUnique(payload.id)
      const data = {
        id:shop.id,
        acountID:shop.accountID,
        shopName:shop.shopName,
        bussinessType:shop.bussinessType,
      }
      return res.status(200).send({data,time_stamp:new Date().toUTCString()})
    } catch (error) {
      throw new BadRequestException('not authorized')
    }
  }

}