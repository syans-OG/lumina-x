"use client";

import Hero from "@/components/dom/Hero";
import SceneContainer from "@/components/dom/SceneContainer";
import Footer from "@/components/Footer";
import GenerativeBackground from "@/components/dom/GenerativeBackground";
import ScrambleText from "@/components/dom/ScrambleText";
import { Battery, Bluetooth, Weight } from "lucide-react";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useStore } from "@/store";
import { useUISound } from "@/hooks/useUISound";
import StickyNav from "@/components/dom/StickyNav";
import InTheBox from "@/components/dom/InTheBox";
import TrustGrid from "@/components/dom/TrustGrid";
import { useAmbientSound } from "@/hooks/useAmbientSound";
import ToastContainer from "@/components/dom/Toast";
import CartDrawer from "@/components/dom/CartDrawer";
import dynamic from "next/dynamic";

// Lazy load heavy below-fold components
const ComparisonSection = dynamic(() => import("@/components/dom/ComparisonSection"), {
  loading: () => <div className="min-h-screen" />,
});
const TechSpecsTable = dynamic(() => import("@/components/dom/TechSpecsTable"), {
  loading: () => <div className="min-h-screen" />,
});
const FAQ = dynamic(() => import("@/components/dom/FAQ"), {
  loading: () => <div className="min-h-[50vh]" />,
});

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const container = useRef<HTMLDivElement>(null);
  const configuratorRef = useRef<HTMLDivElement>(null);
  const { activeColor, setColor } = useStore();
  const { playHover, playClick } = useUISound();
  const { updateScroll } = useAmbientSound();

  const colors = [
    { name: "Midnight Black", value: "#1a1a1a", border: "border-gray-600" },
    { name: "Stellar Silver", value: "#c0c0c0", border: "border-gray-300" },
    { name: "Nebula Blue", value: "#3b82f6", border: "border-blue-500" },
  ];

  useGSAP(() => {
    const rightCards = gsap.utils.toArray<HTMLElement>(".animate-text-right-mask");
    rightCards.forEach((card) => {
      const children = card.querySelectorAll("span");
      if (children.length > 0) {
        gsap.fromTo(children,
          { y: "100%" },
          {
            y: "0%",
            duration: 1.5,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card.parentElement,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            }
          }
        );
      } else {
        gsap.fromTo(card, { y: "100%" }, { y: "0%", duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: card.parentElement, start: "top 85%", end: "bottom 15%", toggleActions: "play reverse play reverse" } });
      }
    });

    const leftCards = gsap.utils.toArray<HTMLElement>(".animate-text-left-mask");
    leftCards.forEach((card) => {
      const children = card.querySelectorAll("span");
      if (children.length > 0) {
        gsap.fromTo(children,
          { y: "100%" },
          {
            y: "0%",
            duration: 1.5,
            stagger: 0.1,
            ease: "power4.out",
            scrollTrigger: {
              trigger: card.parentElement,
              start: "top 85%",
              end: "bottom 15%",
              toggleActions: "play reverse play reverse",
            },
          }
        );
      } else {
        gsap.fromTo(card, { y: "100%" }, { y: "0%", duration: 1.5, ease: "power4.out", scrollTrigger: { trigger: card.parentElement, start: "top 85%", end: "bottom 15%", toggleActions: "play reverse play reverse" } });
      }
    });

    const bentoCards = gsap.utils.toArray<HTMLElement>(".animate-bento-card");
    bentoCards.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, scale: 0.8, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          ease: "elastic.out(1, 0.5)",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 10%",
            toggleActions: "play reverse play reverse",
          },
        }
      );
    });

    gsap.set(configuratorRef.current, { y: 50, autoAlpha: 0 });
    gsap.to(configuratorRef.current, { y: 0, autoAlpha: 1, duration: 1, delay: 1, ease: "power3.out" });

    let scrollTimeout: NodeJS.Timeout;
    ScrollTrigger.create({
      trigger: container.current,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          updateScroll(self.getVelocity());
        }, 50);

        if (configuratorRef.current) {
          if (self.scroll() > window.innerHeight * 0.8) {
            gsap.to(configuratorRef.current, { autoAlpha: 0, y: 20, duration: 0.5, overwrite: true });
          } else {
            gsap.to(configuratorRef.current, { autoAlpha: 1, y: 0, duration: 0.5, overwrite: true });
          }
        }
      }
    });

    ScrollTrigger.create({
      trigger: ".section-specs",
      start: "top center",
      end: "bottom center",
      onEnter: () => useStore.getState().setAllowRotation(true),
      onEnterBack: () => useStore.getState().setAllowRotation(true),
      onLeave: () => useStore.getState().setAllowRotation(false),
      onLeaveBack: () => useStore.getState().setAllowRotation(false),
    });

  }, { scope: container });

  return (
    <main ref={container} className="relative w-full bg-canvas text-white selection:bg-blue-500/30">
      <StickyNav />
      <ToastContainer />
      <CartDrawer />

      <div id="immersive-wrapper" className="relative w-full">

        <div className="sticky top-0 h-screen w-full z-0 overflow-hidden pointer-events-none">
          <SceneContainer className="w-full h-full" />
        </div>

        <div className="relative z-10 -mt-[100vh]">

          <div className="relative h-screen w-full pointer-events-none">
            <Hero />
          </div>

          <section id="overview" className="relative min-h-screen w-full flex flex-col justify-center pointer-events-none">
            <div className="absolute top-[20%] left-[5%] md:left-[10%] z-10 mix-blend-difference">
              <h2 className="animate-text-left-mask text-[12vw] leading-[0.8] font-display font-bold uppercase tracking-tighter opacity-80 overflow-hidden">
                <span className="block">Precision</span>
              </h2>
            </div>

            <div className="absolute top-[35%] right-[5%] md:right-[15%] z-10">
              <h2 className="animate-text-right-mask text-[12vw] leading-[0.8] font-display font-bold uppercase tracking-tighter text-transparent stroke-text-white opacity-50 overflow-hidden">
                <span className="block">Audio</span>
              </h2>
            </div>

            <div className="relative mt-[40vh] ml-auto mr-[10%] max-w-sm md:max-w-md bg-black/20 backdrop-blur-sm border-l border-white/20 p-8 pointer-events-auto">
              <span className="text-blue-400 text-xs font-mono tracking-[0.2em] mb-4 block">
                      /// 01 — FREQUENCY
              </span>
              <p className="text-white/80 text-lg leading-relaxed font-light">
                Experience frequencies distinct from reality. Our Bio-Cellulose drivers mimic organic resonance, delivering sound that feels like a physical extension of your neural pathways.
              </p>
              <div className="mt-8 flex justify-between text-[10px] text-white/40 font-mono tracking-widest uppercase">
                <span>R: 5Hz-50kHz</span>
                <span>S: 110dB</span>
              </div>
            </div>
          </section>

          <section className="relative min-h-screen w-full flex items-center pointer-events-none">
            <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/20 to-transparent transform rotate-[15deg] origin-top-right" />

            <div className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 hidden md:block">
              <h2 className="text-white/20 text-9xl font-display font-bold uppercase tracking-widest writing-vertical-rl rotate-180">
                TITANIUM
              </h2>
            </div>

            <div className="container mx-auto px-6 md:px-24">
              <div className="max-w-xl pointer-events-auto">
                <div className="overflow-hidden">
                  <h2 className="animate-text-left-mask text-6xl md:text-8xl font-display font-medium uppercase tracking-tighter text-white mb-8">
                    <span className="block">Grade 5</span>
                    <span className="block text-transparent stroke-text-white">Alloy.</span>
                  </h2>
                </div>
                <div className="pl-4 border-l-2 border-blue-500/50">
                  <p className="text-white/70 text-xl font-light max-w-md">
                    Aerospace-grade Ti-6Al-4V. <br />
                    250g of pure structural integrity. <br />
                    Cold into the touch. Impossible to break.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section id="specs" className="section-specs relative min-h-screen w-full flex flex-col items-center justify-center pointer-events-none">
            <div className="w-full max-w-7xl mx-auto h-screen relative pointer-events-none z-10">
              <div className="absolute top-[10%] left-1/2 -translate-x-1/2 pointer-events-none animate-pulse z-20">
                <span className="text-[10px] uppercase tracking-[0.3em] text-white/50 border border-white/10 px-3 py-1 rounded-full backdrop-blur-md">
                  Drag to Rotate 360°
                </span>
              </div>

              <svg className="absolute inset-0 w-full h-full z-0 opacity-20 pointer-events-none stroke-blue-500 stroke-1">
                <path d="M 20% 15% L 40% 15% L 50% 35%" fill="none" className="md:block hidden" />
                <path d="M 20% 85% L 40% 85% L 50% 65%" fill="none" className="md:block hidden" />
                <path d="M 80% 15% L 60% 15% L 50% 35%" fill="none" className="md:block hidden" />
                <path d="M 80% 85% L 60% 85% L 50% 65%" fill="none" className="md:block hidden" />
                <circle cx="20%" cy="15%" r="3" fill="white" className="md:block hidden" />
                <circle cx="20%" cy="85%" r="3" fill="white" className="md:block hidden" />
                <circle cx="80%" cy="15%" r="3" fill="white" className="md:block hidden" />
                <circle cx="80%" cy="85%" r="3" fill="white" className="md:block hidden" />
              </svg>

              <div className="absolute left-[5%] md:left-[15%] animate-bento-card pointer-events-auto z-20" style={{ top: '15%' }}>
                <div className="flex flex-col items-start group">
                  <span className="h-[1px] w-12 md:w-24 bg-blue-500 mb-2 transition-all duration-500 group-hover:w-full box-shadow-[0_0_10px_#3b82f6]" />
                  <h3 className="text-4xl md:text-6xl font-mono text-white font-bold drop-shadow-lg cursor-default">
                    <ScrambleText text="30" />
                    <span className="text-xl md:text-2xl text-white/50">h</span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-blue-400 uppercase tracking-widest mt-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/5 shadow-sm">Runtime</p>
                </div>
              </div>

              <div className="absolute left-[5%] md:left-[15%] animate-bento-card pointer-events-auto z-20" style={{ bottom: '25%' }}>
                <div className="flex flex-col items-start gap-2">
                  <span className="text-[10px] md:text-xs text-blue-400 uppercase tracking-widest bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/5 mb-1 shadow-sm">Customization</span>
                  <div className="flex gap-3 p-3 bg-black/40 backdrop-blur-xl border border-white/10 rounded-2xl">
                    {colors.map((color) => (
                      <button
                        key={color.name}
                        suppressHydrationWarning
                        onClick={() => { playClick(); setColor(color.value); }}
                        onMouseEnter={playHover}
                        className={`w-6 h-6 rounded-full border border-white/20 transition-all duration-300 ${activeColor === color.value
                          ? `scale-125 shadow-[0_0_15px_${color.value}] border-white`
                          : "opacity-60 hover:opacity-100 hover:scale-110"
                          }`}
                        style={{ backgroundColor: color.value }}
                        aria-label={`Select ${color.name}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="absolute right-[5%] md:right-[15%] animate-bento-card pointer-events-auto text-right z-20" style={{ top: '15%' }}>
                <div className="flex flex-col items-end group">
                  <span className="h-[1px] w-12 md:w-24 bg-blue-500 mb-2 transition-all duration-500 group-hover:w-full box-shadow-[0_0_10px_#3b82f6]" />
                  <h3 className="text-4xl md:text-6xl font-mono text-white font-bold drop-shadow-lg cursor-default">
                    <ScrambleText text="250" />
                    <span className="text-xl md:text-2xl text-white/50">g</span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-blue-400 uppercase tracking-widest mt-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/5 shadow-sm">Featherweight</p>
                </div>
              </div>

              <div className="absolute right-[5%] md:right-[15%] animate-bento-card pointer-events-auto text-right z-20" style={{ bottom: '25%' }}>
                <div className="flex flex-col items-end group">
                  <span className="h-[1px] w-12 md:w-24 bg-blue-500 mb-2 transition-all duration-500 group-hover:w-full box-shadow-[0_0_10px_#3b82f6]" />
                  <h3 className="text-4xl md:text-6xl font-mono text-white font-bold drop-shadow-lg cursor-default">
                    <ScrambleText text="5.4" />
                    <span className="text-xl md:text-2xl text-white/50">BT</span>
                  </h3>
                  <p className="text-[10px] md:text-xs text-blue-400 uppercase tracking-widest mt-1 bg-black/50 backdrop-blur-md px-2 py-1 rounded border border-white/5 shadow-sm">Connectivity</p>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      <GenerativeBackground />

      <div className="relative z-10">
        <TechSpecsTable />
        <div id="compare">
          <ComparisonSection />
        </div>
        <InTheBox />
        <TrustGrid />
        <FAQ />
        <Footer />
      </div>

      <style jsx global>{`
        .stroke-text-white {
            -webkit-text-stroke: 1px rgba(255,255,255,0.3);
        }
        .writing-vertical-rl {
            writing-mode: vertical-rl;
        }
      `}</style>
    </main>
  );
}
