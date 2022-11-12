import { Get, Injectable, Param, Post } from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthService} from '../auth/auth.service'
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CentralService { 

  constructor(private prisma : PrismaService,private auth:AuthService,private readonly httpService: HttpService){}

  async userPayment(req:Request ,res:Response){
        try{
            const payload = await this.auth.validateAccessToken(req.body.token)
            console.log("userPayment")
            const response = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',req.body);
            console.log(response.data)
            return res.status(200).send(response.data) ;
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
          const response = await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',req.body);
            console.log(response.data)
            return res.status(200).send(response.data) ;
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  async statement(req:Request ,res:Response){
        try{
            const payload = await this.auth.validateAccessToken(req.body.token)
            console.log("userStatement")
            const response = await  this.httpService.axiosRef.get('http://localhost:3000/api/access/test',{
              params:{
                id:payload.id,
              }
            });
            console.log(response.data)
            return res.status(200).send(response.data) ;
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
          const response = await  this.httpService.axiosRef.get('http://localhost:3000/api/access/test',{
              params:{
                id:payload.id,
              }
            });
            console.log(response.data)
            return res.status(200).send(response.data) ;
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }


//  ----------------------------------------------------------------------------------------
  // @Post()
  // async root(req:Request) {
  //   return await this.httpService.axiosRef.post('http://localhost:3000/api/access/test',req.body);
  // }

  async testPost(req:Request ,res:Response){
    console.log(req.body)
    return res.status(200).send({message:"testPost"})
  }

  async testGet(req:Request ,res:Response){
    console.log(req.query.id)
    return res.status(200).send({message:"testGet"})
  }
}
