import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { JwtRefreshService } from './jwt-refresh.service';
import { CreateJwtRefreshDto } from './dto/create-jwt-refresh.dto';
import { UpdateJwtRefreshDto } from './dto/update-jwt-refresh.dto';

@Controller('jwt-refresh')
export class JwtRefreshController {
  constructor(private readonly jwtRefreshService: JwtRefreshService) {}

 
}
