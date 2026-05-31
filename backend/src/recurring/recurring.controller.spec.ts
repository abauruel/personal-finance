import { Test, TestingModule } from '@nestjs/testing';
import { RecurringController } from './recurring.controller';
import { RecurringService } from './recurring.service';

describe('RecurringController', () => {
  let controller: RecurringController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecurringController],
      providers: [
        {
          provide: RecurringService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            toggleActive: jest.fn(),
            remove: jest.fn(),
            hardDelete: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<RecurringController>(RecurringController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
