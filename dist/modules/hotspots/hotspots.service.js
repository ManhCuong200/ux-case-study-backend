"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotspotsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const hotspot_entity_1 = require("./entities/hotspot.entity");
let HotspotsService = class HotspotsService {
    hotspotRepository;
    constructor(hotspotRepository) {
        this.hotspotRepository = hotspotRepository;
    }
    async create(createHotspotDto) {
        const hotspot = this.hotspotRepository.create({
            title: createHotspotDto.title,
            content: createHotspotDto.content,
            pos_x: createHotspotDto.pos_x,
            pos_y: createHotspotDto.pos_y,
            type: createHotspotDto.type || 'error',
            screen: { id: createHotspotDto.screenId },
        });
        return await this.hotspotRepository.save(hotspot);
    }
    async findAllByScreen(screenId) {
        return await this.hotspotRepository.find({
            where: { screen: { id: screenId } },
        });
    }
    async remove(id) {
        const hotspot = await this.hotspotRepository.findOne({ where: { id } });
        if (!hotspot)
            throw new common_1.NotFoundException('Không tìm thấy điểm lỗi này');
        return await this.hotspotRepository.remove(hotspot);
    }
    async update(id, data) {
        const hotspot = await this.hotspotRepository.findOne({ where: { id } });
        if (!hotspot)
            throw new common_1.NotFoundException('Không tìm thấy điểm lỗi này');
        Object.assign(hotspot, data);
        return await this.hotspotRepository.save(hotspot);
    }
    async bulkCreate(hotspots) {
        const data = hotspots.map((h) => ({
            ...h,
            screen: { id: h.screenId },
        }));
        const entities = this.hotspotRepository.create(data);
        return await this.hotspotRepository.save(entities);
    }
};
exports.HotspotsService = HotspotsService;
exports.HotspotsService = HotspotsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(hotspot_entity_1.Hotspot)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], HotspotsService);
//# sourceMappingURL=hotspots.service.js.map