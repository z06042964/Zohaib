import { ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export default function CTA() {
  return (
    <section className="py-16 sm:py-20">
      <div className="section-container">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-violet-600 to-purple-700 px-8 py-14 text-center shadow-glow sm:px-16 sm:py-16">
          <div
            className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/10 blur-2xl"
            aria-hidden="true"
          />

          <h2 className="relative text-3xl font-bold text-white sm:text-4xl">
            Ready to transform your images?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Start using our free AI tools today. No signup required.
          </p>
          <div className="relative mt-8">
            <Button
              href="/#tools"
              variant="secondary"
              size="lg"
              className="border-0 bg-white text-brand-700 hover:bg-brand-50"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
