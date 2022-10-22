import { IsNotEmpty,IsString,IsEmail,Length, IsDate } from "class-validator";

export class AuthDto{
   
    @IsNotEmpty()
    @IsString()
    public LaserID : string;

    @IsNotEmpty()
    @IsString()
    public SSN : string;

    @IsNotEmpty()
    @IsString()
    public firstName : string;

    @IsNotEmpty()
    @IsString()
    public middleName : string;

    @IsNotEmpty()
    @IsString()
    public lastName : string;

    @IsNotEmpty()
    // @IsDate()
    public BoD : Date;

    @IsNotEmpty()
    @IsString()
    public phone : string;

    @IsNotEmpty()
    @IsString()
    public citizenship : string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    public email : string;

    @IsNotEmpty()
    @IsString()
    public title : string;

    @IsNotEmpty()
    @IsString()
    public country : string;

    @IsNotEmpty()
    @IsString()
    public salary : number;

    @IsNotEmpty()
    @IsString()
    public careerID : string;

    @IsNotEmpty()
    @IsString()
    public gaID : string;

    @IsNotEmpty()
    @IsString()
    public houseNO : string;

    @IsNotEmpty()
    @IsString()
    public village : string;

    @IsNotEmpty()
    @IsString()
    public lane : string;

    @IsNotEmpty()
    @IsString()
    public road : string;

}