import { useState } from "react";
import SectionHeading from "../ui/SectionHeading";
import AccordionItem from "../ui/AccordionItem";
import { FAQ_ITEMS } from "../../constants/faq";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const handleToggle = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section
      id="faq"
      className="bg-gradient-to-b from-white to-slate-50 py-20 sm:py-28"
    >
      <div className="section-container">
        <SectionHeading
          eyebrow="FAQ"
          title="Frequently asked questions"
          subtitle="Got questions? We've got answers. Can't find what you need? Contact us anytime."
          className="mb-14"
        />

        <div className="mx-auto max-w-3xl space-y-4">
          {FAQ_ITEMS.map((item, index) => (
            <AccordionItem
              key={item.question}
              id={index}
              question={item.question}
              answer={item.answer}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
