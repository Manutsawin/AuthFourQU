import { Get, Injectable, Param, Post } from '@nestjs/common';
import { Request,Response } from 'express';
import { AuthService} from '../auth/auth.service'
import { PrismaService } from 'prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { payload } from '../auth/jwt.strategy';
import { lastValueFrom, map, Observable } from 'rxjs';
import { AxiosResponse } from 'axios';
import { brotliDecompressSync } from 'zlib';
import { PAYMENT_SERVICE_URL } from 'src/httpConfig';
import { TRANSACTION_SERVICE_URL } from 'src/httpConfig';

@Injectable()
export class CentralService { 

  constructor(private prisma : PrismaService,private auth:AuthService,private readonly httpService: HttpService){}

  async statement(req:Request ,res:Response){
        try{
          const payload = req.user as payload
          const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
            console.log("userStatement")
            const response = await  this.httpService.axiosRef.post(`${TRANSACTION_SERVICE_URL}payment-transaction/statement`,{
              "userAccountID": payload.id,
              "userAccountNumber":"",
              "sourceEmail":req.body.destEmail,
              "destEmail":"",
              "name":user.firstName,
              "Date":req.body.Date
            });
            console.log(response.data)
            return res.status(200).send(response.data) ;
        }
        catch{
          return res.status(400).send({message:"Bad Request"})
        } 
  }

  // async shopStatement(req:Request ,res:Response){
  //       try{
  //         const payload = req.user as payload
  //         const accountID = payload.id
  //         const shop = await this.prisma.shop.findUnique({where:{accountID}})
  //         console.log("getShopStatement")
  //         const response = await  this.httpService.axiosRef.get('http://localhost:3000/api/access/test',{
  //             params:{
  //               id:payload.id,
  //             }
  //           });
  //           console.log(response.data)
  //           return res.status(200).send(response.data) ;
  //       }
  //       catch{
  //         return res.status(400).send({message:"Bad Request"})
  //       } 
  // }

  async testPost(req:Request ,res:Response){
    console.log(req.body)
    return res.status(200).send({message:"testPost"})
  }

  async testGet(req:Request ,res:Response){
    console.log("access")
    console.log(req.params)
    return res.status(200).send({message:"testGet"})
  }

// PAYMENT API
//-------------------------------------------------------------->
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
    const statementRes = await this.httpService.axiosRef.post(`${TRANSACTION_SERVICE_URL}/payment-transaction/statement`,bodyStatement);
    return res.status(200).send({data:statementRes})
  }

  async userDeposit(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
      const responseUserPayment = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/info/${payload.id}`);
      const body = {
        "accountNumber":responseUserPayment.data.userPayment.accountID,
        "accountID":user.id,
        "amount":req.body.amount,
        "fee":req.body.fee
      }
      const response = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}user-payment/deposit`,body);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async userPaymentInfo(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/info/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async userPaymentBalance(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/balanced/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async getQrCodePayload(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
      const responseUserPayment = await this.httpService.get(`${PAYMENT_SERVICE_URL}user-payment/balanced/${payload.id}`,{
        data:{
          accountID: user.firstName,
          name: user.firstName,
          fee: req.body.fee
        }
      });
      return res.status(200).send(responseUserPayment) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async getPaymentLimitPerDay(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/limit/day/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patchPaymentLimitPerDay(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}user-payment/limit/day/`,{
        "id":payload.id,
        "amount":req.body.amount
      });
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async getPaymentAllow(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/allow/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patchBlockPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}user-payment/limit/day/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patchUnBlockPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}user-payment/payment/unblock/${payload.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async userPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
      const responseUserPayment = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}user-payment/info/${payload.id}`);
      const response = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}user-payment/`,{
        "userAccountNumber": responseUserPayment.data.userPayment.accountID,
        "userAccountName": user.firstName,
        "otherAccountNumber": req.body.otherAccountNumber,
        "nameOther": req.body.nameOther,
        "bankNameOther": req.body.bankNameOther,
        "sourcePhone": user.phone,
        "destPhone": req.body.destPhone,
        "IPAddress": req.ip,
        "amount": req.body.amount,
        "fee": req.body.fee,
        "sourceEmail": user.email,
        "destEmail": req.body.destEmail,
      });
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  //shop
  async shopPaymentInfo(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}shop-payment/info/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async shopPaymentBalance(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}shop-payment/balanced/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  
  async getShopPaymentLimitPerDay(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}shop-payment/limit/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patcShopPaymentLimitPerDay(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}shop-payment/limit/`,{
        "shopID": shop.id,
        "amount":req.body.amount
      });
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async getShopPaymentAllow(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}shop-payment/is-allow/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patchShopBlockPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}shop-payment/block/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async patchShopUnBlockPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const response = await this.httpService.axiosRef.patch(`${PAYMENT_SERVICE_URL}shop-payment/unblock/${shop.id}`);
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }

  async shopPayment(req:Request ,res:Response){
    try{
      const payload = req.user as payload
      const shop = await this.prisma.shop.findUnique({where:{accountID:payload.id}})
      const user = await this.prisma.accounts.findUnique({where:{id:payload.id}})
      const responseShopPayment = await this.httpService.axiosRef.get(`${PAYMENT_SERVICE_URL}shop-payment/info/${shop.id}`);;
      const response = await this.httpService.axiosRef.post(`${PAYMENT_SERVICE_URL}shop-payment/transfer/same/`,{
        "shopAccountNumber": responseShopPayment.data.shopPayment.accountNumber,
        "shopName": shop.shopName,
        "phone": user.phone,
        "otherAccountNumber": req.body.otherAccountNumber,
        "nameOther": req.body.nameOtherm,
        "bankNameOther": req.body.bankNameOther,
        "amount": req.body.amount,
        "fee": req.body.fee,
        "type": "tranfer",
        "IPAddress": req.ip
      });
      return res.status(200).send(response.data) ;
    }
    catch{
      return res.status(400).send({message:"Bad Request"})
    } 
  }
}
