import SectionHeading from "../ui/SectionHeading";
import StepCard from "../ui/StepCard";
import { STEPS } from "../../constants/steps";

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="bg-gradient-to-b from-slate-50 to-white py-20 sm:py-28"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow="How It Works"
          title="Three simple steps to perfect images"
          subtitle="No complicated setup. Upload, process, and download — it's that easy."
          className="mb-16"
        />

        <div className="relative grid gap-12 md:grid-cols-3 md:gap-8">
          <div
            className="absolute top-8 hidden h-0.5 w-full bg-gradient-to-r from-transparent via-brand-200 to-transparent md:block"
            aria-hidden="true"
          />
          {STEPS.map((step) => (
            <StepCard key={step.step} {...step} />
          ))}
        </div>
      </div>
    </section>
  );
}
