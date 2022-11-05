import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {jwtSecret} from '../utils/constants';
@Injectable()
export class JwtRefreshService {

  constructor(private jwt:JwtService){}
  
  async signRefreshToken(payload:any){
    return await this.jwt.signAsync(payload,{secret:jwtSecret})
  }
}
