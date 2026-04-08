import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class AiService {
  constructor(private configService: ConfigService) {}

  async analyzeScreen(imageUrl: string) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY')?.trim();
    if (!apiKey) throw new BadRequestException('MISSING_API_KEY_IN_ENV');

    let imagePath = '';
    let mimeType = 'image/png';

    if (imageUrl.includes('localhost:3000/uploads/')) {
        const parts = imageUrl.split('/');
        const filename = parts[parts.length - 1];
        if (filename && filename !== '') {
          imagePath = path.join(process.cwd(), 'uploads', filename);
          const ext = path.extname(filename).toLowerCase();
          if (ext === '.jpg' || ext === '.jpeg') mimeType = 'image/jpeg';
        }
    }

    if (!imagePath || !fs.existsSync(imagePath)) {
        throw new BadRequestException('Resource image not found for AI analysis');
    }

    try {
        console.log(`🔍 [AI] DYNAMICALLY DETECTING CAPABLE MODELS...`);
        
        // 1. Fetch available models for this specific API Key
        const listResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const listData: any = await listResponse.json();
        
        if (!listData.models || listData.models.length === 0) {
            throw new Error(`Google returned no models for this Key. Full Response: ${JSON.stringify(listData)}`);
        }

        // 2. Find models that support generateContent and are capable of vision (Flash/Pro)
        const capableModels = listData.models
            .filter((m: any) => 
                m.supportedGenerationMethods.includes('generateContent') && 
                (m.name.includes('flash') || m.name.includes('pro')) &&
                !m.name.includes('robotics') // Exclude special models
            )
            .map((m: any) => m.name);

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

        // 3. Try each capable model with RAW FETCH for transparency
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

                const data: any = await response.json();
                
                if (!response.ok) {
                    throw new Error(data.error?.message || 'Unknown API Error');
                }

                let textResult = data.candidates[0].content.parts[0].text;
                textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
                const finalJson = JSON.parse(textResult);

                console.log(`✅ [AI] DYNAMIC WINNER: ${modelId}`);
                return finalJson;

            } catch (e) {
                console.warn(`⚠️ [AI] Attempt with ${modelId} failed:`, e.message);
                lastError = e.message;
                continue;
            }
        }

        throw new Error(`All discovered models failed. Last Error: ${lastError}`);

    } catch (e) {
        console.error('❌ [AI] CRITICAL FAILURE:', e.message);
        throw new BadRequestException(`AI Analysis failed: ${e.message}`);
    }
  }
}
