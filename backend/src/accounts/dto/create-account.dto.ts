import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateAccountDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(['CHECKING', 'SAVINGS', 'CREDIT_CARD'])
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';

  @IsOptional()
  @IsNumber()
  initialBalance?: number;
}
