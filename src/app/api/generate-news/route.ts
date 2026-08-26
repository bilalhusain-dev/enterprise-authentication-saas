import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';

interface GenerateRequest {
    topic: string;
    platform: 'Facebook' | 'X';
    tone: string;
    category: string;
    provider: 'gemini' | 'openai';
    openaiKey?: string;
    geminiKey?: string;
}

async function fetchUrlMetadata(url: string) {
    try {
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        const html = await res.text();
        
        const titleMatch = html.match(/<meta\s+property="og:title"\s+content="([^"]*)"/i) || html.match(/<title>([^<]*)<\/title>/i);
        const descMatch = html.match(/<meta\s+property="og:description"\s+content="([^"]*)"/i) || html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);
        const imgMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]*)"/i);
        
        return {
            title: titleMatch ? titleMatch[1] : '',
            description: descMatch ? descMatch[1] : '',
            image: imgMatch ? imgMatch[1] : null,
        };
    } catch (e) {
        return null;
    }
}

const getSystemPrompt = (platform: string, tone: string) => `You are a Senior Editor and Copywriter at a leading digital newsroom.
Your task is to generate the copy for a viral, high-quality social media graphic. 
Platform: ${platform}
Tone: ${tone}

OUTPUT FORMAT RULES (RETURN STRICT JSON ONLY):
{
  "headline": "Punchy headline (Max 50 characters, 5-7 words)",
  "supportingLine": "Context line (Max 80 characters, 8-10 words)",
  "caption": "5-6 short, sharp sentences meant to be the body text of the social post.",
  "searchQuery": "A hyper-descriptive 3-5 word query for a REAL PHOTO of the SUBJECT. (e.g., 'Donald Trump White House dinner' NOT 'news background')",
  "hashtags": ["#Tag1", "#Tag2", "#Tag3"],
  "design": {
    "sketchStyle": "Choose ONE: 'emery-minimal' (Priority - centered with divider), 'classic-split-65' (Split), 'breaking-red' (Urgent), or 'cinematic'",
    "fontFamily": "Choose ONE based on Tone: 'font-bebas' (Urgent/Sensational), 'font-outfit' (Modern), 'font-libre-baskerville' (Analytical), or 'font-sans' (Neutral)",
    "badgeStyle": "Choose ONE: 'live-red', 'classic', 'breaking-bars', 'split-ribbon', 'fox-alert', 'live-studio'",
    "badgeColor": "Hex color matching tone (e.g., #dc2626 for urgent, #2563eb for neutral, #d946ef for sensational)",
    "badgeText": "Short 1-2 word tag (e.g., 'BREAKING', 'EXCLUSIVE', 'LIVE UPDATE', 'WORLD')"
  }
}

RULES:
- Use Title Case for headlines (e.g., "The Global Markets Crash Today") NOT all caps.
- Wrap 1-2 shocking/key words in asterisks to highlight them (e.g., "The Global *Markets* Crash").
- Zero clickbait. Provide real, professional editorial copy.
- Do not wrap the JSON in markdown blocks. Return raw JSON.
`;

export async function POST(req: Request) {
    try {
        const body: GenerateRequest = await req.json();
        const { topic, platform, tone, provider, openaiKey, geminiKey } = body;

        let parsedContent: any = null;
        const systemPrompt = getSystemPrompt(platform, tone);

        // URL Scraping Logic
        let promptTopic = topic;
        let extractedImage = null;
        
        const isUrl = topic.match(/^https?:\/\//i);
        if (isUrl) {
            const meta = await fetchUrlMetadata(topic);
            if (meta) {
                promptTopic = `News Article: ${meta.title}\n${meta.description}`;
                extractedImage = meta.image;
            }
        }

        if (provider === 'gemini') {
            const apiKey = geminiKey || process.env.GEMINI_API_KEY;
            if (!apiKey) return NextResponse.json({ error: "Gemini API key is missing. Add it in Settings." }, { status: 401 });

            const genAI = new GoogleGenerativeAI(apiKey);

            // Using gemini-1.5-flash as the global default for high-speed generation
            const model = genAI.getGenerativeModel({
                model: "gemini-1.5-flash",
                systemInstruction: systemPrompt
            });

            try {
                const result = await model.generateContent({
                    contents: [{ role: "user", parts: [{ text: `Generate a news post about: ${promptTopic}` }] }],
                    generationConfig: {
                        temperature: 0.7,
                        responseMimeType: "application/json",
                    },
                });

                const text = result.response.text();
                parsedContent = JSON.parse(text);
            } catch (err: any) {
                // Fallback to gemini-pro if flash is not found or restricted
                if (err.message?.includes('not found') || err.message?.includes('not supported')) {
                    const fallbackModel = genAI.getGenerativeModel({ model: "gemini-pro" });
                    const retryResult = await fallbackModel.generateContent({
                        contents: [
                            { role: "user", parts: [{ text: systemPrompt }] },
                            { role: "model", parts: [{ text: "Understood. Awaiting topic." }] },
                            { role: "user", parts: [{ text: `Generate a news post about: ${topic}. Return strictly JSON.` }] }
                        ]
                    });
                    // Strip markdown JSON blocks if the older model adds them
                    let rawText = retryResult.response.text();
                    rawText = rawText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                    parsedContent = JSON.parse(rawText);
                } else {
                    throw err; // Real error like invalid key
                }
            }

        } else if (provider === 'openai') {
            const apiKey = openaiKey || process.env.OPENAI_API_KEY;
            if (!apiKey) return NextResponse.json({ error: "OpenAI API key is missing. Add it in Settings." }, { status: 401 });

            const openai = new OpenAI({ apiKey });
            const completion = await openai.chat.completions.create({
                model: "gpt-4o-mini", // Fast and cheap for this usecase
                response_format: { type: "json_object" },
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: `Generate a news post about: ${topic}` }
                ]
            });

            const content = completion.choices[0].message.content;
            if (!content) throw new Error("Received empty response from OpenAI");
            parsedContent = JSON.parse(content);
        } else {
            return NextResponse.json({ error: "Invalid provider selected" }, { status: 400 });
        }

        // Attach extracted image to the response so the frontend can use it
        if (extractedImage) {
            parsedContent.extractedImage = extractedImage;
        }

        return NextResponse.json({ success: true, data: parsedContent });

    } catch (error: any) {
        console.error("News Generation Error:", error);
        return NextResponse.json({ error: error.message || "An unexpected error occurred during generation." }, { status: 500 });
    }
}
