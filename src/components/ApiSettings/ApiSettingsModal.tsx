'use client';

import React, { useState, useEffect } from 'react';
import styles from './ApiSettingsModal.module.css';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export default function ApiSettingsModal({ isOpen, onClose }: Props) {
    const [provider, setProvider] = useState<'openai' | 'gemini'>('openai');
    const [openAiKey, setOpenAiKey] = useState('');
    const [geminiKey, setGeminiKey] = useState('');
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        // Load existing keys from localStorage
        const savedOpenAi = localStorage.getItem('postra_openai_key');
        const savedGemini = localStorage.getItem('postra_gemini_key');
        const savedProvider = localStorage.getItem('postra_provider') as 'openai' | 'gemini';

        if (savedOpenAi) setOpenAiKey(savedOpenAi);
        if (savedGemini) setGeminiKey(savedGemini);
        if (savedProvider) setProvider(savedProvider);
    }, []);

    if (!isOpen) return null;

    const handleSave = () => {
        // Save Provider
        localStorage.setItem('postra_provider', provider);

        // Save OpenAI
        if (openAiKey.trim()) localStorage.setItem('postra_openai_key', openAiKey.trim());
        else localStorage.removeItem('postra_openai_key');

        // Save Gemini
        if (geminiKey.trim()) localStorage.setItem('postra_gemini_key', geminiKey.trim());
        else localStorage.removeItem('postra_gemini_key');

        setSaved(true);
        setTimeout(() => {
            setSaved(false);
            onClose();
        }, 1000);
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.header}>
                    <h2>API Settings</h2>
                    <button onClick={onClose} className={styles.closeBtn}>×</button>
                </div>

                <div className={styles.content}>
                    <div className={styles.providerToggle}>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="provider"
                                value="openai"
                                checked={provider === 'openai'}
                                onChange={() => setProvider('openai')}
                            /> OpenAI (GPT-4o)
                        </label>
                        <label className={styles.radioLabel}>
                            <input
                                type="radio"
                                name="provider"
                                value="gemini"
                                checked={provider === 'gemini'}
                                onChange={() => setProvider('gemini')}
                            /> Google Gemini (1.5 Pro)
                        </label>
                    </div>

                    <p className={styles.description} style={{ marginTop: 16 }}>
                        Keys are stored securely in your browser's local storage and never sent to our servers. Used securely connecting from backend.
                    </p>

                    {provider === 'openai' && (
                        <div className={styles.keyBlock}>
                            <label htmlFor="openai_key" className={styles.label}>Custom OpenAI API Key</label>
                            <input
                                type="password"
                                id="openai_key"
                                className={styles.input}
                                placeholder="sk-..."
                                value={openAiKey}
                                onChange={(e) => setOpenAiKey(e.target.value)}
                            />
                        </div>
                    )}

                    {provider === 'gemini' && (
                        <div className={styles.keyBlock}>
                            <label htmlFor="gemini_key" className={styles.label}>Custom Gemini API Key</label>
                            <input
                                type="password"
                                id="gemini_key"
                                className={styles.input}
                                placeholder="AIza..."
                                value={geminiKey}
                                onChange={(e) => setGeminiKey(e.target.value)}
                            />
                        </div>
                    )}
                </div>

                <div className={styles.footer}>
                    <button onClick={onClose} className={styles.cancelBtn}>Cancel</button>
                    <button onClick={handleSave} className={styles.saveBtn}>
                        {saved ? 'Saved!' : 'Save Key'}
                    </button>
                </div>
            </div>
        </div>
    );
}
