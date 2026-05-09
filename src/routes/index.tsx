import { createFileRoute, Link } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { AnimatedHeading } from "@/components/AnimatedHeading";
import { FadeIn } from "@/components/FadeIn";
import { useEffect, useRef, useState } from "react";
import { Wallet, Wrench, BarChart3, Check } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Landyflow — Property management for small landlords" },
      { name: "description", content: "Manage rent, tenants, and maintenance for 1–10 rental units. Built for South African landlords." },
      { property: "og:title", content: "Landyflow — Property management for small landlords" },
      { property: "og:description", content: "Manage rent, tenants, and maintenance — all in one place." },
    ],
  }),
  component: Landing,
});

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const ob = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setVisible(true);
      },
      { threshold: 0.15 }
    );
    ob.observe(ref.current);
    return () => ob.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 700ms ease ${delay}ms, transform 700ms ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Landing() {
  return (
    <div className="min-h-screen bg-black text-white page-fade">
      {/* Hero */}
      <section className="relative min-h-screen flex flex-col">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        />
        <div className="relative z-10 flex flex-col flex-1">
          <Navbar />
          <div className="flex-1 flex flex-col justify-end px-6 md:px-12 lg:px-16 pb-12 lg:pb-16">
            <div className="grid lg:grid-cols-2 gap-8 items-end">
              <div>
                <AnimatedHeading
                  text={"Property management,\nbuilt for the small landlord."}
                  className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal text-white"
                />
                <FadeIn delay={800}>
                  <p className="mt-6 text-lg text-gray-300 max-w-xl">
                    Manage rent, tenants, and maintenance — all in one place.
                  </p>
                </FadeIn>
                <FadeIn delay={1200}>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link to="/signup" className="btn-primary">Start for Free</Link>
                    <a href="#features" className="btn-glass liquid-glass">See How It Works</a>
                  </div>
                </FadeIn>
              </div>
              <FadeIn delay={1400} className="lg:justify-self-end">
                <div className="liquid-glass border border-white/20 rounded-2xl px-6 py-4 inline-flex items-center gap-3">
                  <span className="status-dot status-green" />
                  <span className="text-sm text-gray-200">Rent. Tenants. Maintenance.</span>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 md:px-12 lg:px-16 py-24">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-normal mb-12">Everything you need, nothing you don't.</h2>
        </Reveal>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: Wallet, title: "Rent Tracking", desc: "Log payments, flag late rent, and see who owes what at a glance." },
            { icon: Wrench, title: "Maintenance Scheduler", desc: "Schedule jobs, track contractors, and keep a full repair history." },
            { icon: BarChart3, title: "Finance Summary", desc: "Income vs expenses per property, ready for SARS tax season." },
          ].map((f, i) => (
            <Reveal key={f.title} delay={i * 120}>
              <div className="liquid-glass border border-white/20 rounded-xl p-6 h-full">
                <f.icon className="w-7 h-7 mb-4 text-white" />
                <h3 className="text-xl font-medium mb-2">{f.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 md:px-12 lg:px-16 pb-32">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-normal mb-12">Simple pricing.</h2>
        </Reveal>
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
          <Reveal>
            <div className="liquid-glass border border-white/20 rounded-2xl p-8 h-full flex flex-col">
              <h3 className="text-2xl font-medium">Free</h3>
              <p className="text-gray-300 mt-1 text-sm">Get started in under a minute.</p>
              <div className="mt-6 text-4xl font-normal">R0<span className="text-base text-gray-300">/month</span></div>
              <ul className="mt-6 space-y-3 text-sm text-gray-300 flex-1">
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> 1 property, 1 tenant</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Basic rent tracking</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Maintenance log</li>
              </ul>
              <Link to="/signup" className="btn-glass liquid-glass mt-8 w-full">Start Free</Link>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="liquid-glass border border-white/40 rounded-2xl p-8 h-full flex flex-col">
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-medium">Pro</h3>
                <span className="text-xs px-2 py-1 rounded-md bg-white text-black font-medium">Recommended</span>
              </div>
              <p className="text-gray-300 mt-1 text-sm">For active landlords.</p>
              <div className="mt-6 text-4xl font-normal">R149<span className="text-base text-gray-300">/month</span></div>
              <p className="text-xs text-gray-300 mt-1">or R999/year — save R789</p>
              <ul className="mt-6 space-y-3 text-sm text-gray-300 flex-1">
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Unlimited properties & tenants</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Email rent reminders</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> CSV export for SARS</li>
                <li className="flex gap-2"><Check className="w-4 h-4 text-white" /> Document storage</li>
              </ul>
              <Link to="/signup" className="btn-primary mt-8 w-full">Go Pro</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <footer className="px-6 md:px-12 lg:px-16 py-8 border-t border-white/10 text-sm text-gray-300 flex flex-wrap justify-between gap-4">
        <span>© 2026 Landyflow</span>
        <span>Built for South African landlords. Tax year: March – February.</span>
      </footer>
    </div>
  );
}
