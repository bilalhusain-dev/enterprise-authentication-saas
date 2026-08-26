"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, Image as ImageIcon, CheckCircle2, LayoutTemplate, Clipboard, Trash2, Download, Search } from "lucide-react";
import { toPng } from "html-to-image";
import ManualCanvas from "@/components/PostCanvas/ManualCanvas";
import { cn } from "@/lib/utils";

const GRADIENTS = [
    { id: "preset-1", name: "Black & Transparent", class: "bg-gradient-preset-1" },
    { id: "preset-2", name: "Red & Transparent", class: "bg-gradient-preset-2" },
    { id: "preset-3", name: "Blue & Transparent", class: "bg-gradient-preset-3" },
    { id: "preset-4", name: "Green & Transparent", class: "bg-gradient-preset-4" },
    { id: "preset-5", name: "Purple & Transparent", class: "bg-gradient-preset-5" },
    { id: "preset-6", name: "Pink & Transparent", class: "bg-gradient-preset-6" },
    { id: "preset-7", name: "Orange & Transparent", class: "bg-gradient-preset-7" },
    { id: "preset-8", name: "Teal & Transparent", class: "bg-gradient-preset-8" },
    { id: "preset-9", name: "Cyan & Transparent", class: "bg-gradient-preset-9" },
    { id: "preset-10", name: "Brown & Transparent", class: "bg-gradient-preset-10" },
    { id: "preset-21", name: "Yellow & Transparent", class: "bg-gradient-preset-21" },
    { id: "preset-22", name: "Lime & Transparent", class: "bg-gradient-preset-22" },
    { id: "preset-23", name: "Cyber Neon & Transparent", class: "bg-gradient-preset-23" },
    { id: "preset-24", name: "Blood Moon & Transparent", class: "bg-gradient-preset-24" },
    { id: "preset-25", name: "Deep Ocean & Transparent", class: "bg-gradient-preset-25" },
    { id: "preset-26", name: "Midnight Gold & Transparent", class: "bg-gradient-preset-26" },
    { id: "preset-27", name: "Retro Peach & Transparent", class: "bg-gradient-preset-27" },
    { id: "preset-28", name: "Hot Lava & Transparent", class: "bg-gradient-preset-28" },
    { id: "preset-29", name: "White & Transparent", class: "bg-gradient-preset-29" },
];

const HIGH_GRADIENTS = [
    { id: "preset-11", name: "High Black", class: "bg-gradient-preset-11" },
    { id: "preset-12", name: "High Red", class: "bg-gradient-preset-12" },
    { id: "preset-13", name: "High Blue", class: "bg-gradient-preset-13" },
    { id: "preset-14", name: "High Green", class: "bg-gradient-preset-14" },
    { id: "preset-15", name: "High Purple", class: "bg-gradient-preset-15" },
    { id: "preset-16", name: "High Pink", class: "bg-gradient-preset-16" },
    { id: "preset-17", name: "High Orange", class: "bg-gradient-preset-17" },
    { id: "preset-18", name: "High Teal", class: "bg-gradient-preset-18" },
    { id: "preset-19", name: "High Cyan", class: "bg-gradient-preset-19" },
    { id: "preset-20", name: "High Brown", class: "bg-gradient-preset-20" },
    { id: "preset-31", name: "High Yellow", class: "bg-gradient-preset-31" },
    { id: "preset-32", name: "High Lime", class: "bg-gradient-preset-32" },
    { id: "preset-33", name: "High Cyber Neon", class: "bg-gradient-preset-33" },
    { id: "preset-34", name: "High Blood Moon", class: "bg-gradient-preset-34" },
    { id: "preset-35", name: "High Deep Ocean", class: "bg-gradient-preset-35" },
    { id: "preset-36", name: "High Midnight Gold", class: "bg-gradient-preset-36" },
    { id: "preset-37", name: "High Retro Peach", class: "bg-gradient-preset-37" },
    { id: "preset-38", name: "High Hot Lava", class: "bg-gradient-preset-38" },
    { id: "preset-39", name: "High White", class: "bg-gradient-preset-39" },
];

const FONTS = [
    { id: "clean", name: "Modern Clean", class: "font-sans" },
    { id: "condensed", name: "Oswald Bold", class: "font-news-condensed" },
    { id: "serif", name: "Playfair Display", class: "font-news-serif" },
    { id: "outfit", name: "Outfit Modern", class: "font-outfit" },
    { id: "poppins", name: "Poppins", class: "font-poppins" },
    { id: "montserrat", name: "Montserrat", class: "font-montserrat" },
    { id: "bebas", name: "Bebas Neue", class: "font-bebas" },
    { id: "space", name: "Space Grotesk", class: "font-space-grotesk" },
    { id: "crimson", name: "Crimson Pro", class: "font-crimson-pro" },
    { id: "jakarta", name: "Plus Jakarta", class: "font-jakarta" },
    { id: "baskerville", name: "Libre Baskerville", class: "font-libre-baskerville" },
    { id: "barlow", name: "Barlow Condensed", class: "font-barlow-condensed" },
];

const FONT_WEIGHTS = [
    { id: "normal", label: "Normal", class: "font-normal" },
    { id: "semibold", label: "Semibold", class: "font-semibold" },
    { id: "bold", label: "Bold", class: "font-bold" },
    { id: "extrabold", label: "Extra Bold", class: "font-extrabold" },
    { id: "black", label: "Black", class: "font-black" },
];

const TRACKING_SIZES = [
    { id: "tight", label: "Tight", class: "tracking-tight" },
    { id: "normal", label: "Normal", class: "tracking-normal" },
    { id: "wide", label: "Wide", class: "tracking-wide" },
];

const POSITIONS = [
    { id: "top", label: "Top Alignment" },
    { id: "middle", label: "Middle Center" },
    { id: "bottom", label: "Bottom Classic" },
];



const TEXT_WIDTHS = [
    { id: "full", label: "Full Width", class: "w-full max-w-full" },
    { id: "wide", label: "Wide Edge", class: "w-11/12 max-w-[95%]" },
    { id: "compact", label: "Compact Center", class: "w-4/5 max-w-[80%]" },
];

const ASPECT_RATIOS = [
    { id: "portrait", label: "Portrait 4:5", class: "aspect-[4/5] max-w-[450px]" },
    { id: "square", label: "Instagram 1:1", class: "aspect-square max-w-[450px]" },
    { id: "story", label: "TikTok 9:16", class: "aspect-[9/16] max-w-[324px]" },
    { id: "landscape", label: "YouTube 16:9", class: "aspect-video max-w-[576px]" },
];

const HIGHLIGHT_COLORS = [
    { id: "yellow", name: "News Yellow", class: "bg-yellow-400", hex: "#facc15", text: "#000000" },
    { id: "red", name: "Breaking Red", class: "bg-red-600", hex: "#dc2626", text: "#ffffff" },
    { id: "blue", name: "Trust Blue", class: "bg-blue-600", hex: "#2563eb", text: "#ffffff" },
    { id: "green", name: "Success Green", class: "bg-green-600", hex: "#16a34a", text: "#ffffff" },
    { id: "orange", name: "Alert Orange", class: "bg-orange-500", hex: "#f97316", text: "#ffffff" },
    { id: "purple", name: "Elite Purple", class: "bg-purple-600", hex: "#9333ea", text: "#ffffff" },
    { id: "pink", name: "Modern Pink", class: "bg-pink-500", hex: "#ec4899", text: "#ffffff" },
    { id: "cyan", name: "Cyber Cyan", class: "bg-cyan-500", hex: "#06b6d4", text: "#000000" },
    { id: "amber", name: "Warm Amber", class: "bg-amber-500", hex: "#f59e0b", text: "#000000" },
    { id: "black", name: "Invert Black", class: "bg-slate-900", hex: "#0f172a", text: "#ffffff" },
    { id: "white", name: "Clean White", class: "bg-white", hex: "#ffffff", text: "#000000" },
    { id: "lime", name: "Luminous Lime", class: "bg-lime-400", hex: "#a3e635", text: "#000000" },
    { id: "cyber", name: "Cyber Neon", class: "bg-cyan-300", hex: "#67e8f9", text: "#000000" },
    { id: "blood", name: "Blood Moon", class: "bg-red-900", hex: "#7f1d1d", text: "#ffffff" },
    { id: "ocean", name: "Deep Ocean", class: "bg-blue-900", hex: "#1e3a8a", text: "#ffffff" },
    { id: "gold", name: "Midnight Gold", class: "bg-amber-600", hex: "#d97706", text: "#ffffff" },
    { id: "peach", name: "Retro Peach", class: "bg-orange-300", hex: "#fdba74", text: "#000000" },
    { id: "lava", name: "Hot Lava", class: "bg-orange-600", hex: "#ea580c", text: "#ffffff" },
];

