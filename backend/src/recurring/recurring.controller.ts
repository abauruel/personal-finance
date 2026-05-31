import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecurringService } from './recurring.service';
import { RecurringJobService } from './recurring-job.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('recurring')
@UseGuards(JwtAuthGuard)
export class RecurringController {
  constructor(
    private readonly recurringService: RecurringService,
    private readonly recurringJobService: RecurringJobService,
  ) { }

  @Post()
  async create(@Request() req, @Body() createRecurringDto: CreateRecurringDto) {
    return this.recurringService.create(req.user.userId, createRecurringDto);
  }

  @Get()
  async findAll(@Request() req) {
    return this.recurringService.findAll(req.user.userId);
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.recurringService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateRecurringDto: UpdateRecurringDto,
  ) {
    return this.recurringService.update(req.user.userId, id, updateRecurringDto);
  }

  @Patch(':id/toggle')
  async toggleActive(@Request() req, @Param('id') id: string) {
    return this.recurringService.toggleActive(req.user.userId, id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Request() req, @Param('id') id: string) {
    await this.recurringService.remove(req.user.userId, id);
  }

  @Delete(':id/hard')
  @HttpCode(HttpStatus.NO_CONTENT)
  async hardDelete(@Request() req, @Param('id') id: string) {
    await this.recurringService.hardDelete(req.user.userId, id);
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
