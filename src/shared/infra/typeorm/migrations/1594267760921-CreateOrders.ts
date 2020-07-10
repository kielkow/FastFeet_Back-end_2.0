import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export default class CreateOrders1594267760921 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'orders',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'recipient_id',
            type: 'uuid',
          },
          {
            name: 'courier_id',
            type: 'uuid',
          },
          {
            name: 'product',
            type: 'varchar',
          },
          {
            name: 'status',
            type: 'varchar',
            default: "'pending'",
          },
          {
            name: 'start_date',
            type: 'timestamp with time zone',
          },
          {
            name: 'end_date',
            type: 'timestamp with time zone',
            isNullable: true,
          },
          {
            name: 'canceled_at',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
        foreignKeys: [
          {
            name: 'RecipientId',
            referencedTableName: 'recipients',
            referencedColumnNames: ['id'],
            columnNames: ['recipient_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
          {
            name: 'CourierId',
            referencedTableName: 'couriers',
            referencedColumnNames: ['id'],
            columnNames: ['courier_id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('orders');
  }
}
