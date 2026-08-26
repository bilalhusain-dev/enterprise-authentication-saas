import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { topic, niche, tone, urgency, mode, provider, openaiKey, geminiKey } = body;

        const activeProvider = provider || 'openai';

        const systemPrompt = `You are an expert social media copywriter and art director. 
Create content for a post in the ${niche} niche about: "${topic}".
Tone: ${tone}, Urgency: ${urgency}.
Return JSON strictly in this format:
{
  "angles": [
    {
      "image_search_query": "news style ${topic.replace(/"/g, '')} (no text, no meme, high quality)",
      "headline": "2-3 punchy lines optimizing for scroll stop",
      "caption": "4-6 lines of engaging platform-optimized text...",
      "hashtags": ["#tag1", "#tag2", "#tag3"]
    }
  ]
}
If mode is "auto", generate 3 distinct angles. Otherwise, generate 1 angle.`;

        let parsedContent = null;

        if (activeProvider === 'openai') {
            const key = openaiKey || process.env.OPENAI_API_KEY;
            if (!key) {
                return NextResponse.json({ error: 'OpenAI API Key is required. Please set it in Settings.' }, { status: 401 });
            }

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${key}`
                },
                body: JSON.stringify({
                    model: 'gpt-4o',
                    response_format: { type: 'json_object' },
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: `Generate social media post for topic: ${topic}` }
                    ]
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || 'Failed to fetch from OpenAI');
            }

            const data = await response.json();
            parsedContent = JSON.parse(data.choices[0].message.content);

        } else if (activeProvider === 'gemini') {
            const key = geminiKey || process.env.GEMINI_API_KEY;
            if (!key) {
                return NextResponse.json({ error: 'Gemini API Key is required. Please set it in Settings.' }, { status: 401 });
            }

            const { GoogleGenerativeAI } = require('@google/generative-ai');
            const genAI = new GoogleGenerativeAI(key);

            try {
                // Downgraded to gemini-1.0-pro since the provided key does not support 1.5 models on v1beta
                const model = genAI.getGenerativeModel({
                    model: "gemini-1.0-pro",
                });

                const generationConfig = {
                    temperature: 0.7,
                    responseMimeType: "application/json",
                };

                const result = await model.generateContent({
                    contents: [
                        { role: "user", parts: [{ text: systemPrompt }] },
                        { role: "model", parts: [{ text: "Understood." }] },
                        { role: "user", parts: [{ text: `Generate social media post for topic: ${topic}` }] }
                    ],
                    generationConfig,
                });

                const responseText = result.response.text();

                if (!responseText) {
                    throw new Error("Invalid response from Gemini (empty text)");
                }

            } catch (geminiError: any) {
                console.error("Raw Gemini Error:", geminiError);
                throw new Error(geminiError.message || "Failed to communicate with Google Gemini API");
            }
        } else {
            throw new Error(`Unsupported provider: ${activeProvider}`);
        }

        return NextResponse.json({ success: true, data: parsedContent });

    } catch (error: any) {
        console.error('Generation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
