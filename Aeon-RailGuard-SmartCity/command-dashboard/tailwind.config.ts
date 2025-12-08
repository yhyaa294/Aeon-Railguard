import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                kai: {
                    blue: {
                        DEFAULT: '#2D3047', // Dark Blue base
                        400: '#4DA1FF',     // Light Blue accent
                        600: '#005EB8',     // KAI Official Blue-ish
                    },
                    orange: {
                        DEFAULT: '#FFA500',
                        500: '#FF8C00',     // KAI Orange
                    },
                    slate: {
                        950: '#020617',     // Deep Space
                        900: '#0F172A',
                    }
                }
            },
            fontFamily: {
                mono: ['"Courier New"', 'Courier', 'monospace'], // Fallback for now, can import a better one later
            }
        },
    },
    plugins: [],
};
export default config;
