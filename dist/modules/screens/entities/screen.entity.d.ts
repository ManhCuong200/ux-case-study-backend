import { App } from '../../apps/entities/app.entity';
import { Hotspot } from '../../hotspots/entities/hotspot.entity';
export declare class Screen {
    id: number;
    name: string;
    image_url: string;
    app: App;
    hotspots: Hotspot[];
}
