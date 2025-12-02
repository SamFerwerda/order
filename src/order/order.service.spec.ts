import { Test, TestingModule } from '@nestjs/testing';
import { OrderService } from './order.service';

describe('OrderService', () => {
  let service: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OrderService],
    }).compile();

    service = module.get<OrderService>(OrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSession', () => {
    it('should create a new session and return a UUID', () => {
      const uuid = service.createSession();
      expect(uuid).toBeDefined();
      expect(typeof uuid).toBe('string');
      expect(uuid.length).toBeGreaterThan(0);
    });

    it('should create unique UUIDs for each session', () => {
      const uuid1 = service.createSession();
      const uuid2 = service.createSession();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('sessionExists', () => {
    it('should return true for an existing session', () => {
      const uuid = service.createSession();
      expect(service.sessionExists(uuid)).toBe(true);
    });

    it('should return false for a non-existing session', () => {
      expect(service.sessionExists('non-existent-uuid')).toBe(false);
    });
  });

  describe('getOrders', () => {
    it('should return an empty array for a new session', () => {
      const uuid = service.createSession();
      const orders = service.getOrders(uuid);
      expect(orders).toEqual([]);
    });

    it('should return an empty array for a non-existing session', () => {
      const orders = service.getOrders('non-existent-uuid');
      expect(orders).toEqual([]);
    });
  });

  describe('addOrder', () => {
    it('should add an order to an existing session', () => {
      const uuid = service.createSession();
      const order = service.addOrder(uuid, 'Test order');

      expect(order).toBeDefined();
      expect(order?.description).toBe('Test order');
      expect(order?.id).toBeDefined();
      expect(order?.createdAt).toBeInstanceOf(Date);
    });

    it('should add an order and create the session if it does not exist', () => {
      const uuid = 'new-uuid';
      const order = service.addOrder(uuid, 'Test order');

      expect(order).toBeDefined();
      expect(order?.description).toBe('Test order');
      expect(service.sessionExists(uuid)).toBe(true);
    });

    it('should return orders in the order they were added', () => {
      const uuid = service.createSession();
      service.addOrder(uuid, 'Order 1');
      service.addOrder(uuid, 'Order 2');
      service.addOrder(uuid, 'Order 3');

      const orders = service.getOrders(uuid);
      expect(orders.length).toBe(3);
      expect(orders[0].description).toBe('Order 1');
      expect(orders[1].description).toBe('Order 2');
      expect(orders[2].description).toBe('Order 3');
    });
  });
});
