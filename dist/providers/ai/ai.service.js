"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
let AiService = class AiService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    async analyzeScreen(imageUrl) {
        const apiKey = this.configService.get('GEMINI_API_KEY')?.trim();
        if (!apiKey)
            throw new common_1.BadRequestException('MISSING_API_KEY_IN_ENV');
        let imagePath = '';
        let mimeType = 'image/png';
        if (imageUrl.includes('localhost:3000/uploads/')) {
            const parts = imageUrl.split('/');
            const filename = parts[parts.length - 1];
            if (filename && filename !== '') {
                imagePath = path.join(process.cwd(), 'uploads', filename);
                const ext = path.extname(filename).toLowerCase();
                if (ext === '.jpg' || ext === '.jpeg')
                    mimeType = 'image/jpeg';
            }
        }
        if (!imagePath || !fs.existsSync(imagePath)) {
            throw new common_1.BadRequestException('Resource image not found for AI analysis');
        }
        try {
            console.log(`🔍 [AI] DYNAMICALLY DETECTING CAPABLE MODELS...`);
            const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
            const listData = await listResponse.json();
            if (!listData.models || listData.models.length === 0) {
                throw new Error(`Google returned no models for this Key. Full Response: ${JSON.stringify(listData)}`);
            }
            const capableModels = listData.models
                .filter((m) => m.supportedGenerationMethods.includes('generateContent') &&
                (m.name.includes('flash') || m.name.includes('pro')) &&
                !m.name.includes('robotics'))
                .map((m) => m.name);
            if (capableModels.length === 0) {
                throw new Error('No vision-capable models found for this API Key in the current environment.');
            }
            console.log(`🚀 [AI] DISCOVERED MODELS: ${capableModels.join(', ')}`);
            const imageData = fs.readFileSync(imagePath);
            const base64Data = Buffer.from(imageData).toString('base64');
            const prompt = `Bạn là chuyên gia UX/UI cấp cao. Hãy phân tích ảnh chụp màn hình UI này.
        Dựa vào nội dung hình ảnh, hãy chỉ ra các vấn đề UX thực tế.
        Yêu cầu:
        1. Phân tích hệ thống cực kỳ cụ thể.
        2. Trả về JSON array. Mỗi phần tử:
           - "title": Tiêu đề lỗi (ngắn gọn).
           - "content": Giải thích và cách sửa.
           - "pos_x": Tọa độ X (DÙNG PHẦN TRĂM 0-100, ví dụ 15.5). 0 là sát lề trái, 100 là sát lề phải.
           - "pos_y": Tọa độ Y (DÙNG PHẦN TRĂM 0-100, ví dụ 20.0). 0 là sát mép trên, 100 là sát mép dưới.
           - "type": "error" | "suggestion" | "success".
        QUAN TRỌNG: Không được dùng giá trị pixel. Tọa độ phải nằm trong khoảng [0, 100].
        CHỈ TRẢ VỀ JSON ARRAY.`;
            let lastError = '';
            for (const modelId of capableModels) {
                try {
                    console.log(`💡 [AI] TRYING RAW FETCH WITH ${modelId}...`);
                    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelId}:generateContent?key=${apiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{
                                    parts: [
                                        { text: prompt },
                                        { inlineData: { mimeType, data: base64Data } }
                                    ]
                                }]
                        })
                    });
                    const data = await response.json();
                    if (!response.ok) {
                        throw new Error(data.error?.message || 'Unknown API Error');
                    }
                    let textResult = data.candidates[0].content.parts[0].text;
                    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
                    const finalJson = JSON.parse(textResult);
                    console.log(`✅ [AI] DYNAMIC WINNER: ${modelId}`);
                    return finalJson;
                }
                catch (e) {
                    console.warn(`⚠️ [AI] Attempt with ${modelId} failed:`, e.message);
                    lastError = e.message;
                    continue;
                }
            }
            throw new Error(`All discovered models failed. Last Error: ${lastError}`);
        }
        catch (e) {
            console.error('❌ [AI] CRITICAL FAILURE:', e.message);
            throw new common_1.BadRequestException(`AI Analysis failed: ${e.message}`);
        }
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map