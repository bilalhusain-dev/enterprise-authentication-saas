"use client";

import React, { useRef, useState, useEffect } from "react";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import { Download, Upload, Crop, Facebook, Twitter, Instagram, Linkedin, Image as ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ManualCanvasProps {
    headingText: string;
    paragraphText: string;
    image: string | null;
    bgPosition: { x: number; y: number };
    bgSize: number;
    secondaryImage: string | null;
    secondaryImageSize: number;
    logo: string | null;
    logoWatermark: boolean;
    gradient: string;
    ratio: string;
    showSocials: boolean;
    gradientHeight: number;
    fontFamily: string;
    fontWeight: string;
    letterSpacing: string;
    textPosition: string;
    headingFontSize: number;
    paragraphFontSize: number;
    paragraphFontWeight?: string;
    textWidth: string;
    highlightStyle: string;
    highlightColor: string;
    gradientOpacity: number;
    badgePosition: "left" | "center" | "right" | "none";
    badgeStyle: "classic" | "split-ribbon" | "bars" | "live-red" | "hot-news-tag" | "breaking-ticker" | "live-pill" | "urgent-red" | "broadcast-red" | "few-minutes-ago" | "breaking-bars" | "split-solid" | "bar-stack" | "bars-reversed" | "split-ribbon-outline" | "bold-split" | "diagonal-bars" | "ticker-pro" | "headline-strip" | "live-studio" | "folded-ribbon" | "sleek-ticker" | "modern-slanted-bar" | "modern-slanted-bar-blue" | "modern-slanted-bar-dark" | "minimal-box" | "sleek-line" | "fox-alert" | "cnn-lower" | "bbc-trust" | "nyt-classic" | "modern-fade" | "glass-pill" | "cyber-glitch" | "neon-outline" | "minimal-dot" | "custom";
    customBadgeImageUrl?: string | null;
    sketchStyle?: "default" | "cinematic" | "split-bottom" | "floating-glass" | "bordered-card" | "neon-frame" | "editorial-margin" | "worldvibe-split" | "breaking-red" | "elegant-blur";
    badgeText?: string;
    badgeSize?: number;
    badgeColor?: string;
    overlayImage?: string | null;
    overlayPosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | "center";
    overlaySize?: number;
    overlayBorderColor?: string;
    overlayLiveBadge?: boolean;
    overlayLiveBadgeColor?: string;
    logoSize?: number;
    highlightTextColor?: string;
    stamps?: Array<{ id: string; emoji: string; x: number; y: number; size: number }>;
    selectedStampId?: string | null;
    onStampMove?: (id: string, x: number, y: number) => void;
    socialStyle?: "minimal-white" | "original-color" | "minimal-black" | "neon-outline" | "colorful-circles" | "colorful-squares";
    canvasBgColor?: string;
}

export default function ManualCanvas({
    headingText,
    paragraphText,
    image,
    bgPosition = { x: 0, y: 0 },
    bgSize = 100,
    secondaryImage = null,
    secondaryImageSize = 100,
    logo,
    logoWatermark = true,
    gradient = "bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent",
    ratio = "aspect-[4/5]",
    showSocials = true,
    gradientHeight = 45,
    fontFamily = "font-sans",
    fontWeight = "font-bold",
    letterSpacing = "tracking-normal",
    textPosition = "bottom",
    headingFontSize = 32,
    paragraphFontSize = 16,
    paragraphFontWeight = "font-normal",
    textWidth = "max-w-full",
    highlightStyle = "solid",
    highlightColor = "#facc15",
    gradientOpacity = 100,
    badgePosition = "none",
    badgeStyle = "classic",
    customBadgeImageUrl = null,
    sketchStyle = "default",
    badgeText,
    badgeSize = 0.8,
    badgeColor = "#dc2626",
    overlayImage,
    overlayPosition = "bottom-right",
    overlaySize = 120,
    overlayBorderColor = "#ffffff",
    overlayLiveBadge = false,
    overlayLiveBadgeColor = "#dc2626",
    logoSize = 80,
    highlightTextColor = "#000000",
    stamps = [],
    selectedStampId = null,
    onStampMove,
    socialStyle = "minimal-white",
    canvasBgColor = "#0f172a"
}: ManualCanvasProps) {
    const canvasRef = useRef<HTMLDivElement>(null);

    // Draggable States
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({
        overlay: { x: 0, y: 0 },
        logo: { x: 0, y: 0 },
        heading: { x: 0, y: 0 },
        paragraph: { x: 0, y: 0 },
        badge: { x: 0, y: 0 },
        bg: bgPosition,
        secondary: { x: 0, y: 0 },
        socials: { x: 0, y: 0 }
    });
    const [activeDrag, setActiveDrag] = useState<string | null>(null);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!activeDrag) return;

            const newX = e.clientX - dragStart.x;
            const newY = e.clientY - dragStart.y;

            if (activeDrag.startsWith("stamp-") && onStampMove) {
                onStampMove(activeDrag, newX, newY);
            } else {
                setPositions((prev) => ({
                    ...prev,
                    [activeDrag]: { x: newX, y: newY },
                }));
            }
        };
        const handleMouseUp = () => setActiveDrag(null);

        if (activeDrag) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [activeDrag, dragStart]);

    const handleMouseDown = (e: React.MouseEvent, id: string) => {
        setActiveDrag(id);
        let pos = positions[id];

        // Dynamic stamp lookup if not in local positions
        if (id.startsWith("stamp-")) {
            const stamp = stamps.find(s => s.id === id);
            pos = stamp ? { x: stamp.x, y: stamp.y } : { x: 0, y: 0 };
        } else if (!pos) {
            pos = { x: 0, y: 0 };
        }

        setDragStart({
            x: e.clientX - pos.x,
            y: e.clientY - pos.y,
        });
        e.preventDefault();
    };

    // Proxy helper for remote images to avoid CORS tainting
    const getProxiedUrl = (url: string | null) => {
        if (!url) return null;
        if (url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/')) return url;
        return `/api/proxy?url=${encodeURIComponent(url)}`;
    };

    const handleExport = async () => {
        if (!canvasRef.current) return;
        try {
            const dataUrl = await toPng(canvasRef.current, { quality: 1, pixelRatio: 2 });

            // Convert to Blob for reliable filename preservation
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.download = `POSTRA-MANUAL-${Date.now()}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export manual graphic. Please try again.");
        }
    };

    // Parses text to find parts wrapped in asterisks (e.g. "This is *highlighted*.")
    // and renders them with a yellow background block.
    const renderHighlightedText = (text: string) => {
        const parts = text.split(/(\*[^*]+\*)/g);
        return parts.map((part, index) => {
            if (part.startsWith('*') && part.endsWith('*')) {
                const innerText = part.slice(1, -1);

                if (highlightStyle === "text") {
                    return <span key={index} className="font-bold underline decoration-2 underline-offset-4" style={{ textDecorationColor: highlightColor, color: highlightTextColor }}>{innerText}</span>;
                }

                if (highlightStyle === "bold") {
                    return <span key={index} className="font-black" style={{ color: highlightTextColor }}>{innerText}</span>;
                }

                return (
                    <span
                        key={index}
                        className="inline-block px-2 py-0.5 mx-0.5 font-bold rounded-sm leading-none"
                        style={{
                            backgroundColor: highlightColor,
                            color: highlightTextColor,
                            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                        }}
                    >
                        {innerText}
                    </span>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-2.5">
            {/* Interactive Render Canvas */}
            <div className="relative group p-0 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-200 overflow-hidden">
                {/* The actual exportable HTML Node */}
                <div
                    ref={canvasRef}
                    className={cn(
                        "relative w-full overflow-hidden bg-slate-900 transition-all duration-300 ease-in-out flex flex-col justify-end",
                        ratio,
                        sketchStyle === "editorial-margin" && "p-4 sm:p-6 bg-white" // Add white margin around everything
                    )}
                >
                    {/* Background Image Layer */}
                    <div className="absolute inset-0 z-0" style={{ backgroundColor: (canvasBgColor as any) || "#0f172a" }}>
                        {image ? (
                            <div
                                className="absolute cursor-grab active:cursor-grabbing flex items-center justify-center overflow-hidden"
                                style={{ 
                                    left: '50%',
                                    top: '50%',
                                    width: `${bgSize}%`, 
                                    height: `${bgSize}%`,
                                    transform: `translate(calc(-50% + ${positions.bg.x}px), calc(-50% + ${positions.bg.y}px))`
                                }}
                                onMouseDown={(e) => handleMouseDown(e, "bg")}
                            >
                                <img src={getProxiedUrl(image) || ""} className={cn("w-full h-full object-cover pointer-events-none", sketchStyle === "bordered-card" && "border-[12px] border-white box-border")} alt="Background" draggable={false} />
                            </div>
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-slate-800">
                                <ImageIcon className="w-20 h-20 text-slate-700" />
                            </div>
                        )}
                    </div>
                    
                    {/* Secondary Draggable Image Layer */}
                    {secondaryImage && (
                        <div
                            className="absolute z-10 cursor-grab active:cursor-grabbing drop-shadow-xl"
                            style={{ 
                                left: '50%',
                                top: '50%',
                                width: `${secondaryImageSize}%`,
                                transform: `translate(calc(-50% + ${positions.secondary.x}px), calc(-50% + ${positions.secondary.y}px))`
                            }}
                            onMouseDown={(e) => handleMouseDown(e, "secondary")}
                        >
                            <img src={getProxiedUrl(secondaryImage) || ""} className="w-full h-full object-cover pointer-events-none" alt="Secondary Element" draggable={false} />
                        </div>
                    )}

                    {/* Sketch Specific Overlays */}
                    {sketchStyle === "split-bottom" && (
                        <div className="absolute bottom-0 left-0 w-full h-[35%] bg-slate-950 z-10 border-t-[8px] border-[#dc2626]" style={{ borderTopColor: badgePosition !== "none" ? badgeColor : "#dc2626" }} />
                    )}
                    {sketchStyle === "worldvibe-split" && (
                        <>
                            <div className="absolute inset-0 border-[6px] border-black z-40 pointer-events-none" />
                            <div className="absolute bottom-0 left-0 w-full h-[40%] bg-black z-10" />
                            <div className="absolute bottom-[40%] left-0 w-full h-[4px] bg-pink-500 z-20 shadow-[0_0_15px_rgba(236,72,153,1),0_0_8px_rgba(236,72,153,1)]" />
                        </>
                    )}
                    {sketchStyle === "breaking-red" && (
                        <div className="absolute bottom-0 left-0 w-full h-[40%] bg-[#dc2626] z-10 border-t-4 border-white shadow-[inset_0_5px_20px_rgba(0,0,0,0.3)]" />
                    )}
                    {sketchStyle === "elegant-blur" && (
                        <div className="absolute bottom-0 left-0 w-full h-[45%] bg-slate-950/60 backdrop-blur-2xl z-10 border-t border-white/20" />
                    )}
                    {sketchStyle === "neon-frame" && (
                        <div className="absolute inset-3 border-[4px] z-40 pointer-events-none" style={{ borderColor: badgePosition !== "none" ? badgeColor : "#d946ef", boxShadow: `0 0 30px ${badgePosition !== "none" ? badgeColor : "#d946ef"}CC, inset 0 0 30px ${badgePosition !== "none" ? badgeColor : "#d946ef"}CC` }} />
                    )}

                    {/* Gradient Overlay Layer */}
                    <div
                        className={cn("absolute inset-0 z-10 transition-all duration-500 pointer-events-none", sketchStyle === "cinematic" ? "bg-gradient-to-t from-black via-black/80 to-transparent" : gradient)}
                        style={{ 
                            opacity: sketchStyle === "cinematic" ? 1 : Math.min(gradientOpacity / 100, 1),
                            backgroundSize: sketchStyle === "cinematic" ? "100% 100%" : `100% ${gradientHeight}%`,
                            backgroundPosition: 'bottom',
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                    {gradientOpacity > 100 && sketchStyle !== "cinematic" && (
                        <div
                            className={cn("absolute inset-0 z-10 transition-all duration-500 pointer-events-none", gradient)}
                            style={{ 
                                opacity: (gradientOpacity - 100) / 100,
                                backgroundSize: `100% ${gradientHeight}%`,
                                backgroundPosition: 'bottom',
                                backgroundRepeat: 'no-repeat'
                            }}
                        />
                    )}

                    {/* User Logo */}
                    {logo && (
                        <div
                            className={cn(
                                "absolute top-6 left-6 z-30 cursor-grab active:cursor-grabbing",
                                logoWatermark ? "bg-white/10 p-2 rounded-xl backdrop-blur-[2px] drop-shadow-md" : "drop-shadow-lg"
                            )}
                            style={{ transform: `translate(${positions.logo.x}px, ${positions.logo.y}px)` }}
                            onMouseDown={(e) => handleMouseDown(e, "logo")}
                        >
                            <img
                                src={getProxiedUrl(logo) || ""}
                                alt="Brand Logo"
                                className="w-auto object-contain opacity-95 pointer-events-none transition-all"
                                style={{ height: logoSize }}
                                draggable={false}
                            />
                        </div>
                    )}

                    {/* Overlay Image (Mugshot/Element) */}
                    {overlayImage && (
                        <div
                            className={cn(
                                "absolute z-30 rounded-full shadow-xl overflow-hidden drop-shadow-2xl cursor-grab active:cursor-grabbing",
                                overlayPosition === "bottom-right" ? "bottom-8 right-8" :
                                    overlayPosition === "bottom-left" ? "bottom-8 left-8" :
                                        overlayPosition === "top-right" ? "top-8 right-8" :
                                            overlayPosition === "center" ? "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" :
                                                "top-8 left-8" // top-left
                            )}
                            style={{
                                width: overlaySize,
                                height: overlaySize,
                                borderWidth: Math.max(4, overlaySize / 30),
                                borderColor: overlayBorderColor,
                                transform: `translate(${positions.overlay.x}px, ${positions.overlay.y}px)`
                            }}
                            onMouseDown={(e: React.MouseEvent) => handleMouseDown(e, "overlay")}
                        >
                            <div className="w-full h-full bg-slate-900 pointer-events-none">
                                <img src={getProxiedUrl(overlayImage) || ""} className="w-full h-full object-cover" alt="Overlay" draggable={false} />
                            </div>
                            {overlayLiveBadge && (
                                <div
                                    className="absolute -top-3 right-0 z-40 px-2 py-0.5 rounded-sm shadow-md flex items-center gap-1.5 border border-white/20"
                                    style={{ backgroundColor: overlayLiveBadgeColor }}
                                >
                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,1)]" />
                                    <span className="text-white text-[10px] font-black tracking-widest leading-none pt-[1px] uppercase">LIVE</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Typography & Socials Layer */}
                    <div className={cn(
                        "relative z-20 flex flex-col items-center px-6 sm:px-10 pointer-events-none",
                        textWidth,
                        textPosition === "bottom" ? "mt-auto pb-0 pt-32" : "",
                        textPosition === "top" ? "mb-auto pt-24 pb-8" : "",
                        textPosition === "middle" ? "my-auto py-12" : "",
                        sketchStyle === "editorial-margin" && "px-8",
                    )}>
                        <div className={cn(
                            "w-full text-center space-y-4", 
                            textPosition === "bottom" ? "mb-2" : "mb-8",
                            sketchStyle === "floating-glass" && "bg-slate-900/40 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-white/20 shadow-2xl mb-8",
                            sketchStyle === "split-bottom" && "mb-8",
                            sketchStyle === "worldvibe-split" && "mb-6",
                            sketchStyle === "breaking-red" && "mb-8",
                            sketchStyle === "elegant-blur" && "mb-10"
                        )}>
                            {badgePosition !== "none" && (() => {
                                const bText = badgeText || "BREAKING NEWS";
                                const bWords = bText.split(" ");
                                const bWord1 = bWords[0] || "BREAKING";
                                const bWord2 = bWords.slice(1).join(" ") || "NEWS";

                                return (
                                    <div
                                        style={{
                                            transform: `translate(${positions.badge.x}px, ${positions.badge.y}px) scale(${badgeSize})`,
                                            transformOrigin: badgePosition === "center" ? "bottom center" : badgePosition === "right" ? "bottom right" : "bottom left"
                                        }}
                                        className={cn(
                                            "flex w-full pointer-events-auto cursor-grab active:cursor-grabbing relative z-30",
                                            badgePosition === "left" ? "justify-start" :
                                                badgePosition === "center" ? "justify-center" : "justify-end"
                                        )}
                                        onMouseDown={(e) => handleMouseDown(e, "badge")}
                                    >
                                        {badgeStyle === "classic" && (
                                            <span className="text-white text-[10px] sm:text-xs font-black uppercase tracking-widest px-2.5 py-1 rounded-sm shadow-md pointer-events-none" style={{ backgroundColor: badgeColor }}>
                                                {bText}
                                            </span>
                                        )}
                                        {badgeStyle === "split-ribbon" && (
                                            <div className="flex shadow-md rounded-sm overflow-hidden pointer-events-none">
                                                <div className="text-white px-2.5 py-0.75 text-[10px] sm:text-xs font-black uppercase tracking-widest relative" style={{ backgroundColor: badgeColor }}>
                                                    {bWord1}
                                                    <div className="absolute -right-2 top-0 bottom-0 w-4 transform skew-x-[20deg] z-10" style={{ backgroundColor: badgeColor }} />
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-slate-900 text-white px-4 py-1 text-xs sm:text-sm font-black uppercase tracking-widest relative pl-4">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "bars" && (
                                            <div className="flex flex-col gap-0.5 pointer-events-none">
                                                <div className="text-white px-4 py-0.5 text-[10px] sm:text-xs font-black uppercase tracking-widest w-fit self-start ml-2 relative z-10 shadow-sm" style={{ backgroundColor: badgeColor }}>
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-slate-900 text-white px-5 py-0.5 text-xs sm:text-sm font-black uppercase tracking-widest w-fit shadow-md -mt-1">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "live-red" && (
                                            <div className="flex items-center gap-1.5 text-white px-3 py-1 sm:py-1.5 rounded-sm shadow-md pointer-events-none border border-white/20" style={{ backgroundColor: badgeColor }}>
                                                <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)]" />
                                                <span className="text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-sm">{bText}</span>
                                            </div>
                                        )}
                                        {badgeStyle === "hot-news-tag" && (
                                            <div className="flex shadow-lg rounded-sm overflow-hidden pointer-events-none scale-105 origin-left">
                                                <div className="text-white px-3 py-1 text-xs sm:text-sm font-black uppercase tracking-wide relative" style={{ backgroundColor: badgeColor }}>
                                                    {bWord1}
                                                    <div className="absolute -right-2 top-0 bottom-0 w-4 transform skew-x-[15deg] z-10" style={{ backgroundColor: badgeColor }} />
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-white/95 text-slate-900 px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider relative pl-3">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "breaking-ticker" && (
                                            <div className="relative flex items-center bg-slate-900 border-l-4 shadow-md overflow-hidden rounded-r-sm pointer-events-none group" style={{ borderColor: badgeColor }}>
                                                <div className="text-white px-3 py-1.5 text-xs sm:text-[13px] font-black uppercase tracking-widest z-10" style={{ backgroundColor: badgeColor }}>
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="px-4 text-white text-[10px] sm:text-xs font-semibold uppercase tracking-widest relative break-keep whitespace-nowrap">
                                                        <span className="opacity-90">{bWord2}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "live-pill" && (
                                            <div className="flex items-center gap-2 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full shadow-lg pointer-events-none border border-white/20" style={{ backgroundColor: badgeColor }}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="animate-pulse">
                                                    <path d="M12 12h.01" /><path d="M8.5 8.5a5 5 0 0 0 0 7" /><path d="M15.5 15.5a5 5 0 0 0 0-7" /><path d="M5 5a10 10 0 0 0 0 14" /><path d="M19 19a10 10 0 0 0 0-14" />
                                                </svg>
                                                <span className="text-xs sm:text-sm font-bold tracking-wider drop-shadow-sm leading-none pt-0.5 uppercase">{bText}</span>
                                            </div>
                                        )}
                                        {badgeStyle === "urgent-red" && (
                                            <div className="text-white border-l-4 border-white shadow-xl pointer-events-none flex items-center" style={{ backgroundColor: badgeColor }}>
                                                <div className="px-4 py-1.5 sm:py-2 text-xs sm:text-[13px] font-black uppercase tracking-widest leading-none">
                                                    {bText}
                                                </div>
                                            </div>
                                        )}

                                        {badgeStyle === "broadcast-red" && (
                                            <div className="text-white px-5 py-2 font-black uppercase tracking-widest pointer-events-none shadow-lg border-l-4 border-white" style={{ backgroundColor: badgeColor }}>
                                                <span className="text-sm sm:text-base leading-none block pt-0.5">{bText}</span>
                                            </div>
                                        )}

                                        {badgeStyle === "few-minutes-ago" && (
                                            <div className="flex items-center gap-1.5 border-b-2 bg-white/95 text-slate-800 px-3 py-1 shadow-sm pointer-events-none" style={{ borderColor: badgeColor }}>
                                                <span className="text-[10px] sm:text-[11px] font-black tracking-widest uppercase leading-none pt-[2px]">{bText}</span>
                                                <div className="w-1.5 h-1.5 rounded-full mb-[1px]" style={{ backgroundColor: badgeColor }} />
                                            </div>
                                        )}
                                        {badgeStyle === "breaking-bars" && (
                                            <div className="flex items-center shadow-lg pointer-events-none rounded-r-lg overflow-hidden border-l-[6px]" style={{ borderColor: badgeColor }}>
                                                <div className="relative overflow-hidden w-2.5 h-[34px] sm:h-[42px] bg-slate-100 flex items-center justify-center shrink-0">
                                                    <div className="absolute inset-x-0 h-full bg-gradient-to-t from-transparent via-white to-transparent opacity-80 animate-pulse" />
                                                    <div className="w-0.5 h-2/3" style={{ backgroundColor: badgeColor }} />
                                                </div>
                                                <div className="text-white px-5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-[13px] font-black uppercase tracking-widest" style={{ backgroundColor: badgeColor }}>
                                                    {bText}
                                                </div>
                                            </div>
                                        )}
                                        {badgeStyle === "split-solid" && (
                                            <div className="flex shadow-md rounded-sm overflow-hidden pointer-events-none font-sans">
                                                <div style={{ backgroundColor: badgeColor, color: badgeColor === '#facc15' || badgeColor === '#ffffff' ? '#000' : '#fff' }} className="px-3 py-1 text-xs sm:text-sm font-black uppercase tracking-wide">
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-slate-900 text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "bar-stack" && (
                                            <div className="flex flex-col items-start gap-0.5 pointer-events-none drop-shadow-md">
                                                <div style={{ backgroundColor: badgeColor, color: badgeColor === '#facc15' || badgeColor === '#ffffff' ? '#000' : '#fff' }} className="px-3 py-1 text-[10px] sm:text-[11px] font-black uppercase tracking-widest w-fit rounded-t-sm shadow-[0_4px_12px_rgba(0,0,0,0.15)] flex items-center gap-1.5 relative border border-white/20">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-[pulse_2s_infinite]" />
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-gradient-to-r from-slate-900 to-black text-white px-4 py-1.5 text-sm sm:text-base font-black uppercase tracking-widest w-fit shadow-xl border-t border-white/10 relative z-10 skew-x-[-4deg]">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {badgeStyle === "bars-reversed" && (
                                            <div className="flex flex-col gap-0 pointer-events-none shadow-md">
                                                {bWord2 && (
                                                    <div className="bg-white text-slate-900 px-4 py-0.5 text-xs sm:text-sm font-black uppercase tracking-widest w-fit -mb-1 z-10 border-b-2" style={{ borderColor: badgeColor }}>
                                                        {bWord2}
                                                    </div>
                                                )}
                                                <div style={{ backgroundColor: badgeColor, color: badgeColor === '#facc15' || badgeColor === '#ffffff' ? '#000' : '#fff' }} className="px-3 py-1.5 text-sm sm:text-base font-black uppercase tracking-widest w-fit">
                                                    {bWord1}
                                                </div>
                                            </div>
                                        )}
                                        {badgeStyle === "split-ribbon-outline" && (
                                            <div className="flex shadow-lg rounded-sm overflow-hidden pointer-events-none border border-slate-700 backdrop-blur-sm bg-slate-900/40">
                                                <div style={{ backgroundColor: badgeColor, color: badgeColor === '#facc15' || badgeColor === '#ffffff' ? '#000' : '#fff' }} className="px-3 py-1 text-xs sm:text-sm font-black uppercase tracking-widest">
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="text-white px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider border-l border-white/20">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "bold-split" && (
                                            <div className="flex bg-slate-900 border-2 items-stretch shadow-xl pointer-events-none" style={{ borderColor: badgeColor }}>
                                                <div style={{ backgroundColor: badgeColor, color: badgeColor === '#facc15' || badgeColor === '#ffffff' ? '#000' : '#fff' }} className="px-3 py-1 text-xs sm:text-sm font-black uppercase tracking-widest flex items-center">
                                                    {bWord1}
                                                </div>
                                                {bWord2 && (
                                                    <div className="text-white px-4 py-1 text-xs sm:text-sm font-bold uppercase tracking-wider flex items-center">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {/* --- NEW PROFESSIONAL BADGE STYLES --- */}
                                        {badgeStyle === "diagonal-bars" && (
                                            <div className="flex items-center -skew-x-[24deg] shadow-[0_8px_30px_rgb(0,0,0,0.5)] pointer-events-none overflow-hidden scale-105">
                                                <div style={{ backgroundColor: badgeColor }} className="px-4 py-2 flex items-center h-full relative border-r-4 border-slate-900">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent" />
                                                    <span style={{ color: badgeColor === '#ffffff' || badgeColor === '#facc15' ? '#000' : '#fff' }} className="skew-x-[24deg] font-black uppercase tracking-widest text-xs sm:text-[13px] relative z-10 pt-0.5">
                                                        {bWord1}
                                                    </span>
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-slate-900 text-white px-5 py-2 flex items-center h-full relative">
                                                        <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-bl from-white/10 to-transparent skew-x-[-24deg]" />
                                                        <span className="skew-x-[24deg] font-black uppercase tracking-widest text-xs sm:text-[13px] text-slate-100 pt-0.5">
                                                            {bWord2}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "ticker-pro" && (
                                            <div className="flex items-stretch pointer-events-none shadow-lg">
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 text-white" style={{ backgroundColor: badgeColor }}>
                                                    <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_6px_rgba(255,255,255,0.8)]" />
                                                    <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">{bWord1}</span>
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-white text-slate-900 px-4 py-1.5 text-xs sm:text-sm font-bold uppercase tracking-wide flex items-center">
                                                        {bWord2}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        {badgeStyle === "headline-strip" && (
                                            <div className="flex items-stretch pointer-events-none shadow-lg w-full">
                                                <div className="w-1.5 shrink-0" style={{ backgroundColor: badgeColor }} />
                                                <div className="bg-slate-900/95 backdrop-blur-sm flex-1 flex items-center px-4 py-2 gap-3">
                                                    <span className="text-xs sm:text-sm font-black uppercase tracking-widest" style={{ color: badgeColor }}>{bWord1}</span>
                                                    {bWord2 && (
                                                        <>
                                                            <div className="w-px h-4 bg-white/30" />
                                                            <span className="text-white/90 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">{bWord2}</span>
                                                        </>
                                                    )}
                                                </div>
                                                <div className="w-1.5 shrink-0" style={{ backgroundColor: badgeColor }} />
                                            </div>
                                        )}
                                        {badgeStyle === "live-studio" && (
                                            <div className="flex items-center pointer-events-none overflow-hidden rounded-md shadow-xl border border-white/10">
                                                <div className="bg-red-600 px-3 py-1.5 flex items-center gap-2">
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
                                                    <span className="text-white font-black text-xs uppercase tracking-tighter">LIVE</span>
                                                </div>
                                                <div className="bg-slate-900/90 backdrop-blur-md px-4 py-1.5 flex items-center min-w-[80px]">
                                                    <span className="text-white/90 font-bold text-xs uppercase tracking-widest truncate max-w-[150px]">
                                                        {badgeText}
                                                    </span>
                                                </div>
                                                <div className="bg-white/10 px-2 py-1.5 h-full flex items-center">
                                                    <div className="flex gap-0.5">
                                                        <div className="w-0.5 h-3 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                                                        <div className="w-0.5 h-4 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                                                        <div className="w-0.5 h-2 bg-red-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                        {badgeStyle === "folded-ribbon" && (
                                            <div className="relative pointer-events-none drop-shadow-xl h-10 sm:h-12 flex items-center">
                                                {/* Left folded part */}
                                                <div className="absolute -left-3 bottom-[-6px] w-6 h-full bg-blue-900 skew-y-[20deg] z-0" style={{ backgroundColor: `color-mix(in srgb, ${badgeColor} 70%, black)` }} />
                                                <div className="relative bg-[#1e40af] px-6 py-2 shadow-lg z-10" style={{ backgroundColor: badgeColor }}>
                                                    <span className="text-white font-black italic uppercase tracking-wider text-sm sm:text-lg">
                                                        {bWord1}
                                                    </span>
                                                </div>
                                                <div className="relative bg-white px-6 py-2 shadow-lg z-10 border-y-2 border-slate-100 h-full flex items-center">
                                                    <span className="text-slate-900 font-black uppercase tracking-tight text-sm sm:text-lg">
                                                        {bWord2}
                                                    </span>
                                                </div>
                                                {/* Right triangle tip */}
                                                <div className="absolute -right-3 top-0 w-3 h-full bg-white [clip-path:polygon(0_0,100%_50%,0_100%)] z-10" />
                                            </div>
                                        )}
                                        {badgeStyle === "sleek-ticker" && (
                                            <div className="flex items-center pointer-events-none shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                                                <div className="flex items-center gap-2 bg-[#dc2626] px-5 h-10 sm:h-12 border-l-4 border-white" style={{ backgroundColor: badgeColor }}>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-white opacity-80" />
                                                    <span className="text-white font-black italic uppercase tracking-tighter text-sm sm:text-lg pt-0.5">
                                                        {bWord1}
                                                    </span>
                                                </div>
                                                <div className="flex items-center px-6 h-10 sm:h-12 bg-slate-900/95 backdrop-blur-md relative overflow-hidden flex-1 min-w-[120px]">
                                                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                                                    <span className="text-white font-bold uppercase tracking-[0.2em] text-[11px] sm:text-xs">
                                                        {bWord2}
                                                    </span>
                                                    <div className="absolute bottom-0 right-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                                                </div>
                                                <div className="w-1.5 h-10 sm:h-12" style={{ backgroundColor: badgeColor }} />
                                            </div>
                                        )}
                                        {badgeStyle === "modern-slanted-bar" && (
                                            <div className="flex items-center pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                                <div className="relative bg-[#1e40af] px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-l-8 border-white mr-2" style={{ backgroundColor: badgeColor }}>
                                                    <span className="skew-x-[20deg] text-white font-black italic uppercase tracking-tighter text-sm sm:text-xl pt-0.5">
                                                        {bWord1}
                                                    </span>
                                                    <div className="absolute top-1 left-4 w-6 h-[1px] bg-white/40 skew-x-[20deg]" />
                                                    <div className="absolute bottom-1 right-4 w-6 h-[1px] bg-white/40 skew-x-[20deg]" />
                                                </div>
                                                <div className="relative bg-white px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-r-8 border-[#dc2626]" style={{ borderRightColor: `color-mix(in srgb, ${badgeColor} 80%, white)` }}>
                                                    <span className="skew-x-[20deg] text-slate-900 font-black uppercase tracking-tight text-sm sm:text-xl pt-0.5">
                                                        {bWord2}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 ml-3">
                                                    <div className="w-8 h-[2px] bg-white/30 rounded-full" />
                                                    <div className="w-12 h-[2px] bg-white/50 rounded-full" />
                                                    <div className="w-6 h-[2px] bg-white/30 rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                        {badgeStyle === "modern-slanted-bar-blue" && (
                                            <div className="flex items-center pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                                <div className="relative bg-blue-900 px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-l-8 border-cyan-400 mr-2">
                                                    <span className="skew-x-[20deg] text-white font-black italic uppercase tracking-tighter text-sm sm:text-xl pt-0.5">
                                                        {bWord1}
                                                    </span>
                                                    <div className="absolute top-1 left-4 w-6 h-[1px] bg-cyan-400/40 skew-x-[20deg]" />
                                                </div>
                                                <div className="relative bg-blue-600 px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-r-8 border-white">
                                                    <span className="skew-x-[20deg] text-white font-black uppercase tracking-tight text-sm sm:text-xl pt-0.5">
                                                        {bWord2}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 ml-3">
                                                    <div className="w-8 h-[2px] bg-blue-400/50 rounded-full" />
                                                    <div className="w-4 h-[2px] bg-blue-400/50 rounded-full" />
                                                </div>
                                            </div>
                                        )}
                                        {badgeStyle === "modern-slanted-bar-dark" && (
                                            <div className="flex items-center pointer-events-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.5)]">
                                                <div className="relative bg-slate-950 px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-l-8 border-yellow-500 mr-2">
                                                    <span className="skew-x-[20deg] text-yellow-500 font-black italic uppercase tracking-tighter text-sm sm:text-xl pt-0.5">
                                                        {bWord1}
                                                    </span>
                                                </div>
                                                <div className="relative bg-slate-800 px-8 h-10 sm:h-12 flex items-center justify-center -skew-x-[20deg] border-r-8 border-slate-950">
                                                    <span className="skew-x-[20deg] text-white font-black uppercase tracking-tight text-sm sm:text-xl pt-0.5">
                                                        {bWord2}
                                                    </span>
                                                </div>
                                                <div className="flex gap-1 ml-3">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-75" />
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse delay-150" />
                                                </div>
                                            </div>
                                        )}

                                        {/* NEW PREMIUM MINIMAL/BROADCAST STYLES */}
                                        
                                        {badgeStyle === "minimal-box" && (
                                            <div className="bg-white px-4 py-1.5 shadow-lg pointer-events-none font-sans">
                                                <span className="text-black text-[11px] sm:text-[13px] font-black uppercase tracking-widest block leading-none">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "sleek-line" && (
                                            <div className="flex flex-col items-start pointer-events-none">
                                                <div className="w-8 h-1 mb-1.5" style={{ backgroundColor: badgeColor }} />
                                                <span className="text-white text-xs sm:text-sm font-black uppercase tracking-widest drop-shadow-md">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "fox-alert" && (
                                            <div className="flex items-center pointer-events-none drop-shadow-xl font-sans">
                                                <div className="px-4 py-1.5 text-[10px] sm:text-xs font-black uppercase tracking-widest text-white relative z-10" style={{ backgroundColor: badgeColor }}>
                                                    {bText}
                                                </div>
                                                <div className="h-[2px] w-16 sm:w-24 bg-white/80 -ml-1 z-0" />
                                            </div>
                                        )}

                                        {badgeStyle === "cnn-lower" && (
                                            <div className="flex items-stretch pointer-events-none shadow-xl border-t border-white/20">
                                                <div className="px-5 py-2 flex items-center justify-center text-white" style={{ backgroundColor: badgeColor }}>
                                                    <span className="text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none pt-[1px]">
                                                        {bWord1}
                                                    </span>
                                                </div>
                                                {bWord2 && (
                                                    <div className="bg-white px-5 py-2 flex items-center justify-center">
                                                        <span className="text-black text-[11px] sm:text-[13px] font-bold uppercase tracking-wider leading-none pt-[1px]">
                                                            {bWord2}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        {badgeStyle === "bbc-trust" && (
                                            <div className="flex items-center gap-2 pointer-events-none drop-shadow-md bg-slate-900/90 px-3 py-1.5 rounded-sm">
                                                <div className="w-2 h-2 rounded-none animate-pulse" style={{ backgroundColor: badgeColor }} />
                                                <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-[0.2em] leading-none pt-[1px]">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "nyt-classic" && (
                                            <div className="pointer-events-none border-y-2 py-1 px-2 font-serif" style={{ borderColor: badgeColor }}>
                                                <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest drop-shadow-md">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "modern-fade" && (
                                            <div className="pointer-events-none flex">
                                                <div className="px-5 py-2 flex items-center" style={{ background: `linear-gradient(90deg, ${badgeColor} 0%, transparent 100%)` }}>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-white mr-2 shadow-[0_0_5px_white]" />
                                                    <span className="text-white text-[11px] sm:text-[13px] font-black uppercase tracking-widest drop-shadow-md leading-none">
                                                        {bText}
                                                    </span>
                                                </div>
                                            </div>
                                        )}

                                        {badgeStyle === "glass-pill" && (
                                            <div className="pointer-events-none px-5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/30 shadow-[0_4px_30px_rgba(0,0,0,0.1)] flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: badgeColor }} />
                                                <span className="text-white text-[10px] sm:text-xs font-bold uppercase tracking-widest leading-none pt-[1px]">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "cyber-glitch" && (
                                            <div className="pointer-events-none relative font-sans">
                                                <div className="absolute top-[1px] left-[2px] px-3 py-1 bg-cyan-500 text-black text-xs font-black uppercase tracking-widest opacity-70 mix-blend-screen">{bText}</div>
                                                <div className="absolute top-[-1px] left-[-2px] px-3 py-1 bg-red-500 text-white text-xs font-black uppercase tracking-widest opacity-70 mix-blend-screen">{bText}</div>
                                                <div className="relative px-3 py-1 text-black text-xs font-black uppercase tracking-widest" style={{ backgroundColor: badgeColor }}>
                                                    {bText}
                                                </div>
                                            </div>
                                        )}

                                        {badgeStyle === "neon-outline" && (
                                            <div className="pointer-events-none px-4 py-1.5 border-2 rounded-md bg-black/40 backdrop-blur-sm" style={{ borderColor: badgeColor, boxShadow: `0 0 10px ${badgeColor}, inset 0 0 10px ${badgeColor}` }}>
                                                <span className="text-white text-[11px] sm:text-[13px] font-black uppercase tracking-widest leading-none" style={{ textShadow: `0 0 8px ${badgeColor}` }}>
                                                    {bText}
                                                </span>
                                            </div>
                                        )}

                                        {badgeStyle === "minimal-dot" && (
                                            <div className="flex items-center gap-2 pointer-events-none drop-shadow-lg">
                                                <div className="w-2 h-2 rounded-full ring-2 ring-white/50" style={{ backgroundColor: badgeColor }} />
                                                <span className="text-white text-xs sm:text-sm font-bold uppercase tracking-widest">
                                                    {bText}
                                                </span>
                                            </div>
                                        )}
                                        {badgeStyle === "custom" && customBadgeImageUrl && (
                                            <div className="pointer-events-none">
                                                <img
                                                    src={customBadgeImageUrl}
                                                    alt="Custom Badge"
                                                    className="max-h-[80px] w-auto object-contain drop-shadow-xl"
                                                />
                                            </div>
                                        )}
                                    </div>
                                )
                            })()}
                            <div
                                style={{ transform: `translate(${positions.heading.x}px, ${positions.heading.y}px)` }}
                                className="cursor-grab active:cursor-grabbing w-full relative z-20 pointer-events-auto"
                                onMouseDown={(e) => handleMouseDown(e, "heading")}
                            >
                                <h2
                                    className={cn(
                                        "text-white leading-tight tracking-tight [text-shadow:_0_4px_16px_rgb(0_0_0_/_60%)] whitespace-pre-wrap",
                                        fontFamily,
                                        fontWeight,
                                        letterSpacing
                                    )}
                                    style={{ fontSize: `${headingFontSize}px` }}
                                >
                                    {renderHighlightedText(headingText || "Enter your heading on the left.")}
                                </h2>
                            </div>

                            {paragraphText && (
                                <div
                                    style={{ transform: `translate(${positions.paragraph.x}px, ${positions.paragraph.y}px)` }}
                                    className="cursor-grab active:cursor-grabbing w-full mt-4 relative z-20 pointer-events-auto"
                                    onMouseDown={(e) => handleMouseDown(e, "paragraph")}
                                >
                                    <p
                                        className={cn(
                                            "text-white/90 leading-relaxed [text-shadow:_0_2px_8px_rgb(0_0_0_/_60%)] whitespace-pre-wrap",
                                            fontFamily,
                                            paragraphFontWeight,
                                            letterSpacing
                                        )}
                                        style={{ fontSize: `${paragraphFontSize}px` }}
                                    >
                                        {renderHighlightedText(paragraphText)}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Draggable Stamps */}
                        {stamps.map(stamp => (
                            <div
                                key={stamp.id}
                                style={{ transform: `translate(${stamp.x}px, ${stamp.y}px)`, fontSize: `${stamp.size}px` }}
                                className={cn(
                                    "absolute top-0 left-0 cursor-grab active:cursor-grabbing leading-none select-none z-30 filter transition-all",
                                    "drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]",
                                    selectedStampId === stamp.id ? "ring-2 ring-blue-500 rounded-lg p-1 scale-110 z-40 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.5)]" : ""
                                )}
                                onMouseDown={(e) => handleMouseDown(e, stamp.id)}
                            >
                                {stamp.emoji}
                            </div>
                        ))}

                        {showSocials && (
                            <div 
                                className="flex items-center gap-6 mb-2 mt-4 pt-6 border-t border-white/10 w-3/4 justify-center pointer-events-auto cursor-grab active:cursor-grabbing"
                                style={{ transform: `translate(${positions.socials.x}px, ${positions.socials.y}px)` }}
                                onMouseDown={(e) => handleMouseDown(e, "socials")}
                            >
                                {socialStyle === "minimal-white" && (
                                    <>
                                        <Facebook className="w-6 h-6 text-slate-300/80 drop-shadow-sm" fill="currentColor" stroke="none" />
                                        <Twitter className="w-6 h-6 text-slate-300/80 drop-shadow-sm" fill="currentColor" stroke="none" />
                                        <Instagram className="w-6 h-6 text-slate-300/80 drop-shadow-sm" />
                                        <Linkedin className="w-6 h-6 text-slate-300/80 drop-shadow-sm" fill="currentColor" stroke="none" />
                                    </>
                                )}
                                {socialStyle === "original-color" && (
                                    <>
                                        <Facebook className="w-6 h-6 text-[#1877F2] drop-shadow-sm" fill="currentColor" stroke="none" />
                                        <Twitter className="w-6 h-6 text-[#1DA1F2] drop-shadow-sm" fill="currentColor" stroke="none" />
                                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-sm">
                                            <Instagram className="w-4 h-4 text-white" strokeWidth={2.5} />
                                        </div>
                                        <Linkedin className="w-6 h-6 text-[#0A66C2] drop-shadow-sm" fill="currentColor" stroke="none" />
                                    </>
                                )}
                                {socialStyle === "minimal-black" && (
                                    <div className="flex items-center gap-6 bg-white/90 backdrop-blur-sm px-6 py-2.5 rounded-full shadow-lg">
                                        <Facebook className="w-5 h-5 text-black" fill="currentColor" stroke="none" />
                                        <Twitter className="w-5 h-5 text-black" fill="currentColor" stroke="none" />
                                        <Instagram className="w-5 h-5 text-black" />
                                        <Linkedin className="w-5 h-5 text-black" fill="currentColor" stroke="none" />
                                    </div>
                                )}
                                {socialStyle === "neon-outline" && (
                                    <>
                                        <Facebook className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen" />
                                        <Twitter className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen" />
                                        <Instagram className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen" />
                                        <Linkedin className="w-6 h-6 text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)] mix-blend-screen" />
                                    </>
                                )}
                                {socialStyle === "colorful-circles" && (
                                    <>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1877F2] shadow-md hover:scale-105 transition-transform">
                                            <Facebook className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#1DA1F2] shadow-md hover:scale-105 transition-transform">
                                            <Twitter className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-md hover:scale-105 transition-transform">
                                            <Instagram className="w-4 h-4 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="w-8 h-8 rounded-full flex items-center justify-center bg-[#0A66C2] shadow-md hover:scale-105 transition-transform">
                                            <Linkedin className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                    </>
                                )}
                                {socialStyle === "colorful-squares" && (
                                    <>
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[#1877F2] shadow-md hover:scale-105 transition-transform">
                                            <Facebook className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[#1DA1F2] shadow-md hover:scale-105 transition-transform">
                                            <Twitter className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] shadow-md hover:scale-105 transition-transform">
                                            <Instagram className="w-4 h-4 text-white" strokeWidth={2.5} />
                                        </div>
                                        <div className="w-8 h-8 rounded-md flex items-center justify-center bg-[#0A66C2] shadow-md hover:scale-105 transition-transform">
                                            <Linkedin className="w-4 h-4 text-white" fill="currentColor" stroke="none" />
                                        </div>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                </div >
            </div >

            <button
                data-export-ignore="true"
                onClick={handleExport}
                className="w-full group relative overflow-hidden flex items-center justify-center gap-2.5 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-blue-700 hover:via-blue-600 hover:to-blue-700 text-white font-semibold shadow-lg shadow-slate-900/30 hover:shadow-blue-600/30 active:scale-[0.98] transition-all duration-300 py-3 text-sm rounded-lg border border-white/5"
            >
                <Download className="w-4 h-4 group-hover:animate-bounce transition-transform" />
                <span>Download Graphic</span>
                <span className="text-[10px] opacity-60 ml-1 font-normal">PNG · 2x</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            </button>
        </div >
    );
}
