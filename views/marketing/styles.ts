

export const MARKETING_CSS = `
/* Global CSS */
:root,
[data-theme="light"] {
    --color-bg: #ffffff;
    --color-bg-secondary: #f8f9fa;
    --color-bg-header: rgba(255, 255, 255, 0.85);
    --color-surface: #ffffff;
    --color-text-primary: #1a1a1a;
    --color-text-secondary: #666666;
    --color-text-tertiary: #888888;
    --color-accent: #3ecf8e;
    --color-accent-dark: #00a86b;
    --color-border: #e6e6e6;
    --color-border-light: #f0f0f0;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-dropdown: 0 10px 40px -10px rgba(0,0,0,0.15);
}

[data-theme="dark"] {
    --color-bg: #121212;
    --color-bg-secondary: #0f0f0f;
    --color-bg-header: rgba(18, 18, 18, 0.85);
    --color-surface: #1c1c1c;
    --color-text-primary: #ededed;
    --color-text-secondary: #a1a1a1;
    --color-text-tertiary: #666666;
    --color-accent: #3ecf8e;
    --color-accent-dark: #006239;
    --color-border: #2e2e2e;
    --color-border-light: #363636;
    --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.5);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5);
    --shadow-dropdown: 0 10px 40px -10px rgba(0,0,0,0.5);
}

* {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    background-color: var(--color-bg);
    color: var(--color-text-primary);
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    margin: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    transition: background-color 0.3s ease, color 0.3s ease;
    overflow-x: hidden;
}

a {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;
}

/* Animations */
@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
}

@keyframes marquee {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}

@keyframes marquee-reverse {
    0% { transform: translateX(-50%); }
    100% { transform: translateX(0); }
}

@keyframes marquee-up {
    0% { transform: translateY(0); }
    100% { transform: translateY(-50%); }
}

@keyframes marquee-down {
    0% { transform: translateY(-50%); }
    100% { transform: translateY(0); }
}

.animate-marquee {
    animation: marquee 30s linear infinite;
}

.animate-marquee-reverse {
    animation: marquee-reverse 30s linear infinite;
}

.animate-marquee-up {
    animation: marquee-up 60s linear infinite;
}

.animate-marquee-down {
    animation: marquee-down 60s linear infinite;
}

.pause {
    animation-play-state: paused;
}

.run {
    animation-play-state: running;
}

/* Layout Utilities */
.page-container {
    width: 100%;
    margin: 0 auto;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
}

.section-container {
    padding: 96px 24px;
    max-width: 1200px;
    margin: 0 auto;
}

/* Buttons */
.btn {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    padding: 10px 18px;
    border-radius: 4px;
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    gap: 8px;
    white-space: nowrap;
}

.btn-primary {
    background-color: var(--color-accent);
    color: #ffffff;
    border: 1px solid var(--color-accent);
    font-weight: 600;
    box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}

.btn-primary:hover {
    background-color: var(--color-accent-dark);
    border-color: var(--color-accent-dark);
    color: white;
}

[data-theme="dark"] .btn-primary {
    background-color: var(--color-accent);
    color: #ffffff;
    border-color: var(--color-accent);
}

[data-theme="dark"] .btn-primary:hover {
    background-color: var(--color-accent-dark);
    border-color: var(--color-accent-dark);
    color: white;
}


.btn-secondary {
    background-color: #ffffff;
    color: #1a1a1a;
    border: 1px solid #e6e6e6;
}

[data-theme="dark"] .btn-secondary {
    background-color: #1c1c1c;
    color: #ededed;
    border-color: #333;
}

.btn-secondary:hover {
    background-color: #f9f9f9;
    border-color: #d1d1d1;
}

[data-theme="dark"] .btn-secondary:hover {
    background-color: #2a2a2a;
    border-color: #444;
}

/* Header */
.site-header {
    background-color: var(--color-bg-header);
    border-bottom: 1px solid var(--color-border);
    position: sticky;
    top: 0;
    z-index: 50;
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    height: 64px;
    width: 100%;
}

.header-container {
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.header-left {
    display: flex;
    align-items: center;
    gap: 32px;
    height: 100%;
}

.header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    cursor: pointer;
    user-select: none;
}

.logo-box {
    color: var(--color-accent);
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-text {
    font-weight: 700;
    font-size: 20px;
    color: var(--color-text-primary);
    letter-spacing: -0.5px;
}

/* Navigation */
.main-nav {
    height: 100%;
}

.main-nav ul {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 4px;
    height: 100%;
    align-items: center;
}

.nav-item-wrapper {
    position: relative;
    height: 100%;
    display: flex;
    align-items: center;
}

.nav-item {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: inherit;
    transition: all 0.2s;
}

.nav-item:hover, .nav-item.active {
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
}

.nav-item-link {
    color: var(--color-text-secondary);
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    cursor: pointer;
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.2s;
}

.nav-item-link:hover {
    color: var(--color-text-primary);
    background-color: var(--color-bg-secondary);
}

.chevron {
    opacity: 0.5;
    transition: transform 0.2s;
}

.chevron.rotate {
    transform: rotate(180deg);
}

.nav-dropdown {
    position: absolute;
    top: calc(100% - 10px);
    left: 0;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-dropdown);
    padding: 8px;
    z-index: 100;
    animation: fadeIn 0.15s ease-out;
    transform-origin: top left;
}

.simple-dropdown {
    min-width: 240px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.mega-menu {
    left: -100px; 
}

@media (min-width: 1024px) {
    .mega-menu {
        left: -200px; 
    }
}

.mega-menu-content {
    display: flex;
    padding: 0;
    width: max-content;
    min-width: 600px;
    max-width: 900px;
}

.mega-menu-columns {
    display: flex;
    padding: 24px;
    gap: 48px;
}

.menu-column {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 180px;
}

.column-header {
    font-size: 11px;
    font-weight: 600;
    color: var(--color-text-tertiary);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0;
    text-decoration: none;
    color: var(--color-text-secondary);
    transition: color 0.2s;
}

.dropdown-item:hover {
    color: var(--color-text-primary);
}

.dropdown-item:hover .item-icon {
    color: var(--color-text-primary);
}

.item-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--color-text-tertiary);
    transition: color 0.2s;
}

.item-label {
    font-size: 14px;
    font-weight: 500;
}

.item-content {
    display: flex;
    flex-direction: column;
}

.item-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--color-text-primary);
}

.item-desc {
    font-size: 12px;
    color: var(--color-text-tertiary);
}

.header-right {
    display: flex;
    align-items: center;
    gap: 16px;
}

.github-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--color-text-primary);
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 6px 12px;
    border-radius: 6px;
    font-size: 13px;
    text-decoration: none;
    transition: all 0.2s;
}

.github-btn:hover {
    border-color: var(--color-text-secondary);
    background-color: var(--color-bg-secondary);
}

.github-count {
    font-size: 12px;
    color: var(--color-text-secondary);
    border-left: 1px solid var(--color-border);
    padding-left: 8px;
}

.login-btn {
    background: none;
    border: 1px solid #e6e6e6;
    color: var(--color-text-primary);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    padding: 6px 12px;
    border-radius: 4px;
    transition: background-color 0.2s;
}

[data-theme="dark"] .login-btn {
    border-color: #333;
}

.login-btn:hover {
    background-color: var(--color-bg-secondary);
}

.start-btn {
    background-color: var(--color-accent);
    color: #ffffff; /* Changed from #1a1a1a to #ffffff */
    border: 1px solid var(--color-accent);
    padding: 6px 14px;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

.start-btn:hover {
    background-color: var(--color-accent-dark);
    border-color: var(--color-accent-dark);
    color: white;
}

/* Footer Styles */
.site-footer-main {
    background-color: var(--color-bg);
    border-top: 1px solid var(--color-border);
    padding: 64px 0 32px;
    font-size: 14px;
}

.footer-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
}

.footer-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px;
    margin-bottom: 64px;
}

@media (min-width: 768px) {
    .footer-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1024px) {
    .footer-grid {
        grid-template-columns: repeat(6, 1fr);
    }
}

.footer-column h6 {
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: 16px;
    font-size: 14px;
}

.footer-column ul {
    list-style: none;
    padding: 0;
    margin: 0;
}

.footer-column li {
    margin-bottom: 12px;
}

.footer-column a {
    color: var(--color-text-secondary);
    cursor: pointer;
    transition: color 0.2s;
}

.footer-column a:hover {
    color: var(--color-accent);
}

.security-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: var(--color-bg-secondary);
    padding: 12px 24px;
    border-radius: 8px;
    margin-bottom: 48px;
    flex-wrap: wrap;
    gap: 16px;
}

.security-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.security-text {
    font-weight: 500;
    color: var(--color-text-primary);
}

.security-link {
    color: var(--color-accent);
    cursor: pointer;
    font-weight: 500;
}

.security-right {
    display: flex;
    gap: 12px;
}

.cert-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    color: var(--color-text-primary);
}

.cert-gray {
    color: var(--color-text-tertiary);
    font-weight: 400;
}

.copyright-bar {
    display: flex;
    flex-direction: column;
    gap: 24px;
    border-top: 1px solid var(--color-border);
    padding-top: 32px;
    color: var(--color-text-secondary);
}

@media (min-width: 768px) {
    .copyright-bar {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
}

.social-links {
    display: flex;
    gap: 16px;
}

.social-links a {
    color: var(--color-text-tertiary);
    transition: color 0.2s;
}

.social-links a:hover {
    color: var(--color-text-primary);
}

.theme-toggle {
    background: none;
    border: 1px solid var(--color-border);
    padding: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--color-text-primary);
    display: flex;
    align-items: center;
    justify-content: center;
}

[data-theme="dark"] .sun-icon { display: block; }
[data-theme="dark"] .moon-icon { display: none; }
[data-theme="light"] .sun-icon { display: none; }
[data-theme="light"] .moon-icon { display: block; }

/* Hero Styles (Landing) - Enforced Light Mode */
.hero-section {
    padding: 128px 24px 64px;
    text-align: center;
    background-color: #ffffff; /* Explicit white */
    background-image: radial-gradient(circle at 50% 0%, rgba(62, 207, 142, 0.15) 0%, transparent 50%);
    color: #1a1a1a; /* Explicit dark text */
}

.hero-content {
    max-width: 800px;
    margin: 0 auto;
}

.hero-content h1 {
    font-size: 48px;
    line-height: 1.1;
    font-weight: 800;
    margin-bottom: 24px;
    letter-spacing: -0.02em;
    color: #1a1a1a; /* Explicit dark title */
}

.line-1 { display: block; }
.line-2 { 
    display: block; 
    color: #3ecf8e; /* Accent color green */
}

.subtitle {
    font-size: 20px;
    line-height: 1.5;
    color: #666666; /* Explicit grey text */
    margin-bottom: 40px;
}

.cta-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 64px;
}

/* Enforce light button styles in hero */
.hero-section .btn-secondary {
    background-color: #ffffff;
    color: #1a1a1a;
    border-color: #e6e6e6;
}

.hero-section .btn-secondary:hover {
    background-color: #f9f9f9;
}

.hero-logos {
    max-width: 1000px;
    margin: 0 auto;
    opacity: 0.6;
    mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
    -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
}

.trusted-text {
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 1px;
    color: #888888; /* Explicit grey */
    margin-top: 24px;
}

/* Stories / Features Grid */
.stories-section {
    padding: 96px 24px;
    max-width: 1200px;
    margin: 0 auto;
}

.stories-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 48px;
}

.stories-label {
    color: var(--color-accent);
    font-weight: 600;
    font-size: 14px;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-bottom: 8px;
    display: block;
}

.stories-title {
    font-size: 36px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin: 0;
}

.stories-desc {
    color: var(--color-text-secondary);
    margin-top: 8px;
    font-size: 18px;
}

.stories-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 24px;
}

@media (min-width: 768px) {
    .stories-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .stories-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.story-card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    padding: 24px;
    transition: all 0.2s;
}

.story-logo {
    margin-bottom: 16px;
}

.story-text {
    font-size: 14px;
    color: var(--color-text-secondary);
    line-height: 1.5;
}

/* Window Chrome for Dashboard Preview */
.dashboard-section {
    padding: 64px 24px;
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.dashboard-section h2 {
    font-size: 32px;
    font-weight: 700;
    color: var(--color-text-primary);
    margin-bottom: 48px;
}

.dashboard-window {
    background-color: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: 12px;
    box-shadow: var(--shadow-lg);
    overflow: hidden;
    max-width: 1000px;
    margin: 0 auto;
    aspect-ratio: 16/9;
    display: flex;
    flex-direction: column;
}

.window-chrome {
    background-color: #f0f0f0;
    border-bottom: 1px solid #e0e0e0;
    padding: 12px 16px;
    display: flex;
    gap: 8px;
}

[data-theme="dark"] .window-chrome {
    background-color: #2a2a2a;
    border-color: #333;
}

.window-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
}

.window-content {
    flex: 1;
    overflow: hidden;
    position: relative;
}
`;