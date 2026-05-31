import { Test, TestingModule } from '@nestjs/testing';
import { RecurringService } from './recurring.service';
import { PrismaService } from '../prisma/prisma.service';

describe('RecurringService', () => {
  let service: RecurringService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecurringService,
        {
          provide: PrismaService,
          useValue: {
            recurringTransaction: {
              create: jest.fn(),
              findMany: jest.fn(),
              findFirst: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            category: {
              findFirst: jest.fn(),
            },
            account: {
              findFirst: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RecurringService>(RecurringService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
