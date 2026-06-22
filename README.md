# ToolVerse

![ToolVerse](https://toolverse.com/og-image.png)

> Modern online tools platform with AI, Image, PDF, Coding, SEO, Text, and Productivity tools.

ToolVerse is the definitive collection of 200+ free online tools for developers, designers, and creators. It is built with a strong focus on privacy, performing operations client-side via WebAssembly whenever possible so your data never leaves your device.

## Features
- **⚡ Blazing Fast:** Built with React, Vite, and highly optimized code splitting.
- **🛡️ Privacy First:** Local client-side processing using WebAssembly (WASM).
- **🎨 Modern Design:** Premium UI with Glassmorphism, TailwindCSS, and Radix UI primitives.
- **📱 Responsive:** Fully usable on desktop, tablet, and mobile devices.
- **🔍 SEO Optimized:** Pre-rendered sitemaps, meta tags, structured data, and PWA ready.
- **🤖 AI Integration:** Access robust AI tools using WebGPU and client-side models.

## Technology Stack
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** TailwindCSS 4
- **Routing:** React Router v7
- **State Management:** Zustand
- **Icons:** Lucide React
- **Hosting:** Cloudflare Pages (Static)

## Installation & Development

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/toolverse.git
cd toolverse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Build & Deployment

This project is fully optimized for **Cloudflare Pages**.

### 1. Build for Production
```bash
npm run build
```
This command also automatically generates the `sitemap.xml`!

### 2. Preview Production Build
```bash
npm run preview
```

### 3. Cloudflare Pages Setup
- **Framework Preset:** `Vite`
- **Build Command:** `npm run build`
- **Build Output Directory:** `dist`
- **Node.js Version:** `20` (Set as environment variable `NODE_VERSION=20`)

## Folder Structure

```
toolverse/
├── public/              # Static assets, manifests, robots.txt, _headers, _redirects
├── src/
│   ├── assets/          # Global CSS and images
│   ├── components/      # Reusable React components (UI, layouts, specific tools)
│   ├── context/         # React Context providers
│   ├── data/            # Static data configurations (Tool lists, categories)
│   ├── features/        # Feature-based module organization (e.g. MCP)
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Route-level React components
│   ├── store/           # Zustand global state stores
│   ├── types/           # TypeScript interface definitions
│   ├── utils/           # Helper functions
│   ├── App.tsx          # Main application router
│   └── main.tsx         # Application entry point
├── scripts/             # Build scripts (e.g., sitemap generator)
├── index.html           # HTML Template
├── package.json         # Dependencies and scripts
├── vite.config.ts       # Vite bundler configuration
└── tailwind.config.js   # Tailwind CSS configuration
```

## Security & Privacy
No user inputs are permanently stored. We utilize LocalStorage combined with `Zustand` persist to save tool preferences securely on the client machine. API keys for AI functionalities are never hardcoded and must be provided via environment variables (`.env`).

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Author
Built by ToolVerse.
