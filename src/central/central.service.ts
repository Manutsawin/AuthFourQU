import { Get, Injectable, Param, Post } from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthService} from '../auth/auth.service'
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { payload } from '../auth/jwt.strategy';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class CentralService { 

  constructor(private prisma : PrismaService,private auth:AuthService,private readonly httpService: HttpService){}

  async userPayment(req:Request ,res:Response){
        try{
          const payload = req.user as payload
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
          const payload = req.user as payload
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
          const payload = req.user as payload
            console.log("userStatement")
            // const response = await  this.httpService.axiosRef.get('http://localhost:3000/api/access/test',{
            //   params:{
            //     id:payload.id,
            //   }
            // });
            // console.log(response.data)
            // return res.status(200).send(response.data) ;
            return res.status(200).send({message:"test"}) ;
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  async shopStatement(req:Request ,res:Response){
        try{
          const payload = req.user as payload
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
    console.log("access")
    console.log(req.body.id)
    return res.status(200).send({message:"testGet"})
  }


  async transactionStatement(req:Request ,res:Response){
    console.log("access")
    const payload = await this.auth.validateAccessToken(req.body.token)
    const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
    const bodyStatement = {
      "userAccountID":user.id,
      "userAccountNumber":"",
      "destEmail":user.email,
      "name":user.firstName,
      "Date":req.body.Date
    }
    const statementRes = await this.httpService.axiosRef.post('http://localhost:3001/payment-transaction/statement',bodyStatement);
    return res.status(200).send({data:statementRes})
  }

}
