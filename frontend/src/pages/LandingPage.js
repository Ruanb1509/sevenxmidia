import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import Header from "../components/Header";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}`;

// Whop plan IDs
const WHOP_PLANS = {
  monthly: "plan_cAqnWoI4YZoDn",
  yearly: "plan_9tztkzFseQyfQ",
  // TODO: criar o plano Lifetime ($200, pagamento único) no Whop e colar o ID aqui
  lifetime: null,
};

const LandingPage = () => {
  const [loading, setLoading] = useState(null);

const handleCheckout = (planType) => {
  try {
    const whopPlanId = WHOP_PLANS[planType];
    if (!whopPlanId) {
      toast.info("Lifetime checkout is being set up. Contact support@sevenxmedia.io to purchase.");
      return;
    }
    setLoading(planType);
    // Whop checkout - direct redirect
    window.location.href = `https://whop.com/checkout/${whopPlanId}`;
  } catch (error) {
    console.error("Checkout error:", error);
    toast.error(error.message || "Failed to initiate checkout.");
    setLoading(null);
  }
};



  return (
    <div className="min-h-screen bg-background">
      {/* Header Component */}
      <Header />

      {/* Hero Section */}
      <section className="py-32 px-6" data-testid="hero-section">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <div className="inline-block px-4 py-2 mb-8 border border-border rounded-md">
              <span className="text-xs uppercase tracking-widest font-medium" data-testid="hero-badge">
                Ad Optimization for Publishers
              </span>
            </div>
            <h1 className="text-6xl lg:text-7xl font-bold tracking-tight mb-6" data-testid="hero-title">
              Maximize your ad revenue with
              <br />
              intelligent network selection.
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed" data-testid="hero-subtitle">
SevenX Media is an ad optimization service for web publishers with international audiences. For each visitor, our script selects the ad network most likely to perform well for that visitor's region — helping you make better use of every impression.
            </p>
            <Button
              size="lg"
              className="rounded-md px-8 py-6 text-base font-medium active:scale-95 transition-transform"
              onClick={() => document.getElementById('pricing').scrollIntoView({ behavior: 'smooth' })}
              data-testid="hero-cta-button"
            >
              View Plans
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* About Company Section */}
      <section className="py-24 px-6 bg-gradient-to-b from-primary/5 to-transparent">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">About SevenX Media</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              SevenX Media is an ad optimization platform for web publishers. Our script routes each visitor
              to the ad network expected to perform best for that visitor's region, helping publishers with
              international traffic make the most of their inventory. You keep your own ad network accounts
              — each network pays you directly, and our script simply decides which of your networks serves
              each impression.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="bg-gradient-to-r from-primary/10 to-primary/5 p-12 rounded-lg border border-primary/20"
          >
            <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
            <p className="text-lg text-muted-foreground mb-6">
              SevenX Media helps web publishers get more out of their traffic. Instead of serving every
              visitor through a single fixed ad network, we distribute impressions across multiple networks
              based on regional performance — a simple way to improve overall results, especially for sites
              with audiences in many different countries. Your ad revenue never passes through us: the
              networks you work with keep paying you directly, and our only charge is the subscription.
            </p>
            <ul className="grid md:grid-cols-2 gap-4">
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Automated ad network selection per visitor</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Geolocation & contextual optimization</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Revenue analytics dashboard</span>
              </li>
              <li className="flex items-center gap-3">
                <Check className="h-5 w-5 text-primary flex-shrink-0" />
                <span>Publisher-focused support</span>
              </li>
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-24 px-6">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl lg:text-5xl font-bold mb-6">Why Choose SevenX Media?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              The advantages our optimization script brings to your publisher revenue
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Clear Analytics</h3>
              <p className="text-muted-foreground">
                Follow estimated revenue, network distribution, and traffic breakdown in a simple publisher dashboard. Final figures always come from each ad network's own reporting.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Network Selection</h3>
              <p className="text-muted-foreground">
                Our script uses the visitor's region to choose, in real time, the ad network most likely to perform well for that audience.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground">
                Lightweight script with minimal latency, so network selection happens instantly without slowing your site down.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🛡️</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Privacy-Conscious</h3>
              <p className="text-muted-foreground">
                The script collects only the technical information needed to route each impression — such as the visitor's region. We don't store personally identifiable data from your visitors.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Publisher Support</h3>
              <p className="text-muted-foreground">
                Dedicated support to help you integrate the script and optimize your revenue setup.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
              className="border border-border rounded-lg p-8"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📈</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Revenue Focused</h3>
              <p className="text-muted-foreground">
                Built to help you improve revenue per impression by distributing traffic across networks based on performance data.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-32 px-6" data-testid="pricing-section">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold tracking-tight mb-4" data-testid="pricing-title">Choose Your Plan</h2>
            <p className="text-xl text-muted-foreground mb-8" data-testid="pricing-subtitle">
              Select the perfect plan for your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Monthly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="border border-border rounded-md p-8 hover:border-primary/50 transition-colors duration-300 flex flex-col"
              data-testid="monthly-plan-card"
            >
              <h3 className="text-2xl font-bold mb-2" data-testid="monthly-plan-title">Monthly</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold" data-testid="monthly-plan-price">$12</span>
                <span className="text-muted-foreground">/mo</span>
              </div>
              <ul className="space-y-3 mb-8 border-t border-border pt-6 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Ad network optimization script</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Compares up to 2 ad networks per impression</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Revenue analytics dashboard</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Email support</span>
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <div className="text-xs text-center text-muted-foreground">
                  Checkout via <span className="font-semibold text-foreground">Whop</span>
                </div>
                <Button
                  className="w-full rounded-md active:scale-95 transition-transform"
                  variant="outline"
                  onClick={() => handleCheckout("monthly")}
                  disabled={loading === "monthly"}
                  data-testid="monthly-plan-button"
                >
                  {loading === "monthly" ? "Processing..." : "Subscribe Monthly"}
                </Button>
              </div>
            </motion.div>

            {/* Yearly Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="border-2 border-accent rounded-md p-8 relative bg-accent/5 flex flex-col"
              data-testid="yearly-plan-card"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent text-accent-foreground text-xs uppercase tracking-widest font-bold rounded-md" data-testid="popular-badge">
                Popular
              </div>
              <h3 className="text-2xl font-bold mb-2" data-testid="yearly-plan-title">Yearly</h3>
              <div className="mb-2">
                <span className="text-5xl font-bold" data-testid="yearly-plan-price">$80</span>
                <span className="text-muted-foreground">/year</span>
              </div>
              <p className="text-sm text-accent mb-6" data-testid="yearly-plan-savings">Save 45% vs Monthly</p>
              <ul className="space-y-3 mb-8 border-t border-border pt-6 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Everything in Monthly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Compares up to 2 ad networks per impression</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Lower effective monthly cost (~$6.67/mo)</span>
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <div className="text-xs text-center text-muted-foreground">
                  Checkout via <span className="font-semibold text-foreground">Whop</span>
                </div>
                <Button
                  className="w-full rounded-md active:scale-95 transition-transform"
                  onClick={() => handleCheckout("yearly")}
                  disabled={loading === "yearly"}
                  data-testid="yearly-plan-button"
                >
                  {loading === "yearly" ? "Processing..." : "Subscribe Yearly"}
                </Button>
              </div>
            </motion.div>

            {/* Lifetime Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="border border-border rounded-md p-8 hover:border-primary/50 transition-colors duration-300 flex flex-col"
              data-testid="lifetime-plan-card"
            >
              <h3 className="text-2xl font-bold mb-2" data-testid="lifetime-plan-title">Lifetime</h3>
              <div className="mb-6">
                <span className="text-5xl font-bold" data-testid="lifetime-plan-price">$200</span>
                <span className="text-muted-foreground"> one-time</span>
              </div>
              <ul className="space-y-3 mb-8 border-t border-border pt-6 flex-1">
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Everything in Yearly</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Compares up to 3 ad networks at once</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-4 w-4 text-accent" />
                  <span className="text-sm">Pay once, no renewals</span>
                </li>
              </ul>
              <div className="flex flex-col gap-3">
                <div className="text-xs text-center text-muted-foreground">
                  Checkout via <span className="font-semibold text-foreground">Whop</span>
                </div>
                <Button
                  className="w-full rounded-md active:scale-95 transition-transform"
                  variant="outline"
                  onClick={() => handleCheckout("lifetime")}
                  disabled={loading === "lifetime"}
                  data-testid="lifetime-plan-button"
                >
                  {loading === "lifetime" ? "Processing..." : "Get Lifetime"}
                </Button>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12 px-6 bg-secondary/20" data-testid="footer">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 mb-8">
            {/* Left Column */}
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground mb-4">
                © 2024-2026 SevenX Media (sevenxmedia.io). All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground mb-2">
                Contact support: <a href="mailto:support@sevenxmedia.io" className="text-primary hover:underline">support@sevenxmedia.io</a>
              </p>
              <p className="text-xs text-muted-foreground">
                SevenX Media is an independent tool and is not affiliated with, endorsed by, or certified by
                any ad network. All trademarks belong to their respective owners.
              </p>
            </div>

            {/* Right Column */}
            <div className="text-left md:text-right">
              <p className="text-sm font-semibold text-foreground mb-2">7X PUBLICIDADE E PROPAGANDA LTDA</p>
              <p className="text-sm text-muted-foreground mb-3">
                CNPJ: 57.264.127/0001-35
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Rua Senhor dos Passos, 278, Sala 604, Centro<br />
                Sete Lagoas - MG, 35700-016
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="border-t border-border pt-6 flex flex-wrap justify-center gap-6">
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-terms-link">
              Terms of Service
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-privacy-link">
              Privacy Policy
            </Link>
            <Link to="/refund" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-refund-link">
              Refund Policy
            </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors" data-testid="footer-refund-link">
              About
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;