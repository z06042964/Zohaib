import { useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { Loader2, LogIn } from "lucide-react";
import Button from "../../components/ui/Button";
import AdminAuthLayout from "../../components/admin/AdminAuthLayout";
import AdminLoadingScreen from "../../components/admin/AdminLoadingScreen";
import { useAuth } from "../../context/AuthContext";
import { getFirebaseAuthMessage } from "../../lib/firebaseAuthMessages";
import usePageMeta from "../../hooks/usePageMeta";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3.5 text-slate-900 placeholder:text-slate-400 transition-colors focus:border-transparent focus:outline-none focus:ring-2 focus:ring-brand-500";

export default function AdminLogin() {
  const { user, loading, signIn } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || "/admin";

  usePageMeta({
    title: "Admin Login | Imgoraa",
    description: "Secure login for the Imgoraa admin panel.",
    robots: "noindex,nofollow",
    canonical: "https://imgoraa.com/admin/login",
  });

  if (loading) {
    return <AdminLoadingScreen label="Preparing login..." />;
  }

  if (user) {
    return <Navigate to={redirectPath} replace />;
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
    setSubmitting(true);
    setError("");

    try {
      await signIn(form.email.trim(), form.password);
    } catch (authError) {
      setError(getFirebaseAuthMessage(authError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminAuthLayout
      eyebrow="Admin Login"
      title="Welcome back"
      subtitle="Sign in with your Firebase admin account to access the Imgoraa admin panel."
      footer={
        <>
          Don&apos;t have an account yet?{" "}
          <Link to="/admin/signup" className="font-semibold text-brand-600 hover:underline">
            Create one here
          </Link>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSubmit}>
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
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your password"
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
              Signing in...
            </>
          ) : (
            <>
              <LogIn className="h-5 w-5" aria-hidden="true" />
              Login to Admin
            </>
          )}
        </Button>
      </form>
    </AdminAuthLayout>
  );
}
