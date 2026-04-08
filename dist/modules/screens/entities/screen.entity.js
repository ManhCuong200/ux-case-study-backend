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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Screen = void 0;
const typeorm_1 = require("typeorm");
const app_entity_1 = require("../../apps/entities/app.entity");
const hotspot_entity_1 = require("../../hotspots/entities/hotspot.entity");
let Screen = class Screen {
    id;
    name;
    image_url;
    app;
    hotspots;
};
exports.Screen = Screen;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Screen.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Screen.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Screen.prototype, "image_url", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => app_entity_1.App, (app) => app.screens, { onDelete: 'CASCADE' }),
    __metadata("design:type", app_entity_1.App)
], Screen.prototype, "app", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => hotspot_entity_1.Hotspot, (hotspot) => hotspot.screen),
    __metadata("design:type", Array)
], Screen.prototype, "hotspots", void 0);
exports.Screen = Screen = __decorate([
    (0, typeorm_1.Entity)('screens')
], Screen);
//# sourceMappingURL=screen.entity.js.map