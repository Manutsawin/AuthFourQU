import { Get, Injectable } from '@nestjs/common';
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
            const text =  await this.root();
            console.log(text)
            return res.status(200).send({text}) ;
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  @Get()
  async root() {
    return await lastValueFrom(this.httpService.get('http://localhost:3000/api/access/test').pipe(
      map((res) => res.data)
    ));
  }

  // async find(){
  //   // return this.httpService.get('http://localhost:3000/api/access/test').pipe(
  //   //   map(response => response)
  //   // );
  //   const response = await (await this.httpService.get('http://localhost:3000/api/access/test');
  //   return response.data;
  // }

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
  async test(req:Request ,res:Response){
    
    return res.status(200).send({message:"test"})
    
}
}
