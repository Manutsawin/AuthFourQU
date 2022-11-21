import { IsNotEmpty,IsString,IsEmail,Length, IsDate } from "class-validator";

export class CreateShopDto {

   
    
    @IsNotEmpty()
    @IsString()
    public accountID : string;

    @IsNotEmpty()
    @IsString()
    public shopName : string;

    @IsNotEmpty()
    @IsString()
    public bussinessType : string;

    // @IsNotEmpty()
    // @IsDate()
    // public createdDate : Date

    @IsNotEmpty()
    public createdDate : string

    @IsNotEmpty()
    public salesPerYear : number


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
    public houseNO : string

    @IsNotEmpty()
    @IsString()
    public village : string

    @IsNotEmpty()
    @IsString()
    public lane : string

    @IsNotEmpty()
    @IsString()
    public road : string



}
