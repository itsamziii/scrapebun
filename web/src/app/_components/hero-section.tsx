"use client";
import { Button } from "~/components/ui/button";

const HeroSection = () => {
  return (
    <section className="flex min-h-screen items-center justify-center pt-20 pb-32">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-gradient animate-float mx-auto mt-20 mb-6 max-w-4xl text-4xl leading-tight font-bold md:text-6xl lg:text-7xl">
          AI Agents That Work For You, Not The Other Way Around
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70 md:text-xl">
          Automate complex tasks, extract data from any source, and generate
          insights with our powerful AI agents platform.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            size="lg"
            className="rounded-lg border-white/20 bg-white/5 px-8 py-6 text-lg text-white hover:bg-white/10"
          >
            <a href="/dashboard">Get Started</a>
          </Button>
        </div>
        <div className="mt-16 grid grid-cols-2 gap-4 text-center md:grid-cols-4">
          <div className="glass-morphism animate-float rounded-xl p-4">
            <p className="mb-1 text-3xl font-bold text-white">99.9%</p>
            <p className="text-sm text-white/50">Scraping Accuracy</p>
          </div>
          <div
            className="glass-morphism animate-float rounded-xl p-4"
            style={{ animationDelay: "0.2s" }}
          >
            <p className="mb-1 text-3xl font-bold text-white">1.8s</p>
            <p className="text-sm text-white/50">Avg Scrape Time</p>
          </div>
          <div
            className="glass-morphism animate-float rounded-xl p-4"
            style={{ animationDelay: "0.4s" }}
          >
            <p className="mb-1 text-3xl font-bold text-white">1000+</p>
            <p className="text-sm text-white/50">Websites Supported</p>
          </div>
          <div
            className="glass-morphism animate-float rounded-xl p-4"
            style={{ animationDelay: "0.6s" }}
          >
            <p className="mb-1 text-3xl font-bold text-white">15k+</p>
            <p className="text-sm text-white/50">Inferences Gathered</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
