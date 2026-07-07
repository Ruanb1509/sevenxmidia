import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  DollarSign,
  Eye,
  TrendingUp,
  Globe,
  Zap,
  Copy,
  CheckCircle2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Crown,
  KeyRound,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  Network,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Header from "../components/Header";

const API_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:3001";

const fmtMoney = (v) =>
  (v || 0).toLocaleString("en-US", { style: "currency", currency: "USD" });
const fmtNum = (v) =>
  v >= 1000000
    ? `${(v / 1000000).toFixed(1)}M`
    : v >= 1000
    ? `${(v / 1000).toFixed(0)}K`
    : `${v}`;

const Delta = ({ value }) => {
  const up = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 text-xs font-medium ${
        up ? "text-emerald-600" : "text-red-600"
      }`}
    >
      {up ? (
        <ArrowUpRight className="w-3 h-3" />
      ) : (
        <ArrowDownRight className="w-3 h-3" />
      )}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
};

const StatCard = ({ icon: Icon, label, value, delta, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
  >
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon className="w-5 h-5 text-primary" />
        </div>
        <Delta value={delta} />
      </div>
      <div className="text-3xl font-bold tracking-tight mb-1">{value}</div>
      <p className="text-sm text-muted-foreground">{label}</p>
    </Card>
  </motion.div>
);

/* Gráfico de área em SVG puro */
const RevenueChart = ({ data }) => {
  const w = 600;
  const h = 180;
  const pad = 8;
  const max = Math.max(...data) * 1.15;
  const min = Math.min(...data) * 0.85;
  const stepX = (w - pad * 2) / (data.length - 1);
  const y = (v) => h - pad - ((v - min) / (max - min || 1)) * (h - pad * 2);
  const points = data.map((v, i) => `${pad + i * stepX},${y(v)}`).join(" ");
  const areaPath = `M ${pad},${h - pad} L ${points
    .split(" ")
    .join(" L ")} L ${w - pad},${h - pad} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      className="w-full h-44"
      preserveAspectRatio="none"
      role="img"
      aria-label="Daily revenue"
    >
      <path d={areaPath} className="fill-primary/10" />
      <polyline
        points={points}
        fill="none"
        className="stroke-primary"
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {data.map((v, i) => (
        <circle key={i} cx={pad + i * stepX} cy={y(v)} r="3" className="fill-primary" />
      ))}
    </svg>
  );
};

const ShareBar = ({ label, share, sub }) => (
  <div>
    <div className="flex items-center justify-between text-sm mb-1.5">
      <span className="font-medium">{label}</span>
      <span className="text-muted-foreground">
        {sub ? `${sub} · ` : ""}
        {share}%
      </span>
    </div>
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div className="h-full rounded-full bg-primary" style={{ width: `${share}%` }} />
    </div>
  </div>
);

