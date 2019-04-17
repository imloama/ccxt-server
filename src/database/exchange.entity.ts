import { BaseEntity, Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Exchange extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  /**
   * exchange name like huobipro bittrex
   */
  @Column({ length: 50, nullable: false })
  name: string;

  /**
   * username or id 
   */
  @Column({ length: 50, nullable: true})
  user?: string;

  @Column({ length: 255, nullable: false })
  apikey: string;

  @Column({ length: 255, nullable: false })
  secret: string;

  /**
   * memo abort this data
   */
  @Column({ length: 255})
  memo?: string;

  @Column()
  enableRateLimit: boolean = false;
}