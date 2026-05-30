import { ChevronDown } from "lucide-react";

export default function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
  id,
}) {
  const panelId = `faq-panel-${id}`;
  const buttonId = `faq-button-${id}`;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft transition-colors duration-300 hover:border-brand-200">
      <h3>
        <button
          id={buttonId}
          type="button"
          className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-slate-900 transition-colors hover:text-brand-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500"
          onClick={onToggle}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span>{question}</span>
          <ChevronDown
            className={`h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-brand-600" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      </h3>
      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        className={`grid transition-all duration-300 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          <p className="px-6 pb-5 text-slate-600 leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}
