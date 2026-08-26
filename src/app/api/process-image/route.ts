import { NextResponse } from 'next/server';
import sharp from 'sharp';

export async function POST(request: Request) {
    try {
        const { imageUrl } = await request.json();

        if (!imageUrl) {
            return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
        }

        // 1. Download the image into an ArrayBuffer
        const imageResponse = await fetch(imageUrl);
        if (!imageResponse.ok) throw new Error('Failed to fetch the source image');

        const arrayBuffer = await imageResponse.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // 2. Process with Sharp
        // 1:1 Square crop (1080x1080), slight contrast/brightness boost
        const processedBuffer = await sharp(buffer)
            .resize(1080, 1080, {
                fit: 'cover',
                position: 'attention' // Tries to focus on the subject
            })
            .modulate({
                brightness: 1.05, // Slight brightness boost
                saturation: 1.1   // Slight color pop
            })
            .sharpen() // Sharpen the image slightly for a crisp look
            .jpeg({ quality: 90 }) // Output high quality JPEG
            .toBuffer();

        // 3. Convert to base64 for immediate frontend rendering
        const base64Image = `data:image/jpeg;base64,${processedBuffer.toString('base64')}`;

        return NextResponse.json({ success: true, processedImage: base64Image });

    } catch (error: any) {
        console.error('Image Processing Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
