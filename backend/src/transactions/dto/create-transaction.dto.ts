import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  NotEquals,
  IsOptional,
  IsString,
  IsDateString,
  IsBoolean,
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
  @NotEquals(0, { message: 'O valor nao pode ser zero' })
  amount: number;

  @IsOptional()
  @IsEnum(['EXPENSE', 'INCOME'])
  transactionType?: 'EXPENSE' | 'INCOME';

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
