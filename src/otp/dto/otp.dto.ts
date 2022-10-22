import { IsNotEmpty,IsString,IsEmail,Length, IsDate } from "class-validator";

export class otpDto{
   
    
    @IsNotEmpty()
    @IsString()
    public id : string;

    @IsNotEmpty()
    @IsString()
    public OtpNumber : string;

}