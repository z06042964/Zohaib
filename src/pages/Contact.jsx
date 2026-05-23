import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
} from "lucide-react";
import Button from "../components/ui/Button";

const CONTACT_INFO = [
  {
    icon: Mail,
    title: "Email us",
    description: "We typically respond within 24–48 hours.",
    value: "contact@pixelcraft.ai",
    href: "mailto:contact@pixelcraft.ai",
  },
  {
    icon: Clock,
    title: "Support hours",
    description: "Monday to Friday, 9 AM – 6 PM (UTC).",
    value: "Weekdays only",
    href: null,
  },
  {
    icon: MessageCircle,
    title: "Quick answers",
    description: "Check our FAQ for common questions.",
    value: "View FAQ",
    href: "/#faq",
  },
];

const INITIAL_FORM = {
  name: "",
  email: "",
  subject: "",
  message: "",
};

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const next = {};
    if (!form.name.trim()) next.name = "Name is required.";
    if (!form.email.trim()) {
      next.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Please enter a valid email address.";
    }
    if (!form.subject.trim()) next.subject = "Subject is required.";
    if (!form.message.trim()) next.message = "Message is required.";
    return next;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const subject = encodeURIComponent(`[PixelCraft] ${form.subject}`);
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`
    );
    window.location.href = `mailto:contact@pixelcraft.ai?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const inputClass = (field) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-slate-900 placeholder:text-slate-400 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent ${
      errors[field] ? "border-red-300" : "border-slate-200"
    }`;

  return (
    <main className="pt-24 pb-16 sm:pt-28 sm:pb-24">
      <div className="section-container">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition-colors hover:text-brand-600"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to Home
        </Link>

        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <span className="mb-3 inline-block rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-brand-600">
              Get in touch
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Have a question, feedback, or need help with our tools? We&apos;d
              love to hear from you.
            </p>
          </div>

          <div className="mb-12 grid gap-6 sm:grid-cols-3">
            {CONTACT_INFO.map(({ icon: Icon, title, description, value, href }) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-soft transition-all hover:border-brand-200 hover:shadow-card"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-50 to-violet-50 text-brand-600">
                  <Icon className="h-6 w-6" strokeWidth={1.75} aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-500">{description}</p>
                {href ? (
                  <a
                    href={href}
                    className="mt-3 inline-block text-sm font-medium text-brand-600 hover:underline"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-3 text-sm font-medium text-slate-700">{value}</p>
                )}
              </div>
            ))}
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-soft">
            <div className="border-b border-slate-100 bg-gradient-to-r from-brand-50 to-violet-50 px-6 py-5 sm:px-8">
              <h2 className="text-lg font-bold text-slate-900">Send us a message</h2>
              <p className="mt-1 text-sm text-slate-600">
                Fill out the form and your email app will open with your message
                ready to send.
              </p>
            </div>

            {submitted ? (
              <div className="flex flex-col items-center px-6 py-16 text-center sm:px-8">
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle className="h-8 w-8" aria-hidden="true" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  Your email app should open shortly
                </h3>
                <p className="mt-2 max-w-md text-slate-600">
                  If it didn&apos;t open, email us directly at{" "}
                  <a
                    href="mailto:contact@pixelcraft.ai"
                    className="font-medium text-brand-600 hover:underline"
                  >
                    contact@pixelcraft.ai
                  </a>
                </p>
                <Button
                  variant="secondary"
                  className="mt-8"
                  onClick={() => {
                    setSubmitted(false);
                    setForm(INITIAL_FORM);
                  }}
                >
                  Send another message
                </Button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-6 px-6 py-8 sm:px-8"
                noValidate
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Full name
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className={inputClass("name")}
                      autoComplete="name"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Email address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={inputClass("email")}
                      autoComplete="email"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    className={inputClass("subject")}
                  />
                  {errors.subject && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your question or feedback..."
                    className={`${inputClass("message")} resize-y min-h-[120px]`}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600" role="alert">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button type="submit" size="lg" className="w-full sm:w-auto">
                  <Send className="h-5 w-5" aria-hidden="true" />
                  Send Message
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
