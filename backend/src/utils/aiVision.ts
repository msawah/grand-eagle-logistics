import { config } from '../config/env';

export interface AIVisionResult {
  aiFraudScore: number;
  aiReason: string;
  ocrText: string;
}

/**
 * Analiza una imagen de POD usando OpenAI Vision API para detectar fraude
 */
export async function analyzeImageForFraud(imageUrl: string): Promise<AIVisionResult> {
  // Si no hay API key de OpenAI, usar análisis mock
  if (!config.openaiApiKey || config.openaiApiKey === '') {
    console.log('OpenAI API Key not configured, using mock analysis');
    return getMockAnalysis(imageUrl);
  }

  try {
    const OpenAI = (await import('openai')).default;
    const openai = new OpenAI({
      apiKey: config.openaiApiKey,
    });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this Proof of Delivery (POD) image for potential fraud. Check for:
1. Signs of image manipulation or editing
2. Screenshot indicators (UI elements, battery icons, etc.)
3. Image quality and authenticity
4. Visible text, signatures, timestamps, names
5. Any suspicious elements

Respond ONLY with valid JSON in this format:
{
  "fraudScore": <number 0-100>,
  "reason": "<brief explanation>",
  "ocrText": "<any visible text extracted from image>"
}`,
            },
            {
              type: 'image_url',
              image_url: {
                url: imageUrl,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
    });

    const content = response.choices[0]?.message?.content || '{}';
    
    // Parse JSON response
    let result;
    try {
      result = JSON.parse(content);
    } catch (e) {
      // Si la respuesta no es JSON válido, extraerlo
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    return {
      aiFraudScore: result.fraudScore || 0,
      aiReason: result.reason || 'Analysis completed',
      ocrText: result.ocrText || '',
    };
  } catch (error) {
    console.error('OpenAI Vision API error:', error);
    // En caso de error, retornar análisis conservador
    return {
      aiFraudScore: 50,
      aiReason: 'AI analysis failed, manual review required',
      ocrText: '',
    };
  }
}

/**
 * Análisis mock para desarrollo cuando no hay API key
 */
function getMockAnalysis(imageUrl: string): AIVisionResult {
  console.log(`[Mock AI Vision] Analyzing: ${imageUrl}`);

  // Simular diferentes scores basados en características de la URL
  const urlLower = imageUrl.toLowerCase();
  let fraudScore = 0;
  let reason = 'Image appears authentic';
  let ocrText = 'Received by: John Doe\nDate: 2024-11-23\nSignature: [present]';

  // Detectar posibles indicadores de fraude en la URL
  if (urlLower.includes('screenshot') || urlLower.includes('screen')) {
    fraudScore = 75;
    reason = 'Possible screenshot detected';
  } else if (urlLower.includes('edit') || urlLower.includes('modified')) {
    fraudScore = 60;
    reason = 'Image may be edited';
  } else {
    // Score aleatorio bajo para simular análisis normal
    fraudScore = Math.floor(Math.random() * 25);
    reason = 'No manipulation detected, image appears authentic';
  }

  return {
    aiFraudScore: fraudScore,
    aiReason: reason,
    ocrText,
  };
}
