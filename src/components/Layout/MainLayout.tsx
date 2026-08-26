'use client';

import React, { useState } from 'react';
import styles from './MainLayout.module.css';
import ApiSettingsModal from '../ApiSettings/ApiSettingsModal';

export default function MainLayout({ children }: { children: React.ReactNode }) {
    const [isApiModalOpen, setIsApiModalOpen] = useState(false);
    return (
        <div className={styles.appContainer}>
            {/* Top Navbar could go here, or we embed API Settings in sidebar */}
            <nav className={styles.navbar}>
                <div className={styles.logo}>Postra AI</div>
                <div className={styles.navActions}>
                    {/* API Key Modal Trigger will go here */}
                    <button
                        className={styles.apiBtn}
                        onClick={() => setIsApiModalOpen(true)}
                    >
                        ⚙️ API Settings
                    </button>
                </div>
            </nav>

            <ApiSettingsModal
                isOpen={isApiModalOpen}
                onClose={() => setIsApiModalOpen(false)}
            />

            <div className={styles.mainContent}>
                {children}
            </div>
        </div>
    );
}
