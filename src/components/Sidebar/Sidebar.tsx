'use client';

import React, { useState } from 'react';
import styles from './Sidebar.module.css';

interface SidebarProps {
    onGenerate: (data: any) => void;
    isGenerating: boolean;
}

export default function Sidebar({ onGenerate, isGenerating }: SidebarProps) {
    const [topic, setTopic] = useState('');
    const [niche, setNiche] = useState('News');
    const [tone, setTone] = useState('Professional');
    const [urgency, setUrgency] = useState('Neutral');
    const [mode, setMode] = useState<'single' | 'auto'>('single');

    const niches = ['News', 'Motivation', 'Tech', 'Health', 'Mixed'];
    const tones = ['Professional', 'Punchy', 'Funny', 'Dramatic', 'Inspirational'];
    const urgencies = ['Breaking', 'Urgent', 'Neutral', 'Evergreen'];

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!topic.trim()) return;
        onGenerate({ topic, niche, tone, urgency, mode });
    };

    return (
        <aside className={styles.sidebar}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <div className={styles.section}>
                    <h3 className={styles.sectionTitle}>Generation Mode</h3>
                    <div className={styles.modeToggle}>
                        <button
                            type="button"
                            className={`${styles.modeBtn} ${mode === 'single' ? styles.active : ''}`}
                            onClick={() => setMode('single')}
                        >
                            Single Post
                        </button>
                        <button
                            type="button"
                            className={`${styles.modeBtn} ${mode === 'auto' ? styles.active : ''}`}
                            onClick={() => setMode('auto')}
                        >
                            News Auto Mode
                        </button>
                    </div>
                </div>

                <div className={styles.section}>
                    <label className={styles.label} htmlFor="topic">Topic / Headline Input</label>
                    <textarea
                        id="topic"
                        className={styles.textarea}
                        placeholder={mode === 'auto' ? "E.g., Global Tech Trends" : "E.g., AI Replaces Coders"}
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        rows={3}
                        required
                    />
                </div>

                <div className={styles.grid}>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Niche</label>
                        <select className={styles.select} value={niche} onChange={e => setNiche(e.target.value)}>
                            {niches.map(n => <option key={n} value={n}>{n}</option>)}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Tone</label>
                        <select className={styles.select} value={tone} onChange={e => setTone(e.target.value)}>
                            {tones.map(t => <option key={t} value={t}>{t}</option>)}
                        </select>
                    </div>

                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Urgency Focus</label>
                        <select className={styles.select} value={urgency} onChange={e => setUrgency(e.target.value)}>
                            {urgencies.map(u => <option key={u} value={u}>{u}</option>)}
                        </select>
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.generateBtn}
                    disabled={!topic.trim() || isGenerating}
                >
                    {isGenerating ? 'Generating...' : (mode === 'auto' ? 'Auto-Generate Bulk Posts' : 'Generate Post')}
                </button>
            </form>
        </aside>
    );
}
