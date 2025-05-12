import { Button } from "~/components/ui/button";
import Link from "next/link";
import { Zap } from "lucide-react";

function CTA_Section() {
  return (
    <div>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div
            className="glass-morphism animate-float rounded-3xl p-8 text-center md:p-12"
            style={{ animationDelay: "0.3s" }}
          >
            <h2 className="text-gradient mb-6 text-3xl font-bold md:text-4xl">
              Ready to experience the power of AI agents?
            </h2>
            <p className="mx-auto mb-8 max-w-2xl text-lg text-white/70">
              Get started today and see how our AI agents can transform your
              workflow.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-ai-primary hover:bg-ai-secondary animate-pulse-gentle rounded-lg px-8 py-6 text-lg text-white"
            >
              <Link href="/dashboard">
                Get Started Now <Zap className="ml-2" size={18} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default CTA_Section;
