import { Screen } from '../../screens/entities/screen.entity';
import { BaseEntity } from '../../../shared/entities/base.entity';
export declare class App extends BaseEntity {
    name: string;
    logo_url: string;
    description: string;
    screens: Screen[];
}
