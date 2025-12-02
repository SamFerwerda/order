import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export interface Order {
  id: string;
  description: string;
  createdAt: Date;
}

@Injectable()
export class OrderService {
  private orders: Map<string, Order[]> = new Map();

  createSession(): string {
    const uuid = uuidv4();
    this.orders.set(uuid, []);
    return uuid;
  }

  getOrders(uuid: string): Order[] {
    return this.orders.get(uuid) || [];
  }

  addOrder(uuid: string, description: string): Order | null {
    if (!this.orders.has(uuid)) {
      this.orders.set(uuid, []);
    }

    const order: Order = {
      id: uuidv4(),
      description,
      createdAt: new Date(),
    };

    this.orders.get(uuid)!.push(order);
    return order;
  }

  sessionExists(uuid: string): boolean {
    return this.orders.has(uuid);
  }
}
