import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Screen } from '../../screens/entities/screen.entity';

@Entity('hotspots')
export class Hotspot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'float' })
  pos_x: number; // Tọa độ %

  @Column({ type: 'float' })
  pos_y: number; // Tọa độ %

  @Column({ default: 'error' })
  type: string;

  @ManyToOne(() => Screen, (screen) => screen.hotspots, { onDelete: 'CASCADE' })
  screen: Screen;
}
