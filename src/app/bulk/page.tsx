"use client";

import { useState, useRef } from "react";
import JSZip from "jszip";
import { toPng } from "html-to-image";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Wand2, Download, AlertCircle, Loader2, Layers } from "lucide-react";
import PostCanvas from "@/components/PostCanvas/PostCanvas";
import { cn } from "@/lib/utils";

// We use an invisible wrapper to render the canvases off-screen for export
export default function BulkGeneratePage() {
    const [topicsText, setTopicsText] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const [highlightTextColor, setHighlightTextColor] = useState("#000000");
    const [gradientOpacity, setGradientOpacity] = useState<number>(100);
    const [gradientHeight, setGradientHeight] = useState<number>(60);
    const [globalBadgePosition, setGlobalBadgePosition] = useState<"left" | "center" | "right" | "none">("left");
    const [globalBadgeStyle, setGlobalBadgeStyle] = useState<"classic" | "angled-green" | "split-ribbon" | "bars" | "folded-ribbon" | "sleek-ticker">("classic");
    const [bgSize, setBgSize] = useState<number>(100);
    const [secondaryImageUrl, setSecondaryImageUrl] = useState<string | null>(null);
    const [secondaryImageSize, setSecondaryImageSize] = useState<number>(100);

    // Store the generated data for each post
    const [bulkResults, setBulkResults] = useState<Array<{
        id: number;
        data: any;
        images: string[];
        gradientClass: string;
    }>>([]);

    const hiddenCanvasContainerRef = useRef<HTMLDivElement>(null);

    const GRADIENTS = [
        "bg-gradient-preset-1", "bg-gradient-preset-2", "bg-gradient-preset-3",
        "bg-gradient-preset-4", "bg-gradient-preset-5", "bg-gradient-preset-6",
        "bg-gradient-preset-7", "bg-gradient-preset-8", "bg-gradient-preset-9",
        "bg-gradient-preset-10", "bg-gradient-preset-21", "bg-gradient-preset-22",
        "bg-gradient-preset-23", "bg-gradient-preset-24", "bg-gradient-preset-25",
        "bg-gradient-preset-26", "bg-gradient-preset-27", "bg-gradient-preset-28",
        "bg-gradient-preset-29"
    ];

    const handleBulkGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        const topicsList = topicsText.split("\n").map(t => t.trim()).filter(t => t.length > 0);

        if (topicsList.length === 0) return;
        if (topicsList.length > 20) {
            setError("Maximum 20 topics allowed per bulk run to prevent API timeouts.");
            return;
        }

        setIsGenerating(true);
        setError(null);
        setBulkResults([]);
        setProgress(0);

        const provider = localStorage.getItem("newsgen_provider") || "gemini";
        const openaiKey = localStorage.getItem("newsgen_openai_key");
        const geminiKey = localStorage.getItem("newsgen_gemini_key");

        const newResults = [];

        for (let i = 0; i < topicsList.length; i++) {
            const topic = topicsList[i];
            try {
                // 1. Generate text
                const textRes = await fetch("/api/generate-news", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        topic,
                        platform: "Facebook",
                        tone: "Neutral",
                        category: "World",
                        provider,
                        openaiKey,
                        geminiKey,
                    }),
                });
                const textData = await textRes.json();
                if (!textData.success) throw new Error(textData.error);

                // 2. Fetch images
                const imgRes = await fetch("/api/fetch-images", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ query: textData.data.searchQuery }),
                });
                const imgData = await imgRes.json();

                let finalImages = imgData.images || [];
                if (finalImages.length === 0) {
                    finalImages = ["https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1080"];
                }

                // Assign a random gradient
                const randomGradient = GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)];

                newResults.push({
                    id: i,
                    data: textData.data,
                    images: finalImages,
                    gradientClass: randomGradient
                });

                setProgress(Math.round(((i + 1) / topicsList.length) * 100));

            } catch (err: any) {
                console.error(`Error on topic ${i}:`, err);
                // We continue processing the rest even if one fails
            }
        }

        setBulkResults(newResults);
        setIsGenerating(false);
    };

    const handleDownloadZip = async () => {
        if (!hiddenCanvasContainerRef.current || bulkResults.length === 0) return;

        const zip = new JSZip();
        const folderName = `news-batch-${Date.now()}`;
        const imgFolder = zip.folder(folderName);

        // Find all rendered canvases inside the hidden container
        const canvasNodes = hiddenCanvasContainerRef.current.querySelectorAll('.export-node');

        for (let i = 0; i < canvasNodes.length; i++) {
            const node = canvasNodes[i] as HTMLElement;
            try {
                const dataUrl = await toPng(node, { quality: 1, pixelRatio: 2 });
                // extract base64 data
                const base64Data = dataUrl.replace(/^data:image\/png;base64,/, "");

                // Add image to Zip
                imgFolder?.file(`NewsPost_${i + 1}.png`, base64Data, { base64: true });

                // Add caption text to Zip
                const textToSave = `${bulkResults[i].data.headline}\n\n${bulkResults[i].data.caption}\n\n${bulkResults[i].data.hashtags.join(" ")}`;
                imgFolder?.file(`Caption_${i + 1}.txt`, textToSave);

            } catch (err) {
                console.error("ZIP Generation error for node", i, err);
            }
        }

        // Generate and download
        zip.generateAsync({ type: "blob" }).then((content) => {
            const link = document.createElement("a");
            link.className = "hidden-download-link";
            link.href = URL.createObjectURL(content);
            link.download = `${folderName}.zip`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    };

    const handleSecondaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSecondaryImageUrl(URL.createObjectURL(file));
    };

    return (
        <div className="max-w-3xl mx-auto py-4">

            <div className="mb-4">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Bulk Generator</h1>
                <p className="text-slate-600 text-xs mt-1">Generate up to 20 news graphics instantly. Download as a single ZIP archive.</p>
            </div>

            <Card className="shadow-sm border-slate-200">
                <CardContent className="p-4 sm:p-5">
                    <form onSubmit={handleBulkGenerate} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="bulk">Topics (One per line)</Label>
                            <textarea
                                id="bulk"
                                value={topicsText}
                                onChange={(e) => setTopicsText(e.target.value)}
                                placeholder="The Federal Reserve cuts interest rates...&#10;Scientists discover new coral reef...&#10;Google announces AI updates..."
                                className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-600 min-h-[200px] font-mono leading-relaxed resize-none"
                                required
                            />
                            <p className="text-xs text-slate-500 font-medium">Input lines: {topicsText.split("\n").filter(t => t.trim().length > 0).length} / 20 MAX</p>
                        </div>

                        <div className="space-y-3">
                            <Label>Breaking News Badge Positioning & Style</Label>
                            <div className="flex flex-col gap-3">
                                <div className="flex flex-wrap gap-2">
                                    {["none", "left", "center", "right"].map(pos => (
                                        <button
                                            key={pos}
                                            type="button"
                                            onClick={() => setGlobalBadgePosition(pos as any)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-md text-xs font-semibold transition-all border capitalize",
                                                globalBadgePosition === pos ? "bg-red-50 text-red-700 border-red-200 ring-1 ring-red-200" : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50"
                                            )}
                                        >
                                            {pos === "none" ? "No Badge" : `${pos} Aligned`}
                                        </button>
                                    ))}
                                </div>
                                {globalBadgePosition !== "none" && (
                                    <div className="flex flex-wrap gap-2">
                                        {["classic", "angled-green", "split-ribbon", "bars", "folded-ribbon", "sleek-ticker"].map(style => (
                                            <button
                                                key={style}
                                                type="button"
                                                onClick={() => setGlobalBadgeStyle(style as any)}
                                                className={cn(
                                                    "px-3 py-1.5 text-xs rounded-lg border transition-all capitalize font-bold shadow-sm",
                                                    globalBadgeStyle === style ? "border-amber-500 bg-amber-50 text-amber-700 ring-1 ring-amber-500/50" : "border-slate-200 hover:bg-slate-50 text-slate-600"
                                                )}
                                            >
                                                {style.replace("-", " ")}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Gradient Overlays</Label>
                            <div className="flex items-center justify-between">
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    Gradient Overlays
                                    <div className="px-1.5 py-0.5 bg-blue-100 text-blue-600 rounded text-[7px] font-black">20 PRESETS</div>
                                </h4>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Size</span>
                                        <input
                                            type="range"
                                            min="20" max="100" step="5"
                                            value={gradientHeight}
                                            onChange={(e) => setGradientHeight(Number(e.target.value))}
                                            className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                                        />
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Opacity</span>
                                        <input
                                            type="range"
                                            min="0" max="100" step="10"
                                            value={gradientOpacity}
                                            onChange={(e) => setGradientOpacity(Number(e.target.value))}
                                            className="w-16 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <Label>Background & Additional Media</Label>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Background Zoom</Label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="range"
                                            min="100" max="300" step="10"
                                            value={bgSize}
                                            onChange={(e) => setBgSize(Number(e.target.value))}
                                            className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                        />
                                        <span className="text-[10px] font-bold text-slate-500 w-8">{bgSize}%</span>
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Secondary Image</Label>
                                    <div className="flex items-center gap-3">
                                        <label className="w-10 h-10 rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors overflow-hidden relative group">
                                            {secondaryImageUrl ? (
                                                <img src={secondaryImageUrl} className="w-full h-full object-contain" alt="Secondary" />
                                            ) : (
                                                <Layers className="w-4 h-4 text-slate-400 group-hover:text-blue-600" />
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleSecondaryImageUpload} />
                                        </label>
                                        
                                        {secondaryImageUrl && (
                                            <div className="flex-1 flex flex-col gap-1">
                                                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Size</span>
                                                <div className="flex items-center gap-2">
                                                    <input
                                                        type="range"
                                                        min="10" max="200" step="5"
                                                        value={secondaryImageSize}
                                                        onChange={(e) => setSecondaryImageSize(Number(e.target.value))}
                                                        className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm flex gap-2 items-start">
                                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all h-10 text-sm"
                            disabled={isGenerating || topicsText.trim() === ""}
                        >
                            {isGenerating ? (
                                <span className="flex items-center gap-2">
                                    <Loader2 className="w-5 h-5 animate-spin" /> Processing ({progress}%)...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    <Layers className="w-5 h-5" /> Generate Bulk Batch
                                </span>
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Render Results List */}
            {bulkResults.length > 0 && !isGenerating && (
                <div className="mt-8 space-y-4">
                    <div className="flex items-center justify-between border-b pb-3 border-slate-200">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Render Complete</h3>
                            <p className="text-slate-500 text-xs">{bulkResults.length} graphics successfully generated.</p>
                        </div>
                        <Button onClick={handleDownloadZip} className="bg-slate-900 text-white hover:bg-slate-800 shadow-md">
                            <Download className="w-4 h-4 mr-2" /> Download ZIP
                        </Button>
                    </div>

                    {/* We render them offscreen in a hidden container purely for HTML-to-Image capturing */}
                    <div className="hidden">
                        <div ref={hiddenCanvasContainerRef}>
                            {bulkResults.map((result) => (
                                <div key={result.id} className="export-node w-[1080px]">
                                    <PostCanvas 
                                        data={result.data} 
                                        images={result.images} 
                                        isGenerating={false}
                                        secondaryImage={secondaryImageUrl}
                                        secondaryImageSize={secondaryImageSize}
                                        gradientHeight={gradientHeight}
                                        gradientOpacity={gradientOpacity}
                                        badgePosition={globalBadgePosition}
                                        badgeStyle={globalBadgeStyle}
                                        gradient={result.gradientClass}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Visual Preview list for user */}
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {bulkResults.map((result, i) => (
                            <div key={i} className="bg-white p-4 rounded-xl border shadow-sm">
                                <div className="rounded-lg overflow-hidden mb-4 bg-slate-900">
                                    <PostCanvas 
                                        data={result.data} 
                                        images={result.images} 
                                        isGenerating={false}
                                        secondaryImage={secondaryImageUrl}
                                        secondaryImageSize={secondaryImageSize}
                                        gradientHeight={gradientHeight}
                                        gradientOpacity={gradientOpacity}
                                        badgePosition={globalBadgePosition}
                                        badgeStyle={globalBadgeStyle}
                                        gradient={result.gradientClass}
                                    />
                                </div>
                                <p className="text-xs text-slate-500 line-clamp-2">{result.data.caption}</p>
                            </div>
                        ))}
                    </div>

                </div>
            )}

        </div>
    );
}
