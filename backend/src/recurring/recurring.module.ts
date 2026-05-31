import { Module } from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringController } from './recurring.controller';
import { RecurringJobService } from './recurring-job.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecurringController],
  providers: [RecurringService, RecurringJobService],
  exports: [RecurringService],
})
export class RecurringModule { }
