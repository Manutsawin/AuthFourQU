import { IsNotEmpty,IsString,IsEmail,Length, IsDate } from "class-validator";

export class AuthDto{
   
    @IsNotEmpty()
    @IsString()
    @Length(12,12,{message:'LaserID has to be 12 chars'})
    public LaserID : string;

    @IsNotEmpty()
    @IsString()
    @Length(9,9,{message:'SSN has to be 9 chars'})
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
    public postalCode : string

    @IsNotEmpty()
    @IsString()
    public province : string
    
    @IsNotEmpty()
    @IsString()
    public district : string

    @IsNotEmpty()
    @IsString()
    public subDistrict : string

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