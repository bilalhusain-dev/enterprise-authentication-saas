"use client";

import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, Upload, Crop, Wand2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface PostCanvasProps {
    data: {
        headline: string;
        supportingLine: string;
        caption: string;
        searchQuery: string;
        hashtags: string[];
        design?: {
            sketchStyle: string;
            fontFamily: string;
            badgeStyle: string;
            badgeColor: string;
            badgeText: string;
        };
    } | null;
    images: string[];
    isGenerating: boolean;
    secondaryImage?: string | null;
    secondaryImageSize?: number;
    gradientHeight?: number;
    gradientOpacity?: number;
    // Styling props for parent control (Bulk etc)
    badgePosition?: "left" | "center" | "right" | "none";
    badgeStyle?: string;
    badgeColor?: string;
    badgeSize?: number;
    gradient?: string;
}

const GRADIENTS = [
    { id: "preset-1", name: "News Blue", class: "bg-gradient-preset-1" },
    { id: "preset-2", name: "Breaking Red", class: "bg-gradient-preset-2" },
    { id: "preset-3", name: "Deep Navy", class: "bg-gradient-preset-3" },
    { id: "preset-4", name: "Slate Grey", class: "bg-gradient-preset-4" },
    { id: "preset-5", name: "Teal", class: "bg-gradient-preset-5" },
    { id: "preset-6", name: "Purple", class: "bg-gradient-preset-6" },
    { id: "preset-21", name: "Highlight Yellow", class: "bg-gradient-preset-21" },
    { id: "preset-22", name: "Luminous Lime", class: "bg-gradient-preset-22" },
    { id: "preset-23", name: "Cyber Neon", class: "bg-gradient-preset-23" },
    { id: "preset-24", name: "Blood Moon", class: "bg-gradient-preset-24" },
    { id: "preset-25", name: "Deep Ocean", class: "bg-gradient-preset-25" },
    { id: "preset-26", name: "Midnight Gold", class: "bg-gradient-preset-26" },
    { id: "preset-27", name: "Retro Peach", class: "bg-gradient-preset-27" },
    { id: "preset-28", name: "Hot Lava", class: "bg-gradient-preset-28" },
    { id: "preset-29", name: "Clean White", class: "bg-gradient-preset-29" },
];

const RATIOS = [
    { id: "square", name: "1:1", class: "aspect-square" },
    { id: "portrait", name: "4:5", class: "aspect-[4/5]" },
    { id: "landscape", name: "16:9", class: "aspect-video" },
];

