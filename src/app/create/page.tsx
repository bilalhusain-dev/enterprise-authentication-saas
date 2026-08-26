"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import PostCanvas from "@/components/PostCanvas/PostCanvas";
import { Wand2, AlertCircle, RefreshCw } from "lucide-react";

export default function CreatePostPage() {
    const [topic, setTopic] = useState("");
    const [platform, setPlatform] = useState("Facebook");
    const [tone, setTone] = useState("Neutral");
    const [category, setCategory] = useState("World");

    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [generationData, setGenerationData] = useState<any>(null);
    const [images, setImages] = useState<string[]>([]);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;

        setIsGenerating(true);
        setError(null);
        setGenerationData(null);
        setImages([]);

        try {
            const provider = localStorage.getItem("newsgen_provider") || "gemini";
            const openaiKey = localStorage.getItem("newsgen_openai_key");
            const geminiKey = localStorage.getItem("newsgen_gemini_key");

            const textRes = await fetch("/api/generate-news", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic, platform, tone, category, provider, openaiKey, geminiKey }),
            });

            const textData = await textRes.json();
            if (!textData.success) throw new Error(textData.error);

            const aiContent = textData.data;

            const imgRes = await fetch("/api/fetch-images", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query: aiContent.searchQuery }),
            });

            const imgData = await imgRes.json();
            let finalImages = imgData.images || [];
            if (finalImages.length === 0) {
                finalImages = [
                    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=1080",
                    "https://images.unsplash.com/photo-1585829365295-ab7cd400c167?q=80&w=1080",
                    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1080"
                ];
            }

            setGenerationData(aiContent);
            setImages(finalImages);

        } catch (err: any) {
            setError(err.message || "Generation failed. Please check your API keys.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-8">
            <div className="max-w-[1600px] mx-auto space-y-6">
                
                {/* Header */}
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        Postra AI <span className="text-blue-600">Studio</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-medium">Broadcast-grade graphics generation engine.</p>
                </div>

                <div className="grid xl:grid-cols-[340px_300px_1fr] gap-6 items-start">
                    
                    {/* Col 1: Formulation */}
                    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">1. Content Source</h3>
                        <form onSubmit={handleGenerate} className="space-y-6">
                            <textarea
                                id="topic"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                placeholder="Paste news link..."
                                className="w-full rounded-2xl bg-slate-50 border-0 p-4 text-xs min-h-[140px] focus:ring-2 focus:ring-blue-500 transition-all font-medium"
                                required
                            />
                            
                            <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-slate-400">Platform</Label>
                                    <Select value={platform} onChange={(e) => setPlatform(e.target.value)} className="bg-slate-50 border-0 h-10 text-xs">
                                        <option value="Facebook">Facebook</option>
                                        <option value="X">X (Twitter)</option>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase text-slate-400">Tone</Label>
                                    <Select value={tone} onChange={(e) => setTone(e.target.value)} className="bg-slate-50 border-0 h-10 text-xs">
                                        <option value="Neutral">Neutral</option>
                                        <option value="Breaking">Breaking</option>
                                    </Select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-12 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                                disabled={isGenerating || !topic.trim()}
                            >
                                {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4 mr-2" />}
                                {isGenerating ? "Processing..." : "Generate Post"}
                            </Button>
                        </form>
                    </div>

                    {/* Col 2 & 3: Handled by PostCanvas component which now manages the sketches and preview */}
                    <div className="xl:col-span-2">
                        <PostCanvas data={generationData} images={images} isGenerating={isGenerating} />
                    </div>

                </div>
            </div>
        </div>
    );
}
