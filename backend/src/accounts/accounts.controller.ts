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
import { AccountsService } from './accounts.service';
import type { CreateAccountDto, UpdateAccountDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';

@Controller('accounts')
@UseGuards(JwtAuthGuard)
export class AccountsController {
  constructor(private readonly accountsService: AccountsService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@GetUser('id') userId: string, @Body() dto: CreateAccountDto) {
    return this.accountsService.create(userId, dto);
  }

  @Get()
  findAll(@GetUser('id') userId: string) {
    return this.accountsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.accountsService.findOne(id, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @GetUser('id') userId: string,
    @Body() dto: UpdateAccountDto,
  ) {
    return this.accountsService.update(id, userId, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser('id') userId: string) {
    return this.accountsService.remove(id, userId);
  }
}
