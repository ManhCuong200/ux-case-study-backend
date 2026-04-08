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
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("./ai.service");
const screens_service_1 = require("../../modules/screens/screens.service");
let AiController = class AiController {
    aiService;
    screensService;
    constructor(aiService, screensService) {
        this.aiService = aiService;
        this.screensService = screensService;
    }
    async analyze(screenId) {
        const screen = await this.screensService.findOne(+screenId);
        if (!screen) {
            throw new common_1.BadRequestException('Screen not found');
        }
        try {
            return await this.aiService.analyzeScreen(screen.image_url);
        }
        catch (e) {
            console.error('AI SCAN FAILED:', e);
            throw new common_1.BadRequestException(`AI Scan failure: ${e.message}`);
        }
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('analyze/:screenId'),
    __param(0, (0, common_1.Param)('screenId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AiController.prototype, "analyze", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __metadata("design:paramtypes", [ai_service_1.AiService,
        screens_service_1.ScreensService])
], AiController);
//# sourceMappingURL=ai.controller.js.map