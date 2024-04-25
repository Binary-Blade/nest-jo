import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('EventsController', () => {
  let controller: EventsController;
  let service: EventsService;

  const mockEventsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getPriceByType: jest.fn()
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
    const dto: CreateEventDto = {
      title: 'Test',
      description: 'Desc',
      basePrice: 100,
      quantityAvailable: 10
    };

    it('should create an event', async () => {
      mockEventsService.create.mockResolvedValue({ ...dto, id: 1 });
      const result = await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
      expect(result).toEqual({ ...dto, id: 1 });
    });

    it('should throw a ConflictException if an event with the same title already exists', async () => {
      mockEventsService.create.mockRejectedValue(new ConflictException());
      await expect(controller.create(dto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return all events', async () => {
      const events = [{ id: 1, title: 'Event 1' }];
      mockEventsService.findAll.mockResolvedValue(events);
      const result = await controller.findAll();
      expect(result).toEqual(events);
    });

    it('should throw an error if there is an error parsing the data', async () => {
      mockEventsService.findAll.mockRejectedValue(new Error());
      await expect(controller.findAll()).rejects.toThrow();
    });
  });

  describe('findOne', () => {
    it('should return a single event', async () => {
      const event = { id: 1, title: 'Event' };
      mockEventsService.findOne.mockResolvedValue(event);
      const result = await controller.findOne('1');
      expect(result).toEqual(event);
    });

    it('should throw a NotFoundException if the event does not exist', async () => {
      mockEventsService.findOne.mockRejectedValue(new NotFoundException());
      await expect(controller.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const dto: UpdateEventDto = {
      title: 'Updated Title',
      description: 'Updated Description',
      basePrice: 150,
      quantityAvailable: 20
    };

    it('should update an event', async () => {
      mockEventsService.update.mockResolvedValue({ ...dto, id: 1 });
      const result = await controller.update('1', dto);
      expect(result).toEqual({ ...dto, id: 1 });
    });

    it('should throw a NotFoundException if the event to update does not exist', async () => {
      mockEventsService.update.mockRejectedValue(new NotFoundException());
      await expect(controller.update('1', dto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an event', async () => {
      const id = '1';
      mockEventsService.remove.mockResolvedValue({ id: +id, title: 'Deleted Event' });
      const result = await controller.remove(id);
      expect(result).toEqual({ id: +id, title: 'Deleted Event' });
    });

    it('should throw a NotFoundException if the event to remove does not exist', async () => {
      const id = '999';
      mockEventsService.remove.mockRejectedValue(new NotFoundException());
      await expect(controller.remove(id)).rejects.toThrow(NotFoundException);
    });
  });
});