export default function PostCanvas({ 
    data, 
    images, 
    isGenerating,
    secondaryImage: initialSecondaryImage,
    secondaryImageSize: initialSecondaryImageSize = 100,
    gradientHeight: initialGradientHeight = 60,
    gradientOpacity: initialGradientOpacity = 100,
    badgePosition: initialBadgePosition = "left",
    badgeStyle: initialBadgeStyle = "classic",
    badgeColor: initialBadgeColor = "#dc2626",
    badgeSize: initialBadgeSize = 1,
    gradient: initialGradient = "bg-gradient-preset-1"
}: PostCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    const [activeImage, setActiveImage] = useState<string>("");
    const [activeGradient, setActiveGradient] = useState<string>(initialGradient);
    const [activeRatio, setActiveRatio] = useState<string>("aspect-square");
    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [badgePosition, setBadgePosition] = useState<"left" | "center" | "right" | "none">(initialBadgePosition);
    const [badgeStyle, setBadgeStyle] = useState<string>(initialBadgeStyle);
    const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
    const [overlayPos, setOverlayPos] = useState<"bottom-left" | "bottom-right" | "top-left" | "top-right" | "center">("bottom-right");
    const [overlaySize, setOverlaySize] = useState<number>(192);
    const [overlayBorderColor, setOverlayBorderColor] = useState<string>("#dc2626");
    const [badgeColor, setBadgeColor] = useState<string>(initialBadgeColor);
    const [badgeSize, setBadgeSize] = useState<number>(initialBadgeSize);
    
    // AI Automated Design States
    const [sketchStyle, setSketchStyle] = useState<string>("default");
    const [fontFamily, setFontFamily] = useState<string>("font-sans");
    const [badgeText, setBadgeText] = useState<string>("BREAKING NEWS");
    
    // Support for secondary image in PostCanvas
    const [secondaryImg, setSecondaryImg] = useState<string | null>(initialSecondaryImage || null);
    const [secSize, setSecSize] = useState<number>(initialSecondaryImageSize);
    const [gradHeight, setGradHeight] = useState<number>(initialGradientHeight);
    const [activeTab, setActiveTab] = useState<"visuals" | "typography" | "badges">("visuals");
    const [gradOpacity, setGradOpacity] = useState<number>(initialGradientOpacity);

    // Sync with props
    useEffect(() => {
        if (initialSecondaryImage !== undefined) setSecondaryImg(initialSecondaryImage);
        if (initialSecondaryImageSize !== undefined) setSecSize(initialSecondaryImageSize);
        if (initialGradientHeight !== undefined) setGradHeight(initialGradientHeight);
        if (initialGradientOpacity !== undefined) setGradOpacity(initialGradientOpacity);
        if (initialBadgePosition !== undefined) setBadgePosition(initialBadgePosition);
        if (initialBadgeStyle !== undefined) setBadgeStyle(initialBadgeStyle);
        if (initialBadgeColor !== undefined) setBadgeColor(initialBadgeColor);
        if (initialBadgeSize !== undefined) setBadgeSize(initialBadgeSize);
        if (initialGradient !== undefined) setActiveGradient(initialGradient);
    }, [
        initialSecondaryImage, initialSecondaryImageSize, 
        initialGradientHeight, initialGradientOpacity,
        initialBadgePosition, initialBadgeStyle, initialBadgeColor, initialBadgeSize,
        initialGradient
    ]);

    // Sync AI Design data when generated
    useEffect(() => {
        if (data && data.design) {
            if (data.design.sketchStyle) setSketchStyle(data.design.sketchStyle);
            if (data.design.fontFamily) setFontFamily(data.design.fontFamily);
            if (data.design.badgeStyle) setBadgeStyle(data.design.badgeStyle);
            if (data.design.badgeColor) setBadgeColor(data.design.badgeColor);
            if (data.design.badgeText) setBadgeText(data.design.badgeText);
            
            const s = data.design.sketchStyle;
            if (s === "cinematic") {
                setGradOpacity(100); setGradHeight(80);
            } else if (s === "split-bottom" || s === "worldvibe-split" || s === "breaking-red" || s === "elegant-blur") {
                setGradOpacity(0);
            } else {
                setGradOpacity(100); setGradHeight(60);
            }
        }
    }, [data]);

    const renderHighlightedText = (text: string) => {
        if (!text) return "";
        const parts = text.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const innerText = part.slice(1, -1);
                return (
                    <span
                        key={index}
                        className={cn(
                            "inline-block px-2 py-0.5 mx-0.5 font-bold rounded-sm leading-none shadow-md",
                            sketchStyle === "emery-minimal" ? "bg-transparent text-[#f87171] p-0 shadow-none font-black" : "bg-[#facc15] text-black"
                        )}
                    >
                        {innerText}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    const getDynamicFontSize = (text: string, type: "heading" | "supporting") => {
        const length = text.length;
        if (sketchStyle === "classic-split-65") {
            if (type === "heading") {
                if (length > 60) return "text-xl sm:text-2xl lg:text-3xl";
                if (length > 40) return "text-2xl sm:text-3xl lg:text-[34px]";
                return "text-3xl sm:text-4xl lg:text-[38px]";
            } else {
                if (length > 80) return "text-xs sm:text-sm";
                return "text-sm sm:text-base lg:text-lg";
            }
        }
        return type === "heading" ? "text-3xl sm:text-4xl lg:text-[38px]" : "text-base sm:text-xl";
    };

    // Draggable Layout States
    const [positions, setPositions] = useState({
        overlay: { x: 0, y: 0 },
        logo: { x: 0, y: 0 },
        heading: { x: 0, y: 0 },
        paragraph: { x: 0, y: 0 },
        badge: { x: 0, y: 0 },
        bgImage: { x: 0, y: 0 },
        secondary: { x: 0, y: 0 }
    });
    const [activeDrag, setActiveDrag] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!activeDrag) return;
            setPositions((prev) => ({
                ...prev,
                [activeDrag]: {
                    x: e.clientX - dragStart.x,
                    y: e.clientY - dragStart.y,
                },
            }));
        };
        const handleMouseUp = () => setActiveDrag(null);

        if (activeDrag) {
            window.addEventListener("mousemove", handleMouseMove);
            window.addEventListener("mouseup", handleMouseUp);
        }
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", handleMouseUp);
        };
    }, [activeDrag, dragStart]);

    const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
        setActiveDrag(elementId);
        setDragStart({
            x: e.clientX - positions[elementId as keyof typeof positions].x,
            y: e.clientY - positions[elementId as keyof typeof positions].y,
        });
    };

    useEffect(() => {
        if (images && images.length > 0) {
            setActiveImage(images[0]);
        }
    }, [images]);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setLogoUrl(url);
        }
    };

    const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setOverlayImageUrl(URL.createObjectURL(file));
    };

    const handlePasteImage = async (onSuccess: (url: string) => void) => {
        try {
            const clipboardItems = await navigator.clipboard.read();
            for (const clipboardItem of clipboardItems) {
                const imageTypes = clipboardItem.types.filter(type => type.startsWith('image/'));
                if (imageTypes.length > 0) {
                    const blob = await clipboardItem.getType(imageTypes[0]);
                    const url = URL.createObjectURL(blob);
                    onSuccess(url);
                    return;
                }
            }
            alert("No image found in clipboard.");
        } catch (err) {
            console.error(err);
            alert("Failed to read from clipboard. Please allow clipboard permissions.");
        }
    };

    const handlePasteBackground = () => {
        handlePasteImage((url) => setActiveImage(url));
    };

    const handleExport = async () => {
        if (!canvasRef.current || !data) return;
        try {
            const dataUrl = await toPng(canvasRef.current, { quality: 1, pixelRatio: 2 });
            const link = document.createElement("a");
            link.className = "hidden-download-link";
            link.download = `news-post-${Date.now()}.png`;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Auto-download caption text
            const textToSave = `${data.headline}\n\n${data.caption}\n\n${data.hashtags.join(" ")}`;
            const blob = new Blob([textToSave], { type: "text/plain" });
            const txtLink = document.createElement("a");
            txtLink.download = `caption-${Date.now()}.txt`;
            txtLink.href = URL.createObjectURL(blob);
            document.body.appendChild(txtLink);
            txtLink.click();
            document.body.removeChild(txtLink);

        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export image. Please try again.");
        }
    };

    if (isGenerating) {
        return (
            <div className="w-full aspect-square bg-slate-100 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-300">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mb-4" />
                <p className="text-slate-600 font-medium">Drafting editorial content & fetching news imagery...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="w-full aspect-square bg-slate-50 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 shadow-inner">
                <div className="text-center p-6 space-y-4">
                    <div className="inline-flex p-4 rounded-full bg-slate-100 text-slate-300">
                        <Crop className="w-12 h-12" />
                    </div>
                    <div>
                        <p className="text-slate-500 font-semibold mb-1">Canvas is empty</p>
                        <p className="text-sm text-slate-400">Fill out the generator form to see your master graphic.</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid xl:grid-cols-[300px_1fr] gap-8 items-start w-full">
            
            {/* Design Intelligence Column */}
            <div className="space-y-6">
                <div className="bg-white rounded-[2rem] p-6 border border-slate-200 shadow-sm space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 flex items-center justify-center">
                            <Wand2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Design Engine</h3>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Select Visual Sketch</p>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        {[
                            { id: "emery-minimal", label: "Emery Split", desc: "65/35 Centered Design" },
                            { id: "classic-split-65", label: "Classic Split", desc: "Strict Broadcast Layout" },
                            { id: "quote-full", label: "Editorial Quote", desc: "No Headline, Impact Text" },
                            { id: "breaking-red", label: "Breaking Red", desc: "High-Urgency Alert" },
                            { id: "cinematic", label: "Cinematic", desc: "Overlay & Gradient" },
                            { id: "floating-glass", label: "Glassmorphism", desc: "Premium Frosted Blur" }
                        ].map((sketch) => (
                            <button
                                key={sketch.id}
                                onClick={() => setSketchStyle(sketch.id as any)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-2xl border-2 transition-all duration-300 text-left group w-full relative overflow-hidden",
                                    sketchStyle === sketch.id 
                                        ? "border-blue-600/50 bg-blue-50" 
                                        : "border-slate-100 bg-slate-50 hover:border-slate-200"
                                )}
                            >
                                <div className={cn(
                                    "w-2 h-2 rounded-full shrink-0 transition-all duration-500",
                                    sketchStyle === sketch.id ? "bg-blue-600 scale-125 shadow-[0_0_10px_rgba(37,99,235,0.5)]" : "bg-slate-300"
                                )} />
                                <div className="min-w-0">
                                    <span className={cn("text-xs font-bold block mb-0.5", sketchStyle === sketch.id ? "text-blue-700" : "text-slate-600")}>
                                        {sketch.label}
                                    </span>
                                    <span className="text-[10px] text-slate-400 block truncate">{sketch.desc}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-slate-900 rounded-[2rem] p-6 border border-slate-800 space-y-4">
                    <div className="flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 text-blue-500" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-widest">Editor Intelligence</h4>
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed font-medium">
                        Drag headlines or images on the canvas to manually override the AI's automatic positioning. Your changes are saved in real-time.
                    </p>
                </div>
            </div>

            {/* Canvas & Refinement Column */}
            <div className="space-y-8">
                
                {/* The Preview Canvas */}
                <div className="flex justify-center w-full">
                    <div className="relative group rounded-[2.5rem] p-4 overflow-hidden bg-white/40 backdrop-blur-md border border-slate-200 shadow-xl flex items-center justify-center w-full max-w-[540px]">
                        <div
                            ref={canvasRef}
                            className={cn(
                                "relative w-full max-w-[500px] bg-slate-900 transition-all duration-300 ease-in-out flex flex-col origin-center overflow-hidden",
                                activeRatio
                            )}
                        >
                            {/* 65% Top: The Visual Asset Zone */}
                            <div className="relative w-full h-[65%] overflow-hidden bg-slate-950 select-none">
                                {activeImage && (
                                    <div
                                        className="absolute inset-0 bg-no-repeat transition-transform duration-1000 cursor-grab active:cursor-grabbing"
                                        style={{
                                            backgroundImage: `url(${activeImage})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: `calc(50% + ${positions.bgImage.x}px) calc(50% + ${positions.bgImage.y}px)`
                                        }}
                                        onMouseDown={(e) => handleMouseDown(e, "bgImage")}
                                    />
                                )}
                                
                                {sketchStyle === "cinematic" && (
                                    <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20 pointer-events-none" />
                                )}
                            </div>

                            {/* 35% Bottom: The Editorial Content Zone */}
                            <div 
                                className={cn(
                                    "relative w-full h-[35%] z-20 flex flex-col items-center justify-center transition-all duration-500",
                                    sketchStyle === "classic-split-65" && "bg-[#0a0a0a] border-t-4 border-red-600 px-10 text-left items-start",
                                    sketchStyle === "emery-minimal" && "bg-white border-t-4 border-blue-600 px-12 text-center items-center",
                                    sketchStyle === "breaking-red" && "bg-[#dc2626] border-t-4 border-white/30 px-10 text-center items-center",
                                    sketchStyle === "cinematic" && "bg-[#020617] border-t-4 border-slate-700 px-10 text-left items-start",
                                    sketchStyle === "floating-glass" && "bg-slate-900 border-t-4 border-indigo-500 px-10 text-left items-start",
                                    sketchStyle === "quote-full" && "bg-black border-t-4 border-amber-500 px-10 text-center items-center"
                                )}
                                style={{ borderTopColor: (badgePosition !== "none") ? badgeColor : undefined }}
                            >
                                {/* Professional Accents */}
                                {sketchStyle === "emery-minimal" && (
                                    <div className="flex items-center gap-3 w-full justify-center mb-4 opacity-40">
                                        <div className="h-[1px] flex-1 max-w-[60px] bg-slate-300" />
                                        <span className="text-slate-500 font-black tracking-[0.4em] text-[8px] uppercase">{badgeText || "EDITORIAL"}</span>
                                        <div className="h-[1px] flex-1 max-w-[60px] bg-slate-300" />
                                    </div>
                                )}
                                
                                {sketchStyle === "classic-split-65" && (
                                    <div className="absolute -top-[20px] left-10 h-[20px] px-3 bg-red-600 text-white font-black text-[9px] flex items-center tracking-widest z-30 shadow-lg">
                                        <span className="uppercase">{badgeText || "BREAKING"}</span>
                                    </div>
                                )}

                                <div className={cn(
                                    "w-full space-y-2 pointer-events-none overflow-hidden flex flex-col",
                                    sketchStyle === "emery-minimal" || sketchStyle === "breaking-red" ? "items-center" : "items-start"
                                )}>
                                    {sketchStyle !== "quote-full" && (
                                        <div 
                                            style={{ transform: `translate(${positions.heading.x}px, ${positions.heading.y}px)` }} 
                                            className="relative z-30 pointer-events-auto" 
                                            onMouseDown={(e) => handleMouseDown(e, "heading")}
                                        >
                                            <h2 className={cn(
                                                getDynamicFontSize(data.headline, "heading"), 
                                                "font-black leading-[1.1] tracking-tight", 
                                                fontFamily,
                                                sketchStyle === "emery-minimal" ? "text-slate-900" : "text-white"
                                            )}>
                                                {sketchStyle === "emery-minimal" ? renderHighlightedText(data.headline) : renderHighlightedText(data.headline.toUpperCase())}
                                            </h2>
                                        </div>
                                    )}
                                    
                                    {data.supportingLine && (
                                        <div 
                                            style={{ transform: `translate(${positions.paragraph.x}px, ${positions.paragraph.y}px)` }} 
                                            className="relative z-30 pointer-events-auto" 
                                            onMouseDown={(e) => handleMouseDown(e, "paragraph")}
                                        >
                                            <p className={cn(
                                                sketchStyle === "quote-full" ? "text-xl font-bold italic" : getDynamicFontSize(data.supportingLine, "supporting"), 
                                                "leading-snug transition-all duration-300", 
                                                fontFamily,
                                                sketchStyle === "emery-minimal" ? "text-slate-500" : "text-white/80"
                                            )}>
                                                {sketchStyle === "quote-full" ? `"${data.supportingLine}"` : renderHighlightedText(data.supportingLine)}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Editor Refinement Controls */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-8">
                    
                    {/* Background Selector */}
                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">2. Visual Assets</label>
                            <Button variant="ghost" size="sm" onClick={handlePasteBackground} className="h-6 text-[10px] px-2">Paste External URL</Button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            {images.map((img, i) => (
                                <button
                                    key={i}
                                    onClick={() => setActiveImage(img)}
                                    className={cn(
                                        "w-20 h-20 rounded-2xl bg-cover bg-center border-4 transition-all overflow-hidden",
                                        activeImage === img ? "border-blue-600 shadow-lg scale-105" : "border-slate-50 hover:border-slate-200"
                                    )}
                                    style={{ backgroundImage: `url(${img})` }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Badge Controls */}
                    <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">3. Badge Configuration</label>
                        <div className="flex flex-wrap gap-2">
                            {["none", "left", "center", "right"].map((pos) => (
                                <button 
                                    key={pos} 
                                    onClick={() => setBadgePosition(pos as any)} 
                                    className={cn(
                                        "px-4 py-2 rounded-xl text-xs font-bold border transition-all", 
                                        badgePosition === pos ? "bg-red-50 text-red-600 border-red-200" : "bg-white text-slate-500 border-slate-200"
                                    )}
                                >
                                    {pos === "none" ? "No Badge" : pos.charAt(0).toUpperCase() + pos.slice(1) + " Aligned"}
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {["classic", "live-red", "hot-news-tag", "urgent-red", "modern-wire", "sleek-ticker"].map((style) => (
                                <button 
                                    key={style} 
                                    onClick={() => setBadgeStyle(style as any)} 
                                    className={cn(
                                        "px-3 py-1.5 text-[10px] rounded-lg border font-bold capitalize", 
                                        badgeStyle === style ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-white text-slate-400 border-slate-100"
                                    )}
                                >
                                    {style.replace(/-/g, " ")}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 pt-4 border-t border-slate-100">
                        {/* Aspect & Export */}
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">4. Aspect Ratio</label>
                                <div className="flex gap-2 p-1 bg-slate-50 rounded-xl w-fit">
                                    {RATIOS.map(r => (
                                        <button key={r.id} onClick={() => setActiveRatio(r.class)} className={cn("px-4 py-1.5 rounded-lg text-xs font-bold transition-all", activeRatio === r.class ? "bg-white shadow-sm text-slate-900" : "text-slate-500")}>
                                            {r.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <Button onClick={handleExport} className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl h-11 shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                                    <Download className="w-4 h-4 mr-2" /> Download Studio Graphic
                                </Button>
                            </div>
                        </div>

                        {/* Caption & Tags */}
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">5. AI Caption</label>
                            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 italic">
                                "{data.caption.substring(0, 200)}..."
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
