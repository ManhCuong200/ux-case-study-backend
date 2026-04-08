import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { App } from '../../apps/entities/app.entity';
import { Hotspot } from '../../hotspots/entities/hotspot.entity';

@Entity('screens')
export class Screen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  image_url: string;

  @ManyToOne(() => App, (app) => app.screens, { onDelete: 'CASCADE' })
  app: App;

  @OneToMany(() => Hotspot, (hotspot) => hotspot.screen)
  hotspots: Hotspot[];
}
