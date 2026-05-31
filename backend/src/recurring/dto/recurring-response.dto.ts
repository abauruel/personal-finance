import { Frequency } from './create-recurring.dto';

export interface RecurringResponseDto {
  id: string;
  userId: string;
  categoryId: string;
  accountId: string;
  description: string;
  amount: number;
  frequency: Frequency;
  paymentType: string;
  dayOfMonth: number;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  lastGenerated?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    icon: string;
    color: string;
  };
  account?: {
    id: string;
    name: string;
    type: string;
  };
}
