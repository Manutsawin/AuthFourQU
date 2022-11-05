import { Module } from '@nestjs/common';
import { JwtRefreshService } from './jwt-refresh.service';
import { JwtRefreshController } from './jwt-refresh.controller';
import { JwtModule } from '@nestjs/jwt';
import {jwtSecret} from '../utils/constants';

@Module({
  imports:[
    JwtModule.register({
      secret:jwtSecret,
      signOptions:{ expiresIn:'7d'}
    }),
  ],
  controllers: [JwtRefreshController],
  providers: [JwtRefreshService],
  exports:[JwtRefreshService]
})
export class JwtRefreshModule {}
