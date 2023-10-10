import { IsNumberString, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsNumberString()
  @IsPhoneNumber()
  phone_id: string;
}
