import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../prisma/prisma.service';
import { startOfMonth, endOfMonth, setDate, isBefore, isAfter } from 'date-fns';

@Injectable()
export class RecurringJobService {
  private readonly logger = new Logger(RecurringJobService.name);

  constructor(private readonly prisma: PrismaService) { }

  /**
   * Cron job que roda no dia 1 de cada mês às 00:00
   * Gera transações pendentes para todas as recorrências ativas
   */
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async generateMonthlyRecurringTransactions() {
    this.logger.log('🔄 Starting monthly recurring transactions generation...');

    try {
      const now = new Date();
      const startOfCurrentMonth = startOfMonth(now);

      // Buscar todas as recorrências ativas que precisam gerar transação
      const recurrings = await this.prisma.recurringTransaction.findMany({
        where: {
          active: true,
          frequency: 'MONTHLY', // Por enquanto só MONTHLY
          startDate: {
            lte: now, // Já começou
          },
          AND: [
            {
              OR: [
                { endDate: null }, // Sem data de fim
                { endDate: { gte: now } }, // Ainda não terminou
              ],
            },
            {
              OR: [
                { lastGenerated: null }, // Nunca foi gerado
                { lastGenerated: { lt: startOfCurrentMonth } }, // Última geração foi antes deste mês
              ],
            },
          ],
        },
        include: {
          category: true,
        },
      });

      this.logger.log(`📋 Found ${recurrings.length} recurring transactions to process`);

      let successCount = 0;
      let errorCount = 0;

      for (const recurring of recurrings) {
        try {
          // Calcular a data da transação (dia do mês especificado)
          let transactionDate = setDate(now, recurring.dayOfMonth);

          // Se o dia do mês for maior que o último dia deste mês, usar o último dia
          const lastDayOfMonth = endOfMonth(now).getDate();
          if (recurring.dayOfMonth > lastDayOfMonth) {
            transactionDate = endOfMonth(now);
            this.logger.warn(
              `⚠️ Day ${recurring.dayOfMonth} doesn't exist in current month. Using last day (${lastDayOfMonth})`,
            );
          }

          // Criar a transação
          await this.prisma.transaction.create({
            data: {
              userId: recurring.userId,
              accountId: recurring.accountId,
              categoryId: recurring.categoryId,
              date: transactionDate,
              amount: recurring.amount,
              description: recurring.description,
              paymentType: recurring.paymentType,
              status: 'PENDING',
              isRecurring: true,
              recurringId: recurring.id,
            },
          });

          // Atualizar lastGenerated
          await this.prisma.recurringTransaction.update({
            where: { id: recurring.id },
            data: { lastGenerated: now },
          });

          successCount++;
          this.logger.log(
            `✅ Generated transaction for "${recurring.description}" (ID: ${recurring.id})`,
          );
        } catch (error) {
          errorCount++;
          this.logger.error(
            `❌ Error generating transaction for recurring ID ${recurring.id}: ${error.message}`,
            error.stack,
          );
        }
      }

      this.logger.log(
        `✨ Completed! Success: ${successCount}, Errors: ${errorCount}`,
      );
    } catch (error) {
      this.logger.error(
        `💥 Fatal error in generateMonthlyRecurringTransactions: ${error.message}`,
        error.stack,
      );
    }
  }

  /**
   * Método manual para gerar transações recorrentes
   * Útil para testes ou execução manual via API
   */
  async manualGeneration(): Promise<{ success: number; errors: number }> {
    this.logger.log('🔧 Manual generation triggered...');
    await this.generateMonthlyRecurringTransactions();

    // Retornar estatísticas (simplificado para o exemplo)
    return { success: 0, errors: 0 };
  }
}
