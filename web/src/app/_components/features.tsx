import { CodeXml, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "~/components/ui/button";
import Link from "next/link";

function FeatureSection() {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="text-gradient animate-float mb-4 text-3xl font-bold md:text-4xl">
            Powerful AI Agents for Every Task
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-white/70">
            Our platform offers specialized AI agents for different tasks, each
            designed to deliver exceptional results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-2">
          <div className="glass-morphism hover-scale rounded-2xl p-6">
            <div className="bg-ai-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <CodeXml className="text-ai-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Web Scraper
            </h3>
            <p className="mb-4 text-white/70">
              Extract data from any website with our intelligent scraping
              agents. No coding required.
            </p>
            <Button
              variant="link"
              className="text-ai-primary hover:text-ai-light p-0"
            >
              <Link href="/dashboard" className="flex items-center">
                Try it out <ArrowRight className="ml-1" size={16} />
              </Link>
            </Button>
          </div>

          {/* <div className="glass-morphism hover-scale rounded-2xl p-6">
            <div className="bg-ai-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <BarChart3 className="text-ai-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Data Analyzer
            </h3>
            <p className="mb-4 text-white/70">
              Process and analyze large datasets to uncover patterns and
              generate insights.
            </p>
            <Button
              variant="link"
              className="text-ai-primary hover:text-ai-light p-0"
            >
              <Link href="/dashboard" className="flex items-center">
                Try it out <ArrowRight className="ml-1" size={16} />
              </Link>
            </Button>
          </div> */}

          <div className="glass-morphism hover-scale rounded-2xl p-6">
            <div className="bg-ai-primary/20 mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
              <Sparkles className="text-ai-primary" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white">
              Text Summarizer
            </h3>
            <p className="mb-4 text-white/70">
              Generate concise summaries from long documents.
            </p>
            <Button
              variant="link"
              className="text-ai-primary hover:text-ai-light p-0"
            >
              <Link href="/dashboard" className="flex items-center">
                Try it out <ArrowRight className="ml-1" size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default FeatureSection;
