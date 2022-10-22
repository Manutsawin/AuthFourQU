import { IsNotEmpty,IsString,IsEmail,Length, IsDate } from "class-validator";

export class AddressDto{
   
    @IsNotEmpty()
    @IsString()
    public gaID : string;

    @IsNotEmpty()
    @IsString()
    public houseNo : string;

    @IsNotEmpty()
    @IsString()
    public village : string;

    @IsNotEmpty()
    @IsString()
    public lane : string;
}