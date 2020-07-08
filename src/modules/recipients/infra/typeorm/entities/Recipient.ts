import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import uploadConfig from '@config/upload';

import { Expose } from 'class-transformer';

@Entity('recipients')
class Recipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  street: string;

  @Column()
  number: string;

  @Column()
  details: string;

  @Column()
  state: string;

  @Column()
  city: string;

  @Column()
  cep: string;

  @Column()
  signature: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Expose({ name: 'signature_url' })
  getSignatureUrl(): string | null {
    if (!this.signature) {
      return null;
    }

    switch (uploadConfig.driver) {
      case 'disk':
        return `${process.env.APP_URL}/files/${this.signature}`;

      case 's3':
        return `https://${uploadConfig.config.aws.bucket}.s3.amazonaws.com/${this.signature}`;

      default:
        return null;
    }
  }
}

export default Recipient;
