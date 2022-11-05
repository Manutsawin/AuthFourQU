import { PartialType } from '@nestjs/mapped-types';
import { CreateJwtRefreshDto } from './create-jwt-refresh.dto';

export class UpdateJwtRefreshDto extends PartialType(CreateJwtRefreshDto) {}
