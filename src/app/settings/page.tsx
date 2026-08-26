"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
    const [openaiKey, setOpenaiKey] = useState("");
    const [geminiKey, setGeminiKey] = useState("");
    const [provider, setProvider] = useState("gemini");
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load existing settings
        const storedOpenai = localStorage.getItem("newsgen_openai_key");
        const storedGemini = localStorage.getItem("newsgen_gemini_key");
        const storedProvider = localStorage.getItem("newsgen_provider");

        if (storedOpenai) setOpenaiKey(storedOpenai);
        if (storedGemini) setGeminiKey(storedGemini);
        if (storedProvider) setProvider(storedProvider);
    }, []);

    const handleSave = () => {
        localStorage.setItem("newsgen_openai_key", openaiKey);
        localStorage.setItem("newsgen_gemini_key", geminiKey);
        localStorage.setItem("newsgen_provider", provider);

        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="max-w-lg mx-auto py-4">
            <div className="mb-5">
                <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">API Settings</h1>
                <p className="text-slate-600 text-xs mt-1">Configure your AI providers. Keys are stored locally in your browser.</p>
            </div>

            <div className="space-y-4">
                {/* Active Provider Card */}
                <Card className="border-t-4 border-t-blue-600">
                    <CardHeader>
                        <CardTitle>Active AI Provider</CardTitle>
                        <CardDescription>Select which AI engine powers your post generation.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            <Label htmlFor="provider">Select Provider</Label>
                            <Select
                                id="provider"
                                value={provider}
                                onChange={(e) => setProvider(e.target.value)}
                                className="max-w-xs"
                            >
                                <option value="gemini">Google Gemini (Recommended)</option>
                                <option value="openai">OpenAI (ChatGPT)</option>
                            </Select>
                        </div>
                    </CardContent>
                </Card>

                {/* API Keys Card */}
                <Card>
                    <CardHeader>
                        <CardTitle>API Credentials</CardTitle>
                        <CardDescription>Your keys are securely passed to the backend and never saved to a database.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">

                        <div className="space-y-2">
                            <Label htmlFor="gemini">Google Gemini API Key</Label>
                            <Input
                                id="gemini"
                                type="password"
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                                placeholder="AIzaSy..."
                                className="font-mono"
                            />
                            <p className="text-xs text-slate-500">Get a free key from Google AI Studio. Required if Gemini is selected above.</p>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="openai">OpenAI API Key</Label>
                            <Input
                                id="openai"
                                type="password"
                                value={openaiKey}
                                onChange={(e) => setOpenaiKey(e.target.value)}
                                placeholder="sk-..."
                                className="font-mono"
                            />
                            <p className="text-xs text-slate-500">Requires an OpenAI developer account with billing enabled.</p>
                        </div>

                    </CardContent>
                </Card>

                <div className="flex justify-end pt-2">
                    <Button onClick={handleSave} className="min-w-[140px]">
                        {saved ? (
                            <span className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" /> Saved!
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <Save className="w-4 h-4" /> Save Settings
                            </span>
                        )}
                    </Button>
                </div>

            </div>
        </div>
    );
}
