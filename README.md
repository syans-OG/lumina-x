# Lumina X - 3D Animation Website 

A premium high-fidelity 3D product landing page featuring cinematics, scroll-driven storytelling, and interactive configurators.

![Lumina X Banner](public/screenshots/preview.png)

## 🌟 Key Features

*   **Cinematic Intro**: 3D Text Reveal with dramatic lighting and camera movements.
*   **Scroll-Driven Experience**: Seamless transitions between sections using GSAP ScrollTrigger.
*   **3D Product Configurator**: Interactive color switching and rotation (using React Three Fiber).
*   **Technical Specifications**: Holo-style spec cards with tilt effects.
*   **Comparison Visualizer**: Interactive "Signal vs Noise" audio comparison demo.
*   **Responsive Design**: Mobile-first architecture with custom hamburger menu and touch controls.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
*   **3D Engine**: [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) (Three.js)
*   **Animation**: [GSAP](https://gsap.com/) & [Framer Motion](https://www.framer.com/motion/)
*   **State Management**: [Zustand](https://github.com/pmndrs/zustand)
*   **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
src/
├── app/               # Next.js App Router pages
├── components/
│   ├── canvas/        # 3D R3F Components (Scene, Model, Lights)
│   ├── dom/           # UI Components (Hero, Header, Specs)
│   └── ...
├── lib/               # Utilities and store (utils.ts, store.ts)
└── public/            # Static assets (3D models, images)
```

## 📦 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