const HIGHLIGHT_STYLES = [
    { id: "marker", label: "Marker Background" },
    { id: "inline", label: "Smart Inline Solid" },
    { id: "ribbon", label: "Modern News Ribbon" },
    { id: "underline", label: "Bold Accent Bar" },
    { id: "box", label: "Minimalist Border" },
    { id: "soft", label: "Luminous Glow" },
];

export default function ManualGeneratorPage() {
    const [headingText, setHeadingText] = useState("*North Korean* President Kim Jong Un Says 'If Necessary, My Army Will Stand With Iran,' State *Media Reports*");
    const [paragraphText, setParagraphText] = useState("");
    const [activeGradient, setActiveGradient] = useState("bg-gradient-preset-11"); // High Black by default
    const [showSocials, setShowSocials] = useState(true);
    const [fontFamily, setFontFamily] = useState("font-sans");
    const [selectedStampId, setSelectedStampId] = useState<string | null>(null);
    const [fontWeight, setFontWeight] = useState("font-extrabold");
    const [paragraphFontWeight, setParagraphFontWeight] = useState("font-normal");
    const [letterSpacing, setLetterSpacing] = useState("tracking-tight");
    const [textPosition, setTextPosition] = useState("bottom");
    const [headingFontSize, setHeadingFontSize] = useState<number>(20); // Default to 20
    const [paragraphFontSize, setParagraphFontSize] = useState<number>(20);
    const [textWidth, setTextWidth] = useState("w-full max-w-full");
    const [aspectRatio, setAspectRatio] = useState("aspect-[4/5] max-w-[450px]");
    const [highlightColor, setHighlightColor] = useState("#facc15");
    const [highlightStyle, setHighlightStyle] = useState("marker");
    const [highlightTextColor, setHighlightTextColor] = useState("#000000");
    const [gradientOpacity, setGradientOpacity] = useState<number>(100);
    const [gradientHeight, setGradientHeight] = useState<number>(45);
    const [badgePosition, setBadgePosition] = useState<"left" | "center" | "right" | "none">("none");
    const [badgeStyle, setBadgeStyle] = useState<"classic" | "split-ribbon" | "bars" | "live-red" | "hot-news-tag" | "breaking-ticker" | "live-pill" | "urgent-red" | "broadcast-red" | "few-minutes-ago" | "breaking-bars" | "split-solid" | "bar-stack" | "bars-reversed" | "split-ribbon-outline" | "bold-split" | "diagonal-bars" | "ticker-pro" | "headline-strip" | "live-studio" | "folded-ribbon" | "sleek-ticker" | "modern-slanted-bar" | "modern-slanted-bar-blue" | "modern-slanted-bar-dark" | "minimal-box" | "sleek-line" | "fox-alert" | "cnn-lower" | "bbc-trust" | "nyt-classic" | "modern-fade" | "glass-pill" | "cyber-glitch" | "neon-outline" | "minimal-dot" | "custom">("classic");
    const [customBadgeUrl, setCustomBadgeUrl] = useState<string | null>(null);

    // SKETCHES STATE
    const [sketchStyle, setSketchStyle] = useState<"default" | "cinematic" | "split-bottom" | "floating-glass" | "bordered-card" | "neon-frame" | "editorial-margin" | "worldvibe-split" | "breaking-red" | "elegant-blur">("default");

    // NEW STATES FOR ADVANCED SETTINGS
    const [badgeText, setBadgeText] = useState("BREAKING NEWS");
    const [badgeSize, setBadgeSize] = useState<number>(0.8);
    const [badgeColor, setBadgeColor] = useState<string>("#dc2626");

    const [logoWatermark, setLogoWatermark] = useState<boolean>(false);
    const [socialStyle, setSocialStyle] = useState<"minimal-white" | "original-color" | "minimal-black" | "neon-outline">("minimal-white");

    const [logoUrl, setLogoUrl] = useState<string | null>(null);
    const [logoSize, setLogoSize] = useState<number>(64);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [bgPosition, setBgPosition] = useState({ x: 0, y: 0 });
    const [bgSize, setBgSize] = useState<number>(100);
    const [secondaryImageUrl, setSecondaryImageUrl] = useState<string | null>(null);
    const [secondaryImageSize, setSecondaryImageSize] = useState<number>(100);
    const [overlayImageUrl, setOverlayImageUrl] = useState<string | null>(null);
    const [overlayPos, setOverlayPos] = useState<"bottom-left" | "bottom-right" | "top-left" | "top-right" | "center">("bottom-right");
    const [overlaySize, setOverlaySize] = useState<number>(192);
    const [overlayBorderColor, setOverlayBorderColor] = useState<string>("#dc2626");
    const [overlayLiveBadge, setOverlayLiveBadge] = useState<boolean>(false);
    const [overlayLiveBadgeColor, setOverlayLiveBadgeColor] = useState<string>("#dc2626");
    const [canvasBgColor, setCanvasBgColor] = useState<string>("#0f172a");

    // Clipboard paste target
    const [pasteTarget, setPasteTarget] = useState<"background" | "overlay" | "secondary" | null>("background");

    // Emoji stamps
    const [stamps, setStamps] = useState<Array<{ id: string; emoji: string; x: number; y: number; size: number }>>([]);
    const [stampSize, setStampSize] = useState<number>(48);

    const [history, setHistory] = useState<any[]>([]);

    // Helper to snapshot current state
    const captureState = useCallback((states: any) => {
        setHistory(prev => {
            const newState = { ...states, timestamp: Date.now() };
            // If the latest state is identical to this one (ignoring timestamp), don't push
            if (prev.length > 0) {
                const latest = { ...prev[0] };
                delete latest.timestamp;
                const current = { ...newState };
                delete current.timestamp;
                if (JSON.stringify(latest) === JSON.stringify(current)) return prev;
            }
            return [newState, ...prev].slice(0, 50);
        });
    }, []);

    const undo = useCallback(() => {
        if (history.length < 2) return;
        const [_, lastState, ...rest] = history;
        
        // Restore values
        if (lastState.headingText !== undefined) setHeadingText(lastState.headingText);
        if (lastState.paragraphText !== undefined) setParagraphText(lastState.paragraphText);
        if (lastState.imageUrl !== undefined) setImageUrl(lastState.imageUrl);
        if (lastState.bgPosition !== undefined) setBgPosition(lastState.bgPosition);
        if (lastState.bgSize !== undefined) setBgSize(lastState.bgSize);
        if (lastState.secondaryImageUrl !== undefined) setSecondaryImageUrl(lastState.secondaryImageUrl);
        if (lastState.secondaryImageSize !== undefined) setSecondaryImageSize(lastState.secondaryImageSize);
        if (lastState.logoUrl !== undefined) setLogoUrl(lastState.logoUrl);
        if (lastState.logoSize !== undefined) setLogoSize(lastState.logoSize);
        if (lastState.activeGradient !== undefined) setActiveGradient(lastState.activeGradient);
        if (lastState.gradientHeight !== undefined) setGradientHeight(lastState.gradientHeight);
        if (lastState.gradientOpacity !== undefined) setGradientOpacity(lastState.gradientOpacity);
        if (lastState.badgeText !== undefined) setBadgeText(lastState.badgeText);
        if (lastState.badgeStyle !== undefined) setBadgeStyle(lastState.badgeStyle);
        if (lastState.badgePosition !== undefined) setBadgePosition(lastState.badgePosition);
        if (lastState.badgeSize !== undefined) setBadgeSize(lastState.badgeSize);
        if (lastState.badgeColor !== undefined) setBadgeColor(lastState.badgeColor);
        if (lastState.sketchStyle !== undefined) setSketchStyle(lastState.sketchStyle);
        if (lastState.stamps !== undefined) setStamps(lastState.stamps);
        if (lastState.highlightStyle !== undefined) setHighlightStyle(lastState.highlightStyle);
        if (lastState.highlightColor !== undefined) setHighlightColor(lastState.highlightColor);
        if (lastState.highlightTextColor !== undefined) setHighlightTextColor(lastState.highlightTextColor);
        if (lastState.socialStyle !== undefined) setSocialStyle(lastState.socialStyle);
        if (lastState.showSocials !== undefined) setShowSocials(lastState.showSocials);
        if (lastState.aspectRatio !== undefined) setAspectRatio(lastState.aspectRatio);
        if (lastState.fontFamily !== undefined) setFontFamily(lastState.fontFamily);
        if (lastState.fontWeight !== undefined) setFontWeight(lastState.fontWeight);
        if (lastState.paragraphFontWeight !== undefined) setParagraphFontWeight(lastState.paragraphFontWeight);
        if (lastState.letterSpacing !== undefined) setLetterSpacing(lastState.letterSpacing);
        if (lastState.textPosition !== undefined) setTextPosition(lastState.textPosition);
        if (lastState.headingFontSize !== undefined) setHeadingFontSize(lastState.headingFontSize);
        if (lastState.paragraphFontSize !== undefined) setParagraphFontSize(lastState.paragraphFontSize);
        if (lastState.textWidth !== undefined) setTextWidth(lastState.textWidth);

        setHistory([lastState, ...rest]);
    }, [history]);

    // Keyboard Shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return; // Let default undo work in inputs
                e.preventDefault();
                undo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo]);

    // Auto-capture state changes (debounced)
    useEffect(() => {
        const timer = setTimeout(() => {
            captureState({
                headingText, paragraphText, imageUrl, bgPosition, bgSize, 
                secondaryImageUrl, secondaryImageSize, logoUrl, logoSize, 
                activeGradient, gradientHeight, gradientOpacity, badgeText, 
                sketchStyle, badgeStyle, badgePosition, badgeSize, badgeColor, stamps,
                highlightStyle, highlightColor, highlightTextColor, socialStyle,
                showSocials, aspectRatio, fontFamily, fontWeight, 
                paragraphFontWeight, letterSpacing, textPosition,
                headingFontSize, paragraphFontSize, textWidth
            });
        }, 800);
        return () => clearTimeout(timer);
    }, [
        headingText, paragraphText, imageUrl, bgPosition, bgSize, 
        secondaryImageUrl, secondaryImageSize, logoUrl, logoSize, 
        activeGradient, gradientHeight, gradientOpacity, badgeText, 
        sketchStyle, badgeStyle, badgePosition, badgeSize, badgeColor, stamps,
        highlightStyle, highlightColor, highlightTextColor, socialStyle,
        showSocials, aspectRatio, fontFamily, fontWeight, 
        paragraphFontWeight, letterSpacing, textPosition,
        headingFontSize, paragraphFontSize, textWidth
    ]);



    const handleCopyToClipboard = async () => {
        if (!containerRef.current) return;
        
        try {
            // STEP 1: Pre-inline all images as data URIs to bypass CORS
            const images = containerRef.current.querySelectorAll('img');
            const originalSrcs: Map<HTMLImageElement, string> = new Map();
            
            for (const img of Array.from(images)) {
                if (img.src && !img.src.startsWith('data:')) {
                    originalSrcs.set(img, img.src);
                    try {
                        const canvas = document.createElement('canvas');
                        canvas.width = img.naturalWidth || img.width || 200;
                        canvas.height = img.naturalHeight || img.height || 200;
                        const ctx = canvas.getContext('2d');
                        if (ctx && img.naturalWidth > 0) {
                            ctx.drawImage(img, 0, 0);
                            img.src = canvas.toDataURL('image/png');
                        }
                    } catch (e) {
                        console.warn('Could not inline image, skipping:', e);
                    }
                }
            }
            
            // STEP 2: Patch cssRules to avoid SecurityError on cross-origin stylesheets (Google Fonts etc)
            const originalDescriptor = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'cssRules');
            const originalRulesDescriptor = Object.getOwnPropertyDescriptor(CSSStyleSheet.prototype, 'rules');
            
            Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', {
                get: function() {
                    try {
                        return originalDescriptor?.get?.call(this);
                    } catch (e) {
                        return [];
                    }
                },
                configurable: true
            });
            
            if (originalRulesDescriptor) {
                Object.defineProperty(CSSStyleSheet.prototype, 'rules', {
                    get: function() {
                        try {
                            return originalRulesDescriptor?.get?.call(this);
                        } catch (e) {
                            return [];
                        }
                    },
                    configurable: true
                });
            }
            
            // STEP 3: Capture at full quality with fonts enabled
            const dataUrl = await toPng(containerRef.current, {
                quality: 1,
                pixelRatio: 3, // HD quality matching Export
                skipFonts: false, // Fonts NOW safe thanks to patch
                cacheBust: true,
                filter: (node: any) => {
                    return !node.hasAttribute || !node.hasAttribute('data-export-ignore');
                }
            });
            
            // STEP 4: Restore cssRules patch
            if (originalDescriptor) {
                Object.defineProperty(CSSStyleSheet.prototype, 'cssRules', originalDescriptor);
            }
            if (originalRulesDescriptor) {
                Object.defineProperty(CSSStyleSheet.prototype, 'rules', originalRulesDescriptor);
            }
            
            // STEP 5: Restore original image sources
            for (const [img, src] of originalSrcs) {
                img.src = src;
            }
            
            // STEP 6: Copy to clipboard
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);
            
            alert("✅ Design copied to clipboard! Paste with CTRL+V anywhere.");
        } catch (err: any) {
            console.error("Copy Error:", err);
            const errorMsg = err instanceof Event 
                ? "Image processing error" 
                : (err.message || String(err));
            alert(`Copy failed: ${errorMsg}`);
        }
    };

    const [contextMenu, setContextMenu] = useState<{ x: number, y: number } | null>(null);

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu({ x: e.clientX, y: e.clientY });
    };

    useEffect(() => {
        const handleClick = () => setContextMenu(null);
        window.addEventListener('click', handleClick);
        return () => window.removeEventListener('click', handleClick);
    }, []);
    const [activeTab, setActiveTab] = useState<"typography" | "media" | "design" | "badges" | "sketches">("typography");

    // Dynamic Scale Logic to prevent viewport cutoff
    const [scaleFactor, setScaleFactor] = useState(1);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleResize = () => {
            if (!containerRef.current) return;
            // Buffer for navbar + padding
            const paddingHeight = 120; // top nav + safe area
            const paddingWidth = 40;  // side gap

            const availableHeight = window.innerHeight - paddingHeight;
            const availableWidth = containerRef.current.parentElement?.clientWidth || window.innerWidth;

            const contentHeight = containerRef.current.scrollHeight;
            const contentWidth = containerRef.current.scrollWidth;

            if (contentHeight > 0 && contentWidth > 0) {
                const hRatio = availableHeight / contentHeight;
                const wRatio = (availableWidth - paddingWidth) / contentWidth;

                // We take the minimum ratio to ensure it fits both ways
                const finalRatio = Math.min(1, hRatio, wRatio);
                setScaleFactor(finalRatio);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);

        const observer = new ResizeObserver(() => handleResize());
        if (containerRef.current) observer.observe(containerRef.current);

        return () => {
            window.removeEventListener("resize", handleResize);
            observer.disconnect();
        };
    }, []);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setLogoUrl(URL.createObjectURL(file));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setImageUrl(URL.createObjectURL(file));
    };

    const handleSecondaryImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setSecondaryImageUrl(URL.createObjectURL(file));
    };

    const handleOverlayUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setOverlayImageUrl(URL.createObjectURL(file));
    };

    // Clipboard paste handler
    const handlePaste = useCallback((e: ClipboardEvent) => {
        if (!pasteTarget) return;
        const items = e.clipboardData?.items;
        if (!items) return;
        for (const item of Array.from(items)) {
            if (item.type.startsWith("image/")) {
                e.preventDefault();
                const blob = item.getAsFile();
                if (blob) {
                    const url = URL.createObjectURL(blob);
                    if (pasteTarget === "background") setImageUrl(url);
                    else if (pasteTarget === "overlay") setOverlayImageUrl(url);
                    else if (pasteTarget === "secondary") setSecondaryImageUrl(url);
                }
                break;
            }
        }
    }, [pasteTarget]);

    useEffect(() => {
        window.addEventListener("paste", handlePaste);
        return () => window.removeEventListener("paste", handlePaste);
    }, [handlePaste]);

    const addStamp = (emoji: string) => {
        const id = `stamp-${Date.now()}`;
        setStamps(prev => [...prev, { id, emoji, x: 150, y: 150, size: stampSize }]);
        setSelectedStampId(id);
    };

    const removeStamp = (id: string) => {
        setStamps(prev => prev.filter(s => s.id !== id));
        if (selectedStampId === id) setSelectedStampId(null);
    };

    const handleStampMove = (id: string, x: number, y: number) => {
        setStamps(prev => prev.map(s => s.id === id ? { ...s, x, y } : s));
        setSelectedStampId(id);
    };

    const handleStampResize = (newSize: number) => {
        setStampSize(newSize);
        if (selectedStampId) {
            setStamps(prev => prev.map(s => s.id === selectedStampId ? { ...s, size: newSize } : s));
        }
    };

    const handleExport = async () => {
        if (!containerRef.current) return;
        try {
            const dataUrl = await toPng(containerRef.current, {
                quality: 1,
                pixelRatio: 3, // Premium ultra-sharp export
                skipFonts: false,
                cacheBust: true,
                filter: (node: any) => {
                    return !node.hasAttribute || !node.hasAttribute('data-export-ignore');
                }
            });

            // Convert dataUrl to Blob for more reliable downloading in all browsers
            const response = await fetch(dataUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.download = `POSTRA-STUDIO-${Date.now()}.png`;
            link.href = url;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Export error:", err);
        }
    };

    return (
        <div className="w-full px-2 sm:px-6 py-0">

            <div className="grid lg:grid-cols-[550px_1fr] gap-6 items-start">

                {/* Left Col: Formulation Settings */}
                <div className="flex flex-col gap-4">
                    {/* Tab Navigation */}
                    <div className="flex bg-slate-100/80 p-1 rounded-xl border border-slate-200/50 shadow-inner">
                        {[
                            { id: "typography", label: "Text", icon: "Aa" },
                            { id: "media", label: "Media", icon: "🖼️" },
                            { id: "design", label: "Design", icon: "✨" },
                            { id: "badges", label: "Badges", icon: "🏷️" },
                            { id: "sketches", label: "Sketches", icon: "📐" }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={cn(
                                    "flex-1 flex flex-col items-center justify-center py-2 px-1 rounded-lg transition-all duration-200",
                                    activeTab === tab.id
                                        ? "bg-white shadow-md text-blue-600 scale-[1.02] border border-blue-50/50"
                                        : "text-slate-500 hover:bg-white/50 hover:text-slate-700"
                                )}
                            >
                                <span className="text-sm font-bold leading-none mb-1">{tab.icon}</span>
                                <span className="text-[10px] font-extrabold uppercase tracking-widest">{tab.label}</span>
                            </button>
                        ))}
                    </div>

                    <Card className="rounded-2xl border-none bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] overflow-hidden">
                        <CardContent className="p-0">
                            <div className="p-3 h-[450px] overflow-y-auto no-scrollbar">
                                {activeTab === "media" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.15em]">Media Assets</h3>
                                            <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                                        </div>
                                        {/* Row 1: BG and Logo */}
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between group/label">
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <ImageIcon className="w-3 h-3" /> BG Image
                                                    </div>
                                                    {imageUrl && (
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setImageUrl(null); }}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-0.5 hover:bg-red-50 rounded"
                                                            title="Remove Background"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}
                                                </Label>
                                                <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl overflow-hidden hover:bg-slate-50 transition-all cursor-pointer group active:scale-[0.98]">
                                                    {imageUrl ? (
                                                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-3 pb-3 text-slate-400 group-hover:text-blue-600">
                                                            <ImageIcon className="w-5 h-5 mb-1" />
                                                            <p className="text-[9px] font-bold uppercase">Upload</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleImageUpload} />
                                                </label>
                                                {imageUrl && (
                                                    <div className="space-y-2 mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase w-10">Zoom</span>
                                                            <input
                                                                type="range"
                                                                min="10" max="500" step="5"
                                                                value={bgSize}
                                                                onChange={(e) => setBgSize(Number(e.target.value))}
                                                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                            />
                                                            <span className="text-[8px] font-bold text-slate-500 w-8">{bgSize}%</span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[8px] font-black text-slate-400 uppercase w-10">BG Color</span>
                                                            <div className="flex gap-1.5">
                                                                {["#000000", "#ffffff", "#1e293b", "#7f1d1d", "#2563eb"].map(color => (
                                                                    <button
                                                                        key={color}
                                                                        onClick={() => setCanvasBgColor(color)}
                                                                        className={cn(
                                                                            "w-4 h-4 rounded-full border border-slate-200 shadow-sm transition-transform hover:scale-110",
                                                                            canvasBgColor === color && "ring-2 ring-blue-500 scale-110"
                                                                        )}
                                                                        style={{ backgroundColor: color }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 font-news-condensed">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between group/label">
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <ImageIcon className="w-3 h-3 text-amber-500" /> Second Image
                                                    </div>
                                                    {secondaryImageUrl && (
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setSecondaryImageUrl(null); }}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-0.5 hover:bg-red-50 rounded"
                                                            title="Remove Secondary Image"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}
                                                </Label>
                                                <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl overflow-hidden hover:bg-slate-50 transition-all cursor-pointer group active:scale-[0.98]">
                                                    {secondaryImageUrl ? (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-slate-50 p-2">
                                                            <img src={secondaryImageUrl} className="w-full h-full object-contain" alt="Second layer" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-3 pb-3 text-slate-400 group-hover:text-amber-600">
                                                            <ImageIcon className="w-5 h-5 mb-1" />
                                                            <p className="text-[9px] font-bold uppercase">Layer</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleSecondaryImageUpload} />
                                                </label>
                                                {secondaryImageUrl && (
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className="text-[8px] font-black text-slate-400 uppercase">Size</span>
                                                        <input
                                                            type="range"
                                                            min="10" max="200" step="5"
                                                            value={secondaryImageSize}
                                                            onChange={(e) => setSecondaryImageSize(Number(e.target.value))}
                                                            className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="space-y-1.5 font-news-condensed col-span-2 mt-2">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between group/label">
                                                    <div className="flex items-center gap-1.5 line-clamp-1">
                                                        <Upload className="w-3 h-3" /> Logo
                                                    </div>
                                                    {logoUrl && (
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setLogoUrl(null); }}
                                                            className="text-red-400 hover:text-red-600 transition-colors p-0.5 hover:bg-red-50 rounded"
                                                            title="Remove Logo"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}
                                                </Label>
                                                <label className="relative flex flex-col items-center justify-center w-full h-24 border-2 border-slate-200 border-dashed rounded-xl overflow-hidden hover:bg-slate-50 transition-all cursor-pointer group active:scale-[0.98]">
                                                    {logoUrl ? (
                                                        <div className="absolute inset-0 flex items-center justify-center p-3 bg-slate-50">
                                                            <img src={logoUrl} className="max-w-full max-h-full object-contain drop-shadow-md" alt="Logo preview" />
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                                <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center pt-3 pb-3 text-slate-400 group-hover:text-blue-600">
                                                            <Upload className="w-5 h-5 mb-1" />
                                                            <p className="text-[9px] font-bold uppercase tracking-wider">Brand</p>
                                                        </div>
                                                    )}
                                                    <input type="file" className="hidden" accept="image/png, image/jpeg, image/svg+xml" onChange={handleLogoUpload} />
                                                </label>
                                            </div>
                                        </div>

                                        {logoUrl && (
                                            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <label htmlFor="logoWatermark" className="text-[10px] text-slate-600 font-bold uppercase tracking-widest cursor-pointer select-none">Watermark BG</label>
                                                    <input
                                                        type="checkbox"
                                                        id="logoWatermark"
                                                        checked={logoWatermark}
                                                        onChange={(e) => setLogoWatermark(e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                    />
                                                </div>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase">
                                                        <span>Logo Size</span>
                                                        <span>{logoSize}px</span>
                                                    </div>
                                                    <input
                                                        type="range"
                                                        min="32" max="160" step="4"
                                                        value={logoSize}
                                                        onChange={(e) => setLogoSize(Number(e.target.value))}
                                                        className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div className="space-y-4 pt-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center flex-1">
                                                    Avatar Circle
                                                    {overlayImageUrl && (
                                                        <button 
                                                            onClick={(e) => { e.preventDefault(); setOverlayImageUrl(null); }}
                                                            className="ml-auto text-red-400 hover:text-red-600 transition-colors p-0.5 hover:bg-red-50 rounded"
                                                            title="Remove Avatar"
                                                        >
                                                            <Trash2 className="w-2.5 h-2.5" />
                                                        </button>
                                                    )}
                                                </h4>
                                                {!overlayImageUrl && <div className="h-[1px] flex-1 bg-slate-100 ml-4" />}
                                            </div>
                                            <label className="relative flex flex-col items-center justify-center w-full h-20 border-2 border-slate-200 border-dashed rounded-xl overflow-hidden hover:bg-slate-50 transition-all cursor-pointer group active:scale-[0.98]">
                                                {overlayImageUrl ? (
                                                    <div className="absolute inset-0 flex items-center justify-center p-2 bg-slate-50">
                                                        <img src={overlayImageUrl} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-xl" alt="Overlay preview" />
                                                        <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                            <span className="text-white text-[10px] font-bold uppercase tracking-widest">Change</span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center justify-center pt-2 pb-2 text-slate-400 group-hover:text-amber-600">
                                                        <Upload className="w-5 h-5 mb-1 opacity-50" />
                                                        <p className="text-[9px] font-bold uppercase tracking-widest">Add Avatar Circle</p>
                                                    </div>
                                                )}
                                                <input type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={handleOverlayUpload} />
                                            </label>

                                            {overlayImageUrl && (
                                                <div className="space-y-4 p-3 bg-amber-50/30 rounded-xl border border-amber-100/50">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1.5">
                                                            <div className="flex justify-between text-[9px] font-black text-amber-700/60 uppercase tracking-widest">
                                                                <span>Size</span>
                                                                <span>{overlaySize}px</span>
                                                            </div>
                                                            <input
                                                                type="range"
                                                                min="64" max="400" step="8"
                                                                value={overlaySize}
                                                                onChange={(e) => setOverlaySize(Number(e.target.value))}
                                                                className="w-full h-1 bg-amber-200/50 rounded-lg appearance-none cursor-pointer accent-amber-600"
                                                            />
                                                        </div>
                                                        <div className="space-y-1.5">
                                                            <Label className="text-[9px] font-black text-amber-700/60 uppercase tracking-widest">Border</Label>
                                                            <div className="flex gap-2">
                                                                {["#dc2626", "#2563eb", "#000000", "#ffffff"].map(c => (
                                                                    <button
                                                                        key={c}
                                                                        onClick={() => setOverlayBorderColor(c)}
                                                                        className={cn(
                                                                            "w-5 h-5 rounded-full border border-white shadow-inner transition-transform hover:scale-110",
                                                                            overlayBorderColor === c ? "ring-2 ring-amber-500 scale-110" : "opacity-80"
                                                                        )}
                                                                        style={{ backgroundColor: c }}
                                                                    />
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2 pt-1 border-t border-amber-100/30">
                                                        <input
                                                            type="checkbox"
                                                            id="overlayLiveBadgeTab"
                                                            checked={overlayLiveBadge}
                                                            onChange={(e) => setOverlayLiveBadge(e.target.checked)}
                                                            className="w-3.5 h-3.5 text-amber-600 rounded border-amber-300 focus:ring-amber-500"
                                                        />
                                                        <label htmlFor="overlayLiveBadgeTab" className="text-[10px] text-amber-800 font-bold uppercase tracking-widest cursor-pointer">Live Pulse</label>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex items-center gap-2 mb-2">
                                                <Clipboard className="w-3 h-3 text-blue-600" />
                                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Clipboard Injection</h4>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setPasteTarget(pasteTarget === "background" ? null : "background")}
                                                    className={cn(
                                                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                                                        pasteTarget === "background" ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <span className="text-xs">🏞️</span>
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">To BG</span>
                                                </button>
                                                <button
                                                    onClick={() => setPasteTarget(pasteTarget === "overlay" ? null : "overlay")}
                                                    className={cn(
                                                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                                                        pasteTarget === "overlay" ? "bg-amber-600 border-amber-600 text-white shadow-lg shadow-amber-200" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <span className="text-xs">👤</span>
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">To Avatar</span>
                                                </button>
                                                <button
                                                    onClick={() => setPasteTarget(pasteTarget === "secondary" ? null : "secondary")}
                                                    className={cn(
                                                        "flex-1 flex flex-col items-center gap-1 p-2 rounded-xl border transition-all",
                                                        pasteTarget === "secondary" ? "bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-200" : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                                                    )}
                                                >
                                                    <span className="text-xs">🖼️</span>
                                                    <span className="text-[8px] font-black uppercase tracking-tighter">To Top Lyr</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "typography" && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.15em]">Typography</h3>
                                            <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="headingText" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headline</Label>
                                                    <span className="text-[9px] text-blue-600 font-black italic uppercase tracking-tighter">Editable & Draggable</span>
                                                </div>
                                                <textarea
                                                    id="headingText"
                                                    value={headingText}
                                                    onChange={(e) => setHeadingText(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-[11px] font-bold text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[70px] resize-none leading-relaxed"
                                                />
                                            </div>

                                            <div className="space-y-2 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Emphasis *Highlights*</Label>
                                                <div className="flex gap-2 pb-2 overflow-x-auto no-scrollbar">
                                                    {HIGHLIGHT_COLORS.map(combo => (
                                                        <button
                                                            key={combo.id}
                                                            onClick={() => {
                                                                setHighlightColor(combo.hex);
                                                                setHighlightTextColor(combo.text);
                                                            }}
                                                            className={cn(
                                                                "min-w-[32px] h-8 rounded-lg border-2 flex items-center justify-center font-black text-[9px] transition-all hover:scale-110 shadow-sm shrink-0",
                                                                highlightColor === combo.hex ? "border-blue-500 shadow-md ring-2 ring-blue-500/20 scale-105" : "border-white"
                                                            )}
                                                            style={{ backgroundColor: combo.hex, color: combo.text }}
                                                        >
                                                            Aa
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="flex gap-2 pt-1 overflow-x-auto pb-1 no-scrollbar">
                                                    {HIGHLIGHT_STYLES.map(s => (
                                                        <button
                                                            key={s.id}
                                                            onClick={() => setHighlightStyle(s.id)}
                                                            className={cn(
                                                                "px-3 py-1 text-[9px] font-black uppercase rounded-full border whitespace-nowrap transition-all",
                                                                highlightStyle === s.id ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
                                                            )}
                                                        >
                                                            {s.label}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headline Size</Label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="16" max="140" step="2"
                                                                value={headingFontSize}
                                                                onChange={(e) => setHeadingFontSize(Number(e.target.value))}
                                                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                                            />
                                                            <span className="text-[10px] font-black text-slate-600 min-w-[25px]">{headingFontSize}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Size</Label>
                                                        <div className="flex items-center gap-3">
                                                            <input
                                                                type="range"
                                                                min="12" max="60" step="1"
                                                                value={paragraphFontSize}
                                                                onChange={(e) => setParagraphFontSize(Number(e.target.value))}
                                                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400"
                                                            />
                                                            <span className="text-[10px] font-black text-slate-600 min-w-[25px]">{paragraphFontSize}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Headline Weight</Label>
                                                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                                            {FONT_WEIGHTS.slice(2).map(w => (
                                                                <button
                                                                    key={w.id}
                                                                    onClick={() => setFontWeight(w.class)}
                                                                    className={cn(
                                                                        "px-2 py-1 text-[8px] font-black uppercase rounded border transition-all truncate",
                                                                        fontWeight === w.class ? "bg-blue-600 border-blue-600 text-white" : "bg-white border-slate-200 text-slate-600"
                                                                    )}
                                                                >
                                                                    {w.label.slice(0, 5)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Weight</Label>
                                                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                                            {FONT_WEIGHTS.map(w => (
                                                                <button
                                                                    key={w.id}
                                                                    onClick={() => setParagraphFontWeight(w.class)}
                                                                    className={cn(
                                                                        "px-2 py-1 text-[8px] font-black uppercase rounded border transition-all truncate",
                                                                        paragraphFontWeight === w.class ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-600"
                                                                    )}
                                                                >
                                                                    {w.label.slice(0, 5)}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t pt-4">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Font Selection</Label>
                                                <div className="grid grid-cols-3 gap-1.5 h-[120px] overflow-y-auto pr-1 no-scrollbar p-1">
                                                    {FONTS.map(f => (
                                                        <button
                                                            key={f.id}
                                                            onClick={() => setFontFamily(f.class)}
                                                            className={cn(
                                                                "px-2 py-2 text-[9px] rounded-lg border transition-all truncate",
                                                                fontFamily === f.class ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-slate-300",
                                                                f.class
                                                            )}
                                                        >
                                                            {f.name}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 border-t pt-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alignment</Label>
                                                    <div className="grid grid-cols-3 gap-1">
                                                        {POSITIONS.map(p => (
                                                            <button
                                                                key={p.id}
                                                                onClick={() => setTextPosition(p.id)}
                                                                className={cn(
                                                                    "py-1.5 text-[8px] font-black uppercase rounded border transition-all",
                                                                    textPosition === p.id ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500"
                                                                )}
                                                                title={p.label}
                                                            >
                                                                {p.id}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Text Width</Label>
                                                    <div className="grid grid-cols-3 gap-1">
                                                        {TEXT_WIDTHS.map(w => (
                                                            <button
                                                                key={w.id}
                                                                onClick={() => setTextWidth(w.class)}
                                                                className={cn(
                                                                    "py-1.5 text-[8px] font-black uppercase rounded border transition-all",
                                                                    textWidth === w.class ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500"
                                                                )}
                                                                title={w.label}
                                                            >
                                                                {w.id}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-2 border-t pt-4">
                                                <div className="flex items-center justify-between">
                                                    <Label htmlFor="paragraphTextTab" className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Secondary Text</Label>
                                                    <div className="flex gap-1.5">
                                                        {TRACKING_SIZES.map(t => (
                                                            <button
                                                                key={t.id}
                                                                onClick={() => setLetterSpacing(t.class)}
                                                                className={cn(
                                                                    "px-2 py-0.5 text-[7px] font-black uppercase rounded transition-all",
                                                                    letterSpacing === t.class ? "bg-slate-200 text-slate-900" : "text-slate-400 hover:text-slate-600"
                                                                )}
                                                            >
                                                                {t.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                                <textarea
                                                    id="paragraphTextTab"
                                                    value={paragraphText}
                                                    onChange={(e) => setParagraphText(e.target.value)}
                                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-[10px] font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[40px] resize-none"
                                                    placeholder="Optional description..."
                                                />
                                                <div className="grid grid-cols-2 gap-4 pt-1">
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Secondary Size</Label>
                                                        <div className="flex items-center gap-2">
                                                            <input
                                                                type="range"
                                                                min="12" max="64" step="1"
                                                                value={paragraphFontSize}
                                                                onChange={(e) => setParagraphFontSize(Number(e.target.value))}
                                                                className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400"
                                                            />
                                                            <span className="text-[9px] font-black text-slate-500">{paragraphFontSize}</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <Label className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Weight</Label>
                                                        <div className="flex gap-1 overflow-x-auto no-scrollbar">
                                                            {FONT_WEIGHTS.map(w => (
                                                                <button
                                                                    key={w.id}
                                                                    onClick={() => setParagraphFontWeight(w.class)}
                                                                    className={cn(
                                                                        "px-1.5 py-0.5 text-[8px] font-black uppercase rounded border transition-all truncate",
                                                                        paragraphFontWeight === w.class ? "bg-slate-900 border-slate-900 text-white" : "bg-white border-slate-200 text-slate-500"
                                                                    )}
                                                                >
                                                                    {w.label.split(' ')[0]}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "design" && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="space-y-4">
                                            <div className="space-y-2">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Canvas Dimensions</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {ASPECT_RATIOS.map(ar => (
                                                        <button
                                                            key={ar.id}
                                                            onClick={() => setAspectRatio(ar.class)}
                                                            className={cn(
                                                                "px-3 py-2 text-[9px] font-black uppercase rounded-xl border transition-all flex items-center justify-between",
                                                                aspectRatio === ar.class ? "bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-200" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                                                            )}
                                                        >
                                                            {ar.label}
                                                            {aspectRatio === ar.class && <CheckCircle2 className="w-3 h-3" />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center justify-between">
                                                    <span>Quick Stamps</span>
                                                    <span className="text-[9px] lowercase font-medium opacity-50">Click to add to canvas</span>
                                                </Label>
                                                <div className="space-y-4 p-3 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner max-h-[220px] overflow-y-auto no-scrollbar">
                                                    <div className="space-y-2">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Tactical & War</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["💣", "🔫", "🛡️", "🏹", "⚔️", "🧨", "💥", "🔥", "🚀", "🚁", "🚢", "🦾", "🪖", "🎖️", "☢️", "☣️", "🌋", "🌪️", "🌊"].map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => addStamp(emoji)}
                                                                    className="text-xl p-1.5 hover:bg-white rounded-lg transition-all hover:scale-125 hover:shadow-sm active:scale-95"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Arrows & Pointers</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["➡️", "⬅️", "⬆️", "⬇️", "↗️", "↘️", "↙️", "↖️", "↕️", "↔️", "↩️", "↪️", "⤴️", "⤵️", "🔃", "🔄", "🔙", "🔚", "🔛", "🔜", "🔝"].map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => addStamp(emoji)}
                                                                    className="text-xl p-1.5 hover:bg-white rounded-lg transition-all hover:scale-125 hover:shadow-sm active:scale-95"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2 pt-2 border-t border-slate-200/50">
                                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Standard Icons</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {["❌", "✅", "🔥", "⚡", "📢", "🚨", "⚠️", "🔴", "🟢", "💀", "❤️", "👾", "✨", "🌟", "☁️", "☀️", "❄️", "🔔", "📍", "🕙"].map(emoji => (
                                                                <button
                                                                    key={emoji}
                                                                    onClick={() => addStamp(emoji)}
                                                                    className="text-xl p-1.5 hover:bg-white rounded-lg transition-all hover:scale-125 hover:shadow-sm active:scale-95"
                                                                >
                                                                    {emoji}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3 px-1">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase">Stamp Size</span>
                                                    <input
                                                        type="range"
                                                        min="24" max="120" step="4"
                                                        value={stampSize}
                                                        onChange={(e) => handleStampResize(Number(e.target.value))}
                                                        className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-4 pt-4 border-t border-slate-100">
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

                                                <div className="space-y-4">
                                                    <div>
                                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-2 flex items-center gap-2">
                                                            Standard Overlays (Soft Fade)
                                                        </p>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {GRADIENTS.map((g) => (
                                                                <button
                                                                    key={g.id}
                                                                    onClick={() => setActiveGradient(g.class)}
                                                                    className={cn(
                                                                        "aspect-square rounded-lg border-2 transition-all hover:scale-110 shadow-sm overflow-hidden",
                                                                        activeGradient === g.class ? "border-blue-500 scale-110 ring-2 ring-blue-500/20" : "border-white"
                                                                    )}
                                                                    title={g.name}
                                                                >
                                                                    <div className={cn("w-full h-full", g.class)} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <p className="text-[8px] font-black text-blue-600 uppercase mb-2 flex items-center gap-2">
                                                            High Intensity Overlays (Deep Solid)
                                                        </p>
                                                        <div className="grid grid-cols-5 gap-2">
                                                            {HIGH_GRADIENTS.map((g) => (
                                                                <button
                                                                    key={g.id}
                                                                    onClick={() => setActiveGradient(g.class)}
                                                                    className={cn(
                                                                        "aspect-square rounded-lg border-2 transition-all hover:scale-110 shadow-sm overflow-hidden",
                                                                        activeGradient === g.class ? "border-blue-500 scale-110 ring-2 ring-blue-500/20" : "border-white"
                                                                    )}
                                                                    title={g.name}
                                                                >
                                                                    <div className={cn("w-full h-full", g.class)} />
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Social Branding</h4>
                                                    <input
                                                        type="checkbox"
                                                        checked={showSocials}
                                                        onChange={(e) => setShowSocials(e.target.checked)}
                                                        className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                                                    />
                                                </div>
                                                {showSocials && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {[
                                                            { id: "minimal-white", label: "Minimal White" },
                                                            { id: "original-color", label: "Original Color" },
                                                            { id: "minimal-black", label: "Minimal Black" },
                                                            { id: "neon-outline", label: "Neon Outline" },
                                                            { id: "colorful-circles", label: "Colorful Circles" },
                                                            { id: "colorful-squares", label: "Colorful Squares" }
                                                        ].map(opt => (
                                                            <button
                                                                key={opt.id}
                                                                onClick={() => setSocialStyle(opt.id as any)}
                                                                className={cn(
                                                                    "px-2 py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all truncate",
                                                                    socialStyle === opt.id ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
                                                                )}
                                                            >
                                                                {opt.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === "badges" && (
                                    <div className="space-y-5 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.15em]">News Badges</h3>
                                            <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                                        </div>

                                        <div className="space-y-4">
                                            
                                            {/* 1. BADGE STYLE (MOVED TO TOP) */}
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Badge Style</Label>
                                                    <div className="grid grid-cols-2 gap-2 h-[180px] overflow-y-auto pr-1 no-scrollbar p-1">
                                                        {[
                                                            "classic", "split-ribbon", "bars", "live-red", "hot-news-tag", "folded-ribbon", "sleek-ticker",
                                                            "breaking-ticker", "live-pill", "urgent-red", "broadcast-red", "few-minutes-ago",
                                                            "breaking-bars", "split-solid", "bar-stack", "bars-reversed", "split-ribbon-outline", "bold-split",
                                                            "diagonal-bars", "ticker-pro", "headline-strip", "live-studio", "modern-slanted-bar", "modern-slanted-bar-blue", "modern-slanted-bar-dark",
                                                            "minimal-box", "sleek-line", "fox-alert", "cnn-lower", "bbc-trust", "nyt-classic", "modern-fade", "glass-pill", "cyber-glitch", "neon-outline", "minimal-dot",
                                                            "custom"
                                                        ].map(s => (
                                                            <button
                                                                key={s}
                                                                onClick={() => {
                                                                    setBadgeStyle(s as any);
                                                                    if (badgePosition === "none") {
                                                                        setBadgePosition("left");
                                                                    }
                                                                }}
                                                                className={cn(
                                                                    "px-2 py-2 text-[8px] font-black uppercase rounded-lg border transition-all text-left flex items-center justify-between",
                                                                    badgeStyle === s ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
                                                                )}
                                                            >
                                                                {s.replace(/-/g, " ")}
                                                                {badgeStyle === s && <CheckCircle2 className="w-3 h-3" />}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {badgeStyle === "custom" && (
                                                    <div className="space-y-3 p-3 bg-blue-50/50 rounded-xl border border-blue-100/50 animate-in fade-in slide-in-from-top-1">
                                                        <Label className="text-[10px] font-black text-blue-600 uppercase tracking-widest block">Custom Badge Image</Label>
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="w-16 h-16 rounded-lg border-2 border-dashed border-blue-200 bg-white flex items-center justify-center cursor-pointer hover:bg-blue-50 transition-colors overflow-hidden group relative"
                                                                onClick={() => document.getElementById('badge-upload')?.click()}
                                                            >
                                                                {customBadgeUrl ? (
                                                                    <img src={customBadgeUrl} className="w-full h-full object-contain" alt="Custom Badge" />
                                                                ) : (
                                                                    <Upload className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                                                                )}
                                                                <input
                                                                    id="badge-upload"
                                                                    type="file"
                                                                    className="hidden"
                                                                    accept="image/*"
                                                                    onChange={(e) => {
                                                                        const file = e.target.files?.[0];
                                                                        if (file) {
                                                                            const url = URL.createObjectURL(file);
                                                                            setCustomBadgeUrl(url);
                                                                        }
                                                                    }}
                                                                />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="text-[9px] text-blue-500 font-bold uppercase leading-tight">Upload PNG/SVG</p>
                                                                <p className="text-[8px] text-slate-400 mt-1 uppercase">Best for tailored branding</p>
                                                                {customBadgeUrl && (
                                                                    <button
                                                                        onClick={() => setCustomBadgeUrl(null)}
                                                                        className="text-[8px] text-red-500 font-bold uppercase hover:underline mt-2"
                                                                    >
                                                                        Remove Image
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* 2. PLACEMENT */}
                                            <div className="space-y-2 pt-2 border-t border-slate-100">
                                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Placement</Label>
                                                <div className="grid grid-cols-4 gap-1.5">
                                                    {["none", "left", "center", "right"].map(pos => (
                                                        <button
                                                            key={pos}
                                                            onClick={() => setBadgePosition(pos as any)}
                                                            className={cn(
                                                                "py-1.5 text-[9px] font-black uppercase rounded-lg border transition-all",
                                                                badgePosition === pos ? "bg-slate-900 border-slate-900 text-white shadow-md" : "bg-white border-slate-200 text-slate-600"
                                                            )}
                                                        >
                                                            {pos === "none" ? "Hide" : pos}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* 3. CONTENT, COLOR, SCALE (ONLY IF NOT HIDDEN) */}
                                            {badgePosition !== "none" && (
                                                <div className="space-y-4 animate-in slide-in-from-top-2 pt-2 border-t border-slate-100">
                                                    <div className="space-y-2">
                                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Badge Content</Label>
                                                        <input
                                                            value={badgeText}
                                                            onChange={(e) => setBadgeText(e.target.value.toUpperCase())}
                                                            className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-[10px] font-black text-slate-800 shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                                            placeholder="TEXT..."
                                                        />
                                                    </div>

                                                    <div className="flex gap-4">
                                                        <div className="flex-1 space-y-2">
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Badge Color</Label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="color"
                                                                    value={badgeColor}
                                                                    onChange={(e) => setBadgeColor(e.target.value)}
                                                                    className="w-8 h-8 rounded border-none cursor-pointer"
                                                                />
                                                                <input
                                                                    value={badgeColor}
                                                                    onChange={(e) => setBadgeColor(e.target.value)}
                                                                    className="flex-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] uppercase font-bold"
                                                                />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 space-y-2">
                                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scale</Label>
                                                            <div className="flex items-center gap-2">
                                                                <input
                                                                    type="range"
                                                                    min="0.5" max="2" step="0.1"
                                                                    value={badgeSize}
                                                                    onChange={(e) => setBadgeSize(Number(e.target.value))}
                                                                    className="flex-1 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-400"
                                                                />
                                                                <span className="text-[10px] font-black">{badgeSize}x</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                {activeTab === "sketches" && (
                                    <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-black text-slate-900 text-xs uppercase tracking-[0.15em]">Layout Sketches</h3>
                                            <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                                        </div>
                                        
                                        <div className="space-y-2">
                                            <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Select Layout Framework</Label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {[
                                                    { id: "default", name: "Default View", desc: "Standard image and text overlay" },
                                                    { id: "cinematic", name: "Cinematic", desc: "Full image with deep bottom gradient" },
                                                    { id: "split-bottom", name: "Classic Split", desc: "Image on top, solid text box below" },
                                                    { id: "worldvibe-split", name: "Glowing Split", desc: "Top image, black bottom, glowing pink divider" },
                                                    { id: "breaking-red", name: "Red Alert", desc: "Solid red bottom box for breaking news" },
                                                    { id: "floating-glass", name: "Floating Box", desc: "Text in a floating translucent container" },
                                                    { id: "elegant-blur", name: "Elegant Blur", desc: "Full-width glassmorphism text panel" },
                                                    { id: "bordered-card", name: "Facebook Card", desc: "Thick borders with distinct text area" },
                                                    { id: "neon-frame", name: "Neon Frame", desc: "Vibrant glowing border around post" },
                                                    { id: "editorial-margin", name: "Editorial Print", desc: "Newspaper style margins around image" }
                                                ].map(s => (
                                                    <button
                                                        key={s.id}
                                                        onClick={() => {
                                                            setSketchStyle(s.id as any);
                                                            // AUTO FONT & STYLE SETTINGS BASED ON SKETCH
                                                            if (s.id === "cinematic") {
                                                                setFontFamily("font-news-serif");
                                                                setFontWeight("font-bold");
                                                                setGradientOpacity(100);
                                                                setGradientHeight(80);
                                                                setTextPosition("bottom");
                                                            } else if (s.id === "split-bottom") {
                                                                setFontFamily("font-news-condensed");
                                                                setFontWeight("font-bold");
                                                                setGradientOpacity(0);
                                                                setTextPosition("bottom");
                                                            } else if (s.id === "worldvibe-split") {
                                                                setFontFamily("font-bebas");
                                                                setFontWeight("font-normal");
                                                                setGradientOpacity(0);
                                                                setTextPosition("bottom");
                                                                setBadgePosition("none");
                                                            } else if (s.id === "breaking-red") {
                                                                setFontFamily("font-poppins");
                                                                setFontWeight("font-black");
                                                                setGradientOpacity(0);
                                                                setTextPosition("bottom");
                                                                setHighlightColor("#ffffff");
                                                                setHighlightTextColor("#dc2626");
                                                            } else if (s.id === "elegant-blur") {
                                                                setFontFamily("font-outfit");
                                                                setFontWeight("font-bold");
                                                                setGradientOpacity(0);
                                                                setTextPosition("bottom");
                                                            } else if (s.id === "floating-glass") {
                                                                setFontFamily("font-sans");
                                                                setFontWeight("font-bold");
                                                                setGradientOpacity(80);
                                                            } else if (s.id === "editorial-margin") {
                                                                setFontFamily("font-libre-baskerville");
                                                                setFontWeight("font-bold");
                                                            }
                                                        }}
                                                        className={cn(
                                                            "px-3 py-3 rounded-lg border transition-all text-left flex flex-col gap-1",
                                                            sketchStyle === s.id ? "bg-blue-600 border-blue-600 text-white shadow-md" : "bg-white border-slate-200 text-slate-600 hover:border-blue-300"
                                                        )}
                                                    >
                                                        <div className="flex items-center justify-between w-full">
                                                            <span className="text-[11px] font-black uppercase tracking-wider">{s.name}</span>
                                                            {sketchStyle === s.id && <CheckCircle2 className="w-3.5 h-3.5" />}
                                                        </div>
                                                        <span className={cn("text-[9px] leading-tight", sketchStyle === s.id ? "text-blue-100" : "text-slate-400")}>{s.desc}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </CardContent>

                        <div className="p-4 border-t border-slate-100 bg-slate-50/30">
                            <div className="grid grid-cols-2 gap-2">
                                <Button
                                    onClick={handleExport}
                                    className="h-11 rounded-xl bg-slate-900 border-none hover:bg-black text-[9px] font-black uppercase tracking-widest shadow-xl group transition-all active:scale-95 px-2"
                                >
                                    <Download className="w-3.5 h-3.5 mr-1.5 group-hover:translate-y-0.5 transition-transform" />
                                    Export PNG
                                </Button>
                                <Button
                                    onClick={async () => {
                                        if (!containerRef.current) return;
                                        const { toJpeg } = await import("html-to-image");
                                        const dataUrl = await toJpeg(containerRef.current, { 
                                            quality: 0.95, 
                                            pixelRatio: 3,
                                            filter: (node: any) => {
                                                return !node.hasAttribute || !node.hasAttribute('data-export-ignore');
                                            }
                                        });

                                        const response = await fetch(dataUrl);
                                        const blob = await response.blob();
                                        const url = URL.createObjectURL(blob);

                                        const link = document.createElement("a");
                                        link.download = `POSTRA-STUDIO-${Date.now()}.jpg`;
                                        link.href = url;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(url);
                                    }}
                                    className="h-11 rounded-xl bg-blue-600 border-none hover:bg-blue-700 text-[9px] font-black uppercase tracking-widest shadow-xl group transition-all active:scale-95 px-2"
                                >
                                    <Download className="w-3.5 h-3.5 mr-1.5 group-hover:translate-y-0.5 transition-transform" />
                                    Export JPG
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Right Col: Graphic Preview */}
                <div className="relative flex-1 flex flex-col items-center justify-start lg:sticky lg:top-2 pt-0 min-h-0">


                    <div
                        ref={containerRef}
                        onContextMenu={handleContextMenu}
                        className="relative z-10 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform group cursor-context-menu"
                        style={{ transform: `scale(${scaleFactor})`, transformOrigin: 'top center' }}
                    >
                        <ManualCanvas
                            headingText={headingText}
                            paragraphText={paragraphText}
                            image={imageUrl}
                            bgPosition={bgPosition}
                            bgSize={bgSize}
                            secondaryImage={secondaryImageUrl}
                            secondaryImageSize={secondaryImageSize}
                            logo={logoUrl}
                            logoWatermark={logoWatermark}
                            gradient={activeGradient}
                            ratio={aspectRatio}
                            showSocials={showSocials}
                            fontFamily={fontFamily}
                            fontWeight={fontWeight}
                            paragraphFontWeight={paragraphFontWeight}
                            letterSpacing={letterSpacing}
                            textPosition={textPosition}
                            headingFontSize={headingFontSize}
                            paragraphFontSize={paragraphFontSize}
                            textWidth={textWidth}
                            highlightStyle={highlightStyle}
                            highlightColor={highlightColor}
                            highlightTextColor={highlightTextColor}
                            gradientOpacity={gradientOpacity}
                            gradientHeight={gradientHeight}
                            badgePosition={badgePosition}
                            badgeStyle={badgeStyle}
                            badgeText={badgeText}
                            badgeSize={badgeSize}
                            badgeColor={badgeColor}
                            overlayImage={overlayImageUrl}
                            overlayPosition={overlayPos}
                            overlaySize={overlaySize}
                            overlayBorderColor={overlayBorderColor}
                            overlayLiveBadge={overlayLiveBadge}
                            overlayLiveBadgeColor={overlayLiveBadgeColor}
                            customBadgeImageUrl={customBadgeUrl}
                            sketchStyle={sketchStyle}
                            logoSize={logoSize}
                            stamps={stamps}
                            onStampMove={handleStampMove}
                            selectedStampId={selectedStampId}
                            socialStyle={socialStyle}
                            canvasBgColor={canvasBgColor}
                        />

                        {stamps.length > 0 && (
                            <div data-export-ignore="true" className="absolute top-4 right-4 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    onClick={() => setStamps([])}
                                    variant="destructive"
                                    size="sm"
                                    className="h-8 rounded-lg bg-red-500/20 hover:bg-red-500 text-red-100 backdrop-blur-md border border-red-500/30 font-black text-[9px] uppercase tracking-widest"
                                >
                                    <Trash2 className="w-3.5 h-3.5 mr-2" />
                                    Clear Objects
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Resolution Section Removed per user request */}
                </div>
            </div>

            {/* Context Menu Overlay */}
            {contextMenu && (
                <div 
                    className="fixed z-[9999] bg-white shadow-2xl rounded-xl border border-slate-200 p-1.5 min-w-[180px] animate-in fade-in zoom-in-95 duration-100"
                    style={{ top: contextMenu.y, left: contextMenu.x }}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleCopyToClipboard();
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-blue-600 hover:text-white rounded-lg transition-colors group"
                    >
                        <Clipboard className="w-4 h-4 text-blue-500 group-hover:text-white" />
                        Copy to Clipboard
                    </button>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            handleExport();
                            setContextMenu(null);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <Download className="w-4 h-4 text-slate-400" />
                        Download PNG
                    </button>
                </div>
            )}
        </div>
    );
}
