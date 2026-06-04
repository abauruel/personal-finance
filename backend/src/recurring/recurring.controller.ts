import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringJobService } from './recurring-job.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('recurring')
@UseGuards(JwtAuthGuard)
export class RecurringController {
  constructor(
    private readonly recurringService: RecurringService,
    private readonly recurringJobService: RecurringJobService,
  ) { }

  @Post()
  async create(@GetUser('id') userId: string, @Body() createRecurringDto: CreateRecurringDto) {
    return this.recurringService.create(userId, createRecurringDto);
  }

  @Get()
  async findAll(@GetUser('id') userId: string) {
    return this.recurringService.findAll(userId);
  }

  @Get(':id')
  async findOne(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.recurringService.findOne(userId, id);
  }

  @Patch(':id')
  async update(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(userId, id, updateRecurringDto);
  }

  @Patch(':id/toggle')
  async toggleActive(@GetUser('id') userId: string, @Param('id') id: string) {
    return this.recurringService.toggleActive(userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@GetUser('id') userId: string, @Param('id') id: string) {
    await this.recurringService.remove(userId, id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDelete(@GetUser('id') userId: string, @Param('id') id: string) {
    await this.recurringService.hardDelete(userId, id);
  }

  /**
   * Endpoint para testar geração manual de transações recorrentes
   * Útil para testes e debugging
   */
  @Post('generate')
  async generateTransactions() {
    return this.recurringJobService.manualGeneration();
  }
}