const CopyField = ({ label, value }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div>
      <p className="text-sm text-muted-foreground mb-1.5">{label}</p>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-muted rounded-lg px-3 py-2 text-sm overflow-x-auto whitespace-nowrap">
          {value}
        </code>
        <Button variant="outline" size="sm" className="gap-2 shrink-0" onClick={copy}>
          {copied ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { user, token } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [generating, setGenerating] = useState(false);
  // apiKey completa só existe logo após a geração (backend não a reexpõe)
  const [freshKey, setFreshKey] = useState(null);

  // Ad networks do publisher (tags das contas dele)
  const [networks, setNetworks] = useState([]);
  const [maxNetworks, setMaxNetworks] = useState(3);
  const [netForm, setNetForm] = useState({
    name: "",
    formatClass: "display",
    strictPolicy: false,
    estRpm: "1.00",
    tag: "",
  });
  const [netBusy, setNetBusy] = useState(false);
  const [netError, setNetError] = useState(null);

  const fetchNetworks = useCallback(async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_URL}/dashboard/networks`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data) {
        setNetworks(data.networks || []);
        setMaxNetworks(data.maxNetworks || 3);
      }
    } catch {
      /* silencioso — o card mostra estado vazio */
    }
  }, [token]);

  useEffect(() => {
    fetchNetworks();
  }, [fetchNetworks]);

  const addNetwork = async (e) => {
    e.preventDefault();
    setNetBusy(true);
    setNetError(null);
    try {
      const res = await fetch(`${API_URL}/dashboard/networks`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...netForm, estRpm: parseFloat(netForm.estRpm) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "Failed to add network");
      setNetForm({ name: "", formatClass: "display", strictPolicy: false, estRpm: "1.00", tag: "" });
      await fetchNetworks();
    } catch (err) {
      setNetError(err.message);
    } finally {
      setNetBusy(false);
    }
  };

  const removeNetwork = async (id) => {
    try {
      await fetch(`${API_URL}/dashboard/networks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchNetworks();
    } catch {
      /* silencioso */
    }
  };

  const fetchOverview = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/dashboard/overview`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to load dashboard");
      }
      setOverview(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const generateCredentials = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/dashboard/credentials`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        throw new Error(data?.message || data?.error || "Failed to generate API access");
      }
      setFreshKey(data.credentials.apiKey);
      await fetchOverview();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  /* ---------- estados de carregamento / erro / gates ---------- */

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <div className="flex items-center justify-center py-40">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // 403 do backend (sem plano) ou user local sem flag
  const subscriptionRequired =
    !user.isVip || (error && error.toLowerCase().includes("plan is required"));

  if (subscriptionRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Crown className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Your dashboard is one step away</h1>
            <p className="text-muted-foreground mb-8">
              Revenue analytics, network performance and the optimization script are
              available on active plans. Choose a plan to unlock your publisher dashboard.
            </p>
            <Link to="/#pricing">
              <Button size="lg">View Plans</Button>
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-3">Couldn't load your dashboard</h1>
          <p className="text-muted-foreground mb-8">{error}</p>
          <Button onClick={fetchOverview} className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Try again
          </Button>
        </div>
      </div>
    );
  }

  const { dataStatus, credentials, stats, plan, provisioningWindowHours } =
    overview || {};

  // O sxm.js é servido pelo próprio backend (GET /sxm.js). Se um dia
  // houver CDN próprio (ex.: cdn.sevenxmedia.io), basta apontar aqui.
  const scriptSnippet = credentials
    ? `<script src="${API_URL}/sxm.js" data-site="${credentials.siteId}" async></script>`
    : "";

  /* ---------- 1) Sem credenciais: onboarding ---------- */

  if (dataStatus === "no_credentials") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Set up your API access</h1>
            <p className="text-muted-foreground mb-8">
              Generate your Site ID and API key to install the optimization script on
              your site. After setup, it can take up to {provisioningWindowHours || 48}{" "}
              hours for data to start appearing in your dashboard.
            </p>
            <Button size="lg" className="gap-2" onClick={generateCredentials} disabled={generating}>
              <KeyRound className="w-4 h-4" />
              {generating ? "Generating..." : "Generate API access"}
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  /* ---------- 2) e 3) Provisionando ou pronto ---------- */

  const provisioning = dataStatus === "provisioning";

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Cabeçalho */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p className="text-muted-foreground">
              {provisioning
                ? "Your API access is ready — waiting for first data."
                : "Here's how your traffic performed in the last 30 days."}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div
              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                provisioning
                  ? "bg-amber-100 text-amber-800"
                  : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {provisioning ? <Clock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
              {provisioning ? "Collecting data" : "Script active"}
            </div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium bg-primary/10 text-primary">
              <Crown className="w-4 h-4" />
              Active plan
            </div>
          </div>
        </motion.div>

        {/* Aviso de provisionamento */}
        {provisioning && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="p-6 mb-10 border-amber-300 bg-amber-50 dark:bg-amber-950/20">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-700" />
                </div>
                <div>
                  <h2 className="font-bold mb-1">
                    API access generated — data collection in progress
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Your credentials were created and the script is being provisioned. It
                    can take up to {provisioningWindowHours || 48} hours after installing
                    the snippet for impressions and revenue to appear here. Make sure the
                    script below is live on your site, then check back soon.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* KPIs (zerados durante o provisionamento) */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-3">
          <StatCard icon={DollarSign} label="Revenue (30d)" value={fmtMoney(stats?.revenue30d)} delta={stats?.revenueDelta || 0} delay={0.05} />
          <StatCard icon={Eye} label="Impressions (30d)" value={fmtNum(stats?.impressions30d || 0)} delta={stats?.impressionsDelta || 0} delay={0.1} />
          <StatCard icon={TrendingUp} label="RPM (revenue / 1K impressions)" value={fmtMoney(stats?.rpm)} delta={stats?.rpmDelta || 0} delay={0.15} />
          <StatCard icon={Zap} label="Fill rate" value={`${stats?.fillRate || 0}%`} delta={stats?.fillRateDelta || 0} delay={0.2} />
        </div>

        {/* Aviso: números são estimativas; receita é paga direto pelas redes */}
        <p className="text-xs text-muted-foreground mb-10">
          Figures shown here are estimates and may include small variations. The official
          numbers are always the ones reported in the dashboard of each ad network serving
          your traffic — and each network pays you directly through your own account.
        </p>

        {/* Gráfico — só com dados */}
        {stats?.dailyRevenue?.length > 1 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <Card className="p-6 mb-10">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold">Daily revenue</h2>
                  <p className="text-sm text-muted-foreground">Last 14 days</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {fmtMoney(stats.dailyRevenue.reduce((a, b) => a + b, 0))}
                  </div>
                  <p className="text-xs text-muted-foreground">period total</p>
                </div>
              </div>
              <RevenueChart data={stats.dailyRevenue} />
            </Card>
          </motion.div>
        )}

        {/* Redes + Geo — só com dados */}
        {(stats?.networks?.length > 0 || stats?.geo?.length > 0) && (
          <div className="grid lg:grid-cols-2 gap-6 mb-10">
            {stats?.networks?.length > 0 && (
              <Card className="p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Network performance</h2>
                    <p className="text-sm text-muted-foreground">
                      Share of impressions routed · RPM per network
                    </p>
                  </div>
                </div>
                <div className="space-y-5">
                  {stats.networks.map((n) => (
                    <ShareBar key={n.name} label={n.name} share={n.share} sub={`${fmtMoney(n.rpm)} RPM`} />
                  ))}
                </div>
              </Card>
            )}
            {stats?.geo?.length > 0 && (
              <Card className="p-6 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">Traffic by country</h2>
                    <p className="text-sm text-muted-foreground">Impression share, last 30 days</p>
                  </div>
                </div>
                <div className="space-y-5">
                  {stats.geo.map((g) => (
                    <ShareBar key={g.country} label={g.country} share={g.share} />
                  ))}
                </div>
              </Card>
            )}
          </div>
        )}

        {/* Credenciais + snippet */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold">Your API access</h2>
                <p className="text-sm text-muted-foreground">
                  Install the snippet before the closing{" "}
                  <code className="text-xs bg-muted px-1.5 py-0.5 rounded">&lt;/head&gt;</code>{" "}
                  tag of your site.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 shrink-0"
                onClick={generateCredentials}
                disabled={generating}
              >
                <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                {generating ? "Regenerating..." : "Regenerate API key"}
              </Button>
            </div>

            <div className="space-y-4">
              <CopyField label="Site ID" value={credentials?.siteId || ""} />

              {freshKey ? (
                <div>
                  <CopyField label="API key" value={freshKey} />
                  <p className="text-xs text-amber-700 mt-1.5">
                    Save this key now — for security, it won't be shown in full again.
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-muted-foreground mb-1.5">API key</p>
                  <code className="block bg-muted rounded-lg px-3 py-2 text-sm">
                    {credentials?.apiKeyMasked || "—"}
                  </code>
                </div>
              )}

              <CopyField label="Script snippet" value={scriptSnippet} />
            </div>

            {plan?.renewsAt && (
              <p className="text-xs text-muted-foreground mt-4">
                Plan renews on{" "}
                {new Date(plan.renewsAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                . Manage your subscription in{" "}
                <Link to="/settings" className="text-primary hover:underline">
                  Settings
                </Link>
                .
              </p>
            )}
          </Card>
        </motion.div>

        {/* Ad networks do publisher */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card className="p-6 mt-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Network className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your ad networks</h2>
                <p className="text-sm text-muted-foreground">
                  Paste the ad tags from your own network accounts ({networks.length}/{maxNetworks}).
                  The script decides which one serves each impression — each network keeps paying you
                  directly through your own account.
                </p>
              </div>
            </div>

            {networks.length === 0 && (
              <div className="mt-4 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-muted-foreground">
                No networks configured yet — the script won't serve any ads until you add at least
                one tag from an ad network account you own.
              </div>
            )}

            {networks.length > 0 && (
              <div className="mt-4 space-y-2">
                {networks.map((n) => (
                  <div key={n.id} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-sm">{n.name}</span>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                          {n.formatClass}
                        </span>
                        {n.strictPolicy && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            strict policies
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">est. ${n.estRpm.toFixed(2)} RPM</span>
                      </div>
                      <code className="block text-xs text-muted-foreground truncate mt-1">{n.tagPreview}</code>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Remove ${n.name}`}
                      onClick={() => removeNetwork(n.id)}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {networks.some((n) => n.strictPolicy) &&
              networks.some((n) => n.formatClass === "pop" || n.formatClass === "push") && (
                <div className="mt-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 px-4 py-3 text-sm text-muted-foreground">
                  You have a strict-policy network enabled, so pop/push tags are automatically paused —
                  mixing them on the same pages could violate the strict network's program policies.
                </div>
              )}

            {networks.length < maxNetworks && (
              <form onSubmit={addNetwork} className="mt-6 border-t border-border pt-5 space-y-3">
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    placeholder="Network name (e.g. Adsterra)"
                    value={netForm.name}
                    onChange={(e) => setNetForm({ ...netForm, name: e.target.value })}
                    required
                    minLength={2}
                    maxLength={40}
                  />
                  <select
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    value={netForm.formatClass}
                    onChange={(e) => setNetForm({ ...netForm, formatClass: e.target.value })}
                  >
                    <option value="display">Display / banner</option>
                    <option value="native">Native</option>
                    <option value="push">Push</option>
                    <option value="pop">Pop / popunder</option>
                  </select>
                  <input
                    className="rounded-md border border-border bg-background px-3 py-2 text-sm"
                    type="number"
                    step="0.01"
                    min="0.01"
                    max="1000"
                    placeholder="Estimated RPM (USD)"
                    value={netForm.estRpm}
                    onChange={(e) => setNetForm({ ...netForm, estRpm: e.target.value })}
                  />
                </div>
                <textarea
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm font-mono min-h-[90px]"
                  placeholder="Paste the ad tag exactly as your network provided it (script/HTML snippet)"
                  value={netForm.tag}
                  onChange={(e) => setNetForm({ ...netForm, tag: e.target.value })}
                  required
                  minLength={10}
                />
                <label className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={netForm.strictPolicy}
                    onChange={(e) => setNetForm({ ...netForm, strictPolicy: e.target.checked })}
                  />
                  This network has strict program policies (e.g. Google AdSense) — pause pop/push tags
                  while it's active
                </label>
                {netError && <p className="text-sm text-red-600">{netError}</p>}
                <Button type="submit" size="sm" className="gap-2" disabled={netBusy}>
                  <Plus className="w-4 h-4" />
                  {netBusy ? "Adding..." : "Add network"}
                </Button>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardPage;
