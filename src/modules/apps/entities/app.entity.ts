import { Entity, Column, OneToMany } from 'typeorm';
import { Screen } from '../../screens/entities/screen.entity';
import { BaseEntity } from '../../../shared/entities/base.entity';

@Entity('apps')
export class App extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  logo_url: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @OneToMany(() => Screen, (screen) => screen.app)
  screens: Screen[];
}
