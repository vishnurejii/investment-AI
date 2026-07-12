/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0B0F14",
        panel: "#131A22",
        panelLight: "#1B242E",
        line: "#2A3542",
        muted: "#7C8B99",
        paper: "#E8EDF2",
        invest: "#35D07F",
        pass: "#FF6B4A",
        gold: "#D9A441",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
