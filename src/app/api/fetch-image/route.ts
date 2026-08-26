import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { query } = await request.json();

        const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
        const cx = process.env.GOOGLE_SEARCH_CX;

        if (!apiKey || !cx) {
            return NextResponse.json(
                { error: 'Google Search API credentials are not configured.' },
                { status: 500 }
            );
        }

        // Google Custom Search JSON API
        // searchType=image, rights=cc_publicdomain,cc_attribute (Creative Commons / news usable)
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.append('key', apiKey);
        url.searchParams.append('cx', cx);
        url.searchParams.append('q', query);
        url.searchParams.append('searchType', 'image');
        url.searchParams.append('rights', 'cc_publicdomain,cc_attribute,cc_sharealike');
        url.searchParams.append('imgSize', 'large');
        url.searchParams.append('num', '1');

        const response = await fetch(url.toString());
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'Failed to fetch image from Google');
        }

        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ success: false, error: 'No images found for query' }, { status: 404 });
        }

        const imageUrl = data.items[0].link;

        return NextResponse.json({ success: true, imageUrl });
    } catch (error: any) {
        console.error('Image Fetch Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
