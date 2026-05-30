import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { Loader2, UserPlus } from "lucide-react";
import Button from "../../components/ui/Button";
import AdminAuthLayout from "../../components/admin/AdminAuthLayout";
import AdminLoadingScreen from "../../components/admin/AdminLoadingScreen";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseAuthMessage } from "../../lib/firebaseAuthMessages";
import usePageMeta from "../../hooks/usePageMeta";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function AdminSignup() {
  const { user, loading, signUp } = useAuth();
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  usePageMeta({
    title: "Admin Signup | Imgoraa",
    description: "Create a new Firebase admin account for Imgoraa.",
    robots: "noindex,nofollow",
    canonical: "https://imgoraa.com/admin/signup",
  });

  if (loading) {
    return <AdminLoadingScreen label="Preparing signup..." />;
  }

  if (user) {
    return <Navigate to="/admin" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (form.password.length < 6) {
      setError("Password should be at least 6 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setSubmitting(true);

    try {
      await signUp({
        fullName: form.fullName,
        email: form.email.trim(),
        password: form.password,
      });
    } catch (authError) {
      setError(getFirebaseAuthMessage(authError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout
      eyebrow="Admin Signup"
      title="Create admin account"
      subtitle="Register a new admin user with Firebase Authentication to unlock the protected Imgoraa dashboard."
      footer={
        <>
          Already have an admin account?{" "}
          <Link to="/admin/login" className="font-semibold text-brand-600 hover:underline">
            Sign in instead
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="fullName"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Full name
          </label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Zohaib Khan"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            placeholder="admin@imgoraa.com"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Minimum 6 characters"
            className={inputClass}
            required
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            className={inputClass}
            required
          />
        </div>

        {error ? (
          <div
            className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              Creating account...
            </>
          ) : (
            <>
              <UserPlus className="h-5 w-5" aria-hidden="true" />
              Create Admin Account
            </>
          )}
        </Button>
      </form>
    </AdminAuthLayout>
  );
}
