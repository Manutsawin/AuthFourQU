import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import {jwtSecretAcess} from '../utils/constants';


export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: jwtSecretAcess
        })
    }

    async validate(payload: any):Promise<payload>{
        return  {id: payload.id,firstName:payload.firstName,middleName:payload.middleName,lastName:payload.lastName}
    }
}

export interface payload {
    id:string,
    firstName:string,
    middleName:string,
    lastName:string
}