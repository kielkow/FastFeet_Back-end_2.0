import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddSignatureFieldToRecipients1594170824421
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'recipients',
      new TableColumn({
        name: 'signature',
        type: 'varchar',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('recipients', 'signature');
  }
}
