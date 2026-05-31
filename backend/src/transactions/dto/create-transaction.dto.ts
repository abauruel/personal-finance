import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
  Min
} from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  accountId: string;

  @IsNotEmpty()
  @IsString()
  categoryId: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0.01, { message: 'O valor deve ser maior que zero' })
  amount: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsEnum(['DEBIT', 'CREDIT', 'PIX', 'CASH', 'TRANSFER'])
  paymentType: 'DEBIT' | 'CREDIT' | 'PIX' | 'CASH' | 'TRANSFER';

  @IsOptional()
  @IsEnum(['PENDING', 'PAID', 'CANCELLED'])
  status?: 'PENDING' | 'PAID' | 'CANCELLED';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  recurringId?: string;
}
