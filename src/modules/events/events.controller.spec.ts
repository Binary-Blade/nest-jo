import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { TypeEvent } from '@common/enums/type-event.enum';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: mockEventsService
        }
      ]
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>(EventsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create an event', async () => {
      const dto: CreateEventDto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10,
        type: TypeEvent.SOLO
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
    it('should throw an error if an event with the same title already exists', async () => {
      const dto: CreateEventDto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10,
        type: TypeEvent.SOLO
      };
      mockEventsService.create.mockRejectedValue(new Error());
      await expect(controller.create(dto)).rejects.toThrow();
    });
    it('should throw an error if an event with the same title already exists', async () => {
      const dto: CreateEventDto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10,
        type: TypeEvent.SOLO
      };
      mockEventsService.create.mockRejectedValue(new Error());
      await expect(controller.create(dto)).rejects.toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      await controller.findAll();
      expect(service.findAll).toHaveBeenCalled();
    });
    it('should throw an error if there is an error parsing the data', async () => {
      mockEventsService.findAll.mockRejectedValue(new Error());
      await expect(controller.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const id = '1';
      mockEventsService.findOne.mockResolvedValue({}); // provide a mock return value
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(+id);
    });

    it('should throw an error if the event does not exist or if there is an error', async () => {
      const id = '1';
      mockEventsService.findOne.mockRejectedValue(new Error('Service error'));
      await expect(controller.findOne(id)).rejects.toThrow('Service error');
    });
  });

  describe('update', () => {
    it('should update an event', async () => {
      const id = '1';
      const dto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10
      };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(+id, dto);
    });
    it('should throw an error if the event does not exist', async () => {
      const id = '1';
      const dto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10
      };
      mockEventsService.update.mockRejectedValue(new Error());
      await expect(controller.update(id, dto)).rejects.toThrow();
    });
    it('should throw an error if the event with the same title already exists', async () => {
      const id = '1';
      const dto = {
        title: 'Test',
        description: 'Desc',
        price: 100,
        quantityAvailable: 10
      };
      mockEventsService.update.mockRejectedValue(new Error());
      await expect(controller.update(id, dto)).rejects.toThrow();
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const id = '1';
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(+id);
    });

    it('should throw an error if the event cannot be removed', async () => {
      const id = '1';
      mockEventsService.remove.mockRejectedValue(new Error('Service error'));
      await expect(controller.remove(id)).rejects.toThrow('Service error');
    });
  });
});
