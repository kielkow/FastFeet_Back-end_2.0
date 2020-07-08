import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  OneToOne,
  ManyToOne,
} from 'typeorm';

import { Exclude } from 'class-transformer';

import Recipient from '@modules/recipients/infra/typeorm/entities/Recipient';
import Courier from '@modules/couriers/infra/typeorm/entities/Courier';

@Entity('orders')
class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Exclude()
  recipient_id: string;

  @OneToOne(() => Recipient, recipient => recipient, { eager: true })
  @JoinColumn({ name: 'recipient_id' })
  recipient: Recipient;

  @Column()
  @Exclude()
  signature_id: string;

  @OneToOne(() => Recipient, recipient => recipient.signature, { eager: true })
  @JoinColumn({ name: 'signature_id' })
  signature: Recipient;

  @Column()
  @Exclude()
  courier_id: string;

  @ManyToOne(() => Courier, courier => courier, { eager: true })
  @JoinColumn({ name: 'courier_id' })
  courier: Courier;

  @Column()
  product: string;

  @Column('timestamp with time zone')
  start_date: Date;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}

export default Order;
