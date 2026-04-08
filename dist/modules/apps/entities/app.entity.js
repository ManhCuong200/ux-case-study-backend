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
exports.App = void 0;
const typeorm_1 = require("typeorm");
const screen_entity_1 = require("../../screens/entities/screen.entity");
const base_entity_1 = require("../../../shared/entities/base.entity");
let App = class App extends base_entity_1.BaseEntity {
    name;
    logo_url;
    description;
    screens;
};
exports.App = App;
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], App.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], App.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], App.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => screen_entity_1.Screen, (screen) => screen.app),
    __metadata("design:type", Array)
], App.prototype, "screens", void 0);
exports.App = App = __decorate([
    (0, typeorm_1.Entity)('apps')
], App);
//# sourceMappingURL=app.entity.js.map