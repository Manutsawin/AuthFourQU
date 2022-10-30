import { Injectable } from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthService} from '../auth/auth.service'
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CentralService { 

  constructor(private prisma : PrismaService,private auth:AuthService){}

  async userPayment(req:Request ,res:Response){
        try{
            const payload = await this.auth.validateAccessToken(req.body.token)
            console.log("userPayment")
            return res.status(200).send({payload})
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  async shopPayment(req:Request ,res:Response){
        try{
          const payload = await this.auth.validateAccessToken(req.body.token)
          const accountID = payload.id
          const shop = this.prisma.shop.findUnique({where:{accountID}})
          console.log("shopPayment")
          return res.status(200).send({shop})
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  async statement(req:Request ,res:Response){
        try{
            const payload = await this.auth.validateAccessToken(req.body.token)
            console.log("userStatement")
            return res.status(200).send({payload})
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  async shopStatement(req:Request ,res:Response){
        try{
          const payload = await this.auth.validateAccessToken(req.body.token)
          const accountID = payload.id
          const shop = await this.prisma.shop.findUnique({where:{accountID}})
          console.log("getShopStatement")
          return res.status(200).send({shop})
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }
}
