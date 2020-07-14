import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import Order from '@modules/orders/infra/typeorm/entities/Order';

@Entity('orders_problems')
class OrderProblem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  order_id: string;

  @OneToOne(() => Order, order => order, { eager: true })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @Column()
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default OrderProblem;
