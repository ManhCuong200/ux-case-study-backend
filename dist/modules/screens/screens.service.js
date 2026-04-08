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
exports.ScreensService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const screen_entity_1 = require("./entities/screen.entity");
let ScreensService = class ScreensService {
    screenRepository;
    constructor(screenRepository) {
        this.screenRepository = screenRepository;
    }
    async create(createScreenDto) {
        const screen = this.screenRepository.create({
            name: createScreenDto.name,
            image_url: createScreenDto.image_url,
            app: { id: createScreenDto.appId },
        });
        return await this.screenRepository.save(screen);
    }
    async findAllByApp(appId) {
        return await this.screenRepository.find({
            where: { app: { id: appId } },
            relations: ['hotspots'],
        });
    }
    async findOne(id) {
        return await this.screenRepository.findOne({
            where: { id },
            relations: ['hotspots', 'app'],
        });
    }
    async update(id, data) {
        const screen = await this.findOne(id);
        if (!screen)
            throw new common_1.NotFoundException('Screen not found');
        Object.assign(screen, data);
        return await this.screenRepository.save(screen);
    }
    async remove(id) {
        const screen = await this.findOne(id);
        if (!screen)
            throw new common_1.NotFoundException('Screen not found');
        return await this.screenRepository.remove(screen);
    }
};
exports.ScreensService = ScreensService;
exports.ScreensService = ScreensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(screen_entity_1.Screen)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ScreensService);
//# sourceMappingURL=screens.service.js.map