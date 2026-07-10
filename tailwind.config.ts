import type { Config } from "tailwindcss";

// LinkEarn design tokens — a "ledger + ticker" theme.
// Deliberately not the neon-cyan/purple glassmorphism look of shortener-clone
// templates: flat surfaces, hairline rules, tabular numerals, one warm
// amber accent standing in for "money," one mint accent for "paid/success."
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#0B0D10",
          900: "#12151A",
          800: "#191D24",
          700: "#242933",
          600: "#343B47",
        },
        paper: "#EDEAE2",
        amber: {
          DEFAULT: "#F2B705",
          soft: "#F7D154",
          dim: "#7A5E10",
        },
        mint: {
          DEFAULT: "#3DDC97",
          dim: "#1F6B4C",
        },
        rose: {
          DEFAULT: "#E5484D",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      backgroundImage: {
        "ledger-lines":
          "repeating-linear-gradient(180deg, rgba(237,234,226,0.035) 0px, rgba(237,234,226,0.035) 1px, transparent 1px, transparent 40px)",
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(237,234,226,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
