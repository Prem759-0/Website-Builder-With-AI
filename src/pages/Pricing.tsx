import React from 'react';
import { motion } from 'motion/react';
import { Check, Sparkles, Rocket, Zap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { checkoutApi } from '@/lib/api';
import { useUser } from '@clerk/clerk-react';
import { toast } from 'sonner';

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "Perfect for testing ideas",
    features: [
      "5 Generations per day",
      "3 Published websites",
      "Export as ZIP",
      "Standard AI model",
      "Community support"
    ],
    cta: "Current Plan",
    current: true,
    priceId: ""
  },
  {
    name: "Pro",
    price: "$29",
    period: "/month",
    description: "For serious builders and creators",
    features: [
      "Unlimited Generations",
      "Unlimited Published sites",
      "Priority AI Access (GPT-4)",
      "Advanced SEO tools",
      "Premium Templates",
      "24/7 Priority Support"
    ],
    cta: "Upgrade to Pro",
    popular: true,
    priceId: "price_premium_monthly" // Placeholder, in real world this comes from Env
  }
];

export default function Pricing() {
  const { user } = useUser();

  const handleUpgrade = async (priceId: string) => {
    if (!user) {
      toast.error("Please sign in to upgrade");
      return;
    }
    
    if (!priceId) return;

    toast.loading("Preparing checkout...");
    try {
      const res = await checkoutApi.createSession(
        priceId,
        window.location.origin + "/dashboard?success=true",
        window.location.origin + "/pricing",
        user.id
      );
      window.location.href = res.data.url;
    } catch (e: any) {
      toast.dismiss();
      toast.error(e.response?.data?.error || "Failed to start checkout");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white py-24 px-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-600/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
          >
            <Sparkles size={12} />
            Simple Pricing
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6"
          >
            Build better, <span className="text-blue-500">faster.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg max-w-2xl mx-auto"
          >
            Choose the perfect plan for your project. From simple prototypes to production-ready landing pages.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, x: i === 0 ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`relative p-8 rounded-3xl border transition-all duration-500 ${
                plan.popular 
                  ? "bg-[#111827] border-blue-500/30 shadow-2xl shadow-blue-500/10" 
                  : "bg-white/[0.02] border-white/5"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                  Most Popular
                </div>
              )}

              <div className="mb-8">
                <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-4xl font-black">{plan.price}</span>
                  {plan.period && <span className="text-gray-500 font-medium">{plan.period}</span>}
                </div>
                <p className="text-sm text-gray-500">{plan.description}</p>
              </div>

              <div className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-gray-300">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.popular ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-gray-500"}`}>
                      <Check size={12} />
                    </div>
                    {feature}
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleUpgrade(plan.priceId)}
                disabled={plan.current}
                className={`w-full py-6 rounded-2xl font-bold transition-all active:scale-95 ${
                  plan.popular 
                    ? "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
                    : "bg-white/5 hover:bg-white/10 text-white border border-white/10"
                }`}
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
           {[
             { icon: <Zap className="text-yellow-400" />, title: "Instant Access", desc: "Start building immediately after upgrade." },
             { icon: <Shield className="text-emerald-400" />, title: "Secure Payment", desc: "Powered by Stripe for 100% security." },
             { icon: <Rocket className="text-blue-400" />, title: "Turbo Mode", desc: "Priority compute for generated sites." }
           ].map((item, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 + i * 0.1 }}
               className="p-6 rounded-2xl bg-white/[0.02] border border-white/5"
             >
               <div className="mb-4">{item.icon}</div>
               <h4 className="font-bold mb-2">{item.title}</h4>
               <p className="text-sm text-gray-500">{item.desc}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  );
}
