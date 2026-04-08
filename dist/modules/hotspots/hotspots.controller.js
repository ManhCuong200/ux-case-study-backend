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
exports.HotspotsController = void 0;
const common_1 = require("@nestjs/common");
const hotspots_service_1 = require("./hotspots.service");
const create_hotspot_dto_1 = require("./dto/create-hotspot.dto");
let HotspotsController = class HotspotsController {
    hotspotsService;
    constructor(hotspotsService) {
        this.hotspotsService = hotspotsService;
    }
    create(createHotspotDto) {
        return this.hotspotsService.create(createHotspotDto);
    }
    update(id, data) {
        return this.hotspotsService.update(+id, data);
    }
    bulkCreate(hotspots) {
        return this.hotspotsService.bulkCreate(hotspots);
    }
    findAllByScreen(screenId) {
        return this.hotspotsService.findAllByScreen(+screenId);
    }
    remove(id) {
        return this.hotspotsService.remove(+id);
    }
};
exports.HotspotsController = HotspotsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_hotspot_dto_1.CreateHotspotDto]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "update", null);
__decorate([
    (0, common_1.Post)('bulk'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "bulkCreate", null);
__decorate([
    (0, common_1.Get)('screen/:screenId'),
    __param(0, (0, common_1.Param)('screenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "findAllByScreen", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], HotspotsController.prototype, "remove", null);
exports.HotspotsController = HotspotsController = __decorate([
    (0, common_1.Controller)('hotspots'),
    __metadata("design:paramtypes", [hotspots_service_1.HotspotsService])
], HotspotsController);
//# sourceMappingURL=hotspots.controller.js.map