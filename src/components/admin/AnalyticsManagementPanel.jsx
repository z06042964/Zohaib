import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  Clock3,
  Eye,
  Loader2,
  Radio,
  TriangleAlert,
  Users,
} from "lucide-react";
import {
  formatAnalyticsTimestamp,
  subscribeAnalyticsDashboard,
} from "../../services/analytics";

function StatCard({ label, value, hint, icon: Icon, accent = "brand" }) {
  const accentClasses = {
    brand: "bg-brand-50 text-brand-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <article className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            {value.toLocaleString()}
          </p>
          {hint ? (
            <p className="mt-2 text-sm leading-relaxed text-slate-500">{hint}</p>
          ) : null}
        </div>
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
            accentClasses[accent] || accentClasses.brand
          }`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
    </article>
  );
}

function MetricBarChart({ title, description, series, valueKey = "pageViews" }) {
  const maxValue = Math.max(...series.map((item) => item[valueKey] || 0), 1);

  return (
    <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
          {title}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
      </div>

      <div className="grid h-52 grid-cols-7 items-end gap-2 sm:grid-cols-7">
        {series.map((item) => {
          const value = item[valueKey] || 0;
          const height = Math.max(8, Math.round((value / maxValue) * 100));

          return (
            <div key={item.key} className="flex min-w-0 flex-col items-center gap-2">
              <div className="flex h-full w-full items-end justify-center">
                <div
                  className="w-full max-w-10 rounded-t-xl bg-gradient-to-t from-brand-700 to-brand-400"
                  style={{ height: `${height}%` }}
                  title={`${value.toLocaleString()} ${valueKey === "uniqueVisitors" ? "visitors" : "views"}`}
                />
              </div>
              <p className="w-full truncate text-center text-[11px] font-medium text-slate-500">
                {item.label || item.key.slice(5)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default function AnalyticsManagementPanel() {
  const [stats, setStats] = useState({
    loading: true,
    realtimeActive: 0,
    liveSessions: [],
    last24Hours: { pageViews: 0, uniqueVisitors: 0 },
    last7Days: { pageViews: 0, uniqueVisitors: 0 },
    last30Days: { pageViews: 0, uniqueVisitors: 0 },
    hourlySeries: [],
    dailySeries: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeAnalyticsDashboard({
      onData: (nextStats) => {
        setStats(nextStats);
        setError("");
      },
      onError: (nextError) => {
        setError(nextError.message);
      },
    });

    return unsubscribe;
  }, []);

  const activeLiveSessions = useMemo(() => {
    const cutoff = Date.now() - 5 * 60 * 1000;

    return stats.liveSessions
      .filter((session) => (session.lastSeen?.toMillis?.() ?? 0) >= cutoff)
      .sort(
        (left, right) =>
          (right.lastSeen?.toMillis?.() ?? 0) - (left.lastSeen?.toMillis?.() ?? 0)
      )
      .slice(0, 12);
  }, [stats.liveSessions]);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
              Analytics
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Website traffic and visitor statistics
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Track real-time visitors, page views, and unique sessions from your public
              website. Data is stored in Firestore and updates live while visitors browse
              pages outside the admin area.
            </p>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-700">
            <p className="font-semibold">Firestore collections</p>
            <p className="mt-1">
              `analyticsDaily`, `analyticsHourly`, `analyticsLive`
            </p>
            <p className="mt-2 font-medium">Realtime window: last 5 minutes</p>
          </div>
        </div>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <p>{error}</p>
          </div>
        ) : null}

        {stats.loading ? (
          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-600">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Loading analytics from Firestore...
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Real-time visitors"
          value={stats.realtimeActive}
          hint="Active sessions in the last 5 minutes"
          icon={Radio}
          accent="emerald"
        />
        <StatCard
          label="Last 24 hours (visitors)"
          value={stats.last24Hours.uniqueVisitors}
          hint="Session count across hourly buckets in the last 24 hours"
          icon={Users}
          accent="brand"
        />
        <StatCard
          label="Last 7 days (visitors)"
          value={stats.last7Days.uniqueVisitors}
          hint="Daily unique sessions summed for the past 7 days"
          icon={Activity}
          accent="violet"
        />
        <StatCard
          label="Last 30 days (visitors)"
          value={stats.last30Days.uniqueVisitors}
          hint="Daily unique sessions summed for the past 30 days"
          icon={BarChart3}
          accent="amber"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="24h page views"
          value={stats.last24Hours.pageViews}
          hint="Total page views in the last 24 hours"
          icon={Eye}
        />
        <StatCard
          label="7 day page views"
          value={stats.last7Days.pageViews}
          hint="Total page views in the last 7 days"
          icon={Eye}
          accent="violet"
        />
        <StatCard
          label="30 day page views"
          value={stats.last30Days.pageViews}
          hint="Total page views in the last 30 days"
          icon={Clock3}
          accent="amber"
        />
      </div>

      <MetricBarChart
        title="Last 24 hours"
        description="Hourly page views collected from public website traffic."
        series={stats.hourlySeries}
        valueKey="pageViews"
      />

      <MetricBarChart
        title="Last 7 days"
        description="Daily unique visitors for the past week."
        series={stats.dailySeries}
        valueKey="uniqueVisitors"
      />

      <section className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-card sm:p-8">
        <div className="mb-5">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-600">
            Live traffic
          </p>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Recent active sessions and the page each visitor is currently viewing.
          </p>
        </div>

        {activeLiveSessions.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-8 text-center text-sm text-slate-500">
            No active visitors right now. Open your public website in another tab to
            test tracking.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500">
                  <th className="px-3 py-2 font-semibold">Session</th>
                  <th className="px-3 py-2 font-semibold">Current page</th>
                  <th className="px-3 py-2 font-semibold">Last seen</th>
                </tr>
              </thead>
              <tbody>
                {activeLiveSessions.map((session) => (
                  <tr key={session.id} className="border-b border-slate-50">
                    <td className="px-3 py-3 font-medium text-slate-700">
                      {session.id.slice(0, 8)}...
                    </td>
                    <td className="px-3 py-3 text-slate-600">{session.path || "/"}</td>
                    <td className="px-3 py-3 text-slate-500">
                      {formatAnalyticsTimestamp(session.lastSeen)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
