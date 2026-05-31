import { IsString, IsNumber, IsEnum, IsDateString, IsOptional, IsBoolean, Min, Max } from 'class-validator';

export enum Frequency {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export enum PaymentType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
  PIX = 'PIX',
  CASH = 'CASH',
  TRANSFER = 'TRANSFER',
}

export class CreateRecurringDto {
  @IsString()
  categoryId: string;

  @IsString()
  accountId: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsEnum(Frequency)
  frequency: Frequency;

  @IsEnum(PaymentType)
  @IsOptional()
  paymentType?: PaymentType;

  @IsNumber()
  @Min(1)
  @Max(31)
  dayOfMonth: number;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
