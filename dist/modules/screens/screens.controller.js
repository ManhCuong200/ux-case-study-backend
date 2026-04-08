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
exports.ScreensController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const path_1 = require("path");
const screens_service_1 = require("./screens.service");
let ScreensController = class ScreensController {
    screensService;
    constructor(screensService) {
        this.screensService = screensService;
    }
    healthTest() {
        return { status: "Blueprint Command Center is Active", time: new Date() };
    }
    async uploadScreen(file, body) {
        const imageUrl = `http://localhost:3000/uploads/${file.filename}`;
        return this.screensService.create({
            name: body.name,
            image_url: imageUrl,
            appId: +body.appId
        });
    }
    findByApp(appId) {
        return this.screensService.findAllByApp(+appId);
    }
    findOne(id) {
        return this.screensService.findOne(+id);
    }
    update(id, data) {
        return this.screensService.update(+id, data);
    }
    remove(id) {
        return this.screensService.remove(+id);
    }
};
exports.ScreensController = ScreensController;
__decorate([
    (0, common_1.Get)('test/health'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ScreensController.prototype, "healthTest", null);
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                cb(null, `${file.fieldname}-${uniqueSuffix}${(0, path_1.extname)(file.originalname)}`);
            },
        }),
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ScreensController.prototype, "uploadScreen", null);
__decorate([
    (0, common_1.Get)('app/:appId'),
    __param(0, (0, common_1.Param)('appId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreensController.prototype, "findByApp", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreensController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ScreensController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ScreensController.prototype, "remove", null);
exports.ScreensController = ScreensController = __decorate([
    (0, common_1.Controller)('screens'),
    __metadata("design:paramtypes", [screens_service_1.ScreensService])
], ScreensController);
//# sourceMappingURL=screens.controller.js.map