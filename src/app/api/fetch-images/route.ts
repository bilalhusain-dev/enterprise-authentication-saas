import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { query } = await req.json();

        // Ensure we fall back to environment variables securely
        const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
        const cx = process.env.GOOGLE_SEARCH_CX;

        if (!apiKey || !cx) {
            console.error("Missing GOOGLE_SEARCH_API_KEY or GOOGLE_SEARCH_CX");
            return NextResponse.json({ error: "Google Custom Search credentials are not configured on the server." }, { status: 500 });
        }

        // Fetch exactly 3 images, filtered for high-res large images, and commercial reuse rights
        const url = new URL('https://www.googleapis.com/customsearch/v1');
        url.searchParams.append('key', apiKey);
        url.searchParams.append('cx', cx);
        url.searchParams.append('q', query);
        url.searchParams.append('searchType', 'image');
        url.searchParams.append('rights', 'cc_publicdomain,cc_attribute,cc_sharealike,cc_noncommercial'); // Broadened slightly for news context
        url.searchParams.append('imgSize', 'large');
        url.searchParams.append('num', '3'); // Fetch top 3 options
        url.searchParams.append('safe', 'active');

        const response = await fetch(url.toString(), { cache: 'no-store' }); // Prevent stale images
        const data = await response.json();

        if (!response.ok) {
            console.error("Google Custom Search API Error:", data.error);
            throw new Error(data.error?.message || "Failed to fetch images from Google API.");
        }

        if (!data.items || data.items.length === 0) {
            return NextResponse.json({ images: [] });
        }

        // Map the results to an array of URLs for the frontend
        const images = data.items.map((item: any) => item.link);

        return NextResponse.json({ success: true, images });

    } catch (error: any) {
        console.error("Image Fetch Error:", error);
        return NextResponse.json({ error: error.message || "An unexpected error occurred." }, { status: 500 });
    }
}
