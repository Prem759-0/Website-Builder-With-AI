import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Code, Globe, ArrowRight, Zap, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-blue-500/30 overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 blur-[120px] rounded-full animate-pulse [animation-delay:2s]"></div>
      </div>

      <nav className="relative z-10 container mx-auto px-6 py-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Zap size={24} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">Lumina AI</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-400">
          <a href="#features" className="hover:text-white transition-colors">Features</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" className="hover:bg-white/5" onClick={() => navigate('/auth')}>Sign In</Button>
          <Button className="bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20" onClick={() => navigate('/dashboard')}>
            Get Started
            <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </nav>

      <main className="relative z-10 pt-20 pb-32">
        <div className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-8">
              <Sparkles size={16} />
              AI-Powered Website Builder is here
            </span>
            <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-500">
              Build Websites <br /> at the Speed of Thought.
            </h1>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 leading-relaxed">
              Experience the world's most powerful AI website builder. Generate, preview, edit, 
              and deploy high-performance websites in seconds—not weeks.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="h-14 px-8 text-lg bg-white text-black hover:bg-gray-200" onClick={() => navigate('/dashboard')}>
                Start Building Free
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 text-lg border-white/10 hover:bg-white/5">
                View Showcase
              </Button>
            </div>
          </motion.div>

          {/* Hero Image Mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 relative"
          >
            <div className="absolute -inset-1.5 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 rounded-3xl blur opacity-30"></div>
            <div className="relative bg-[#111827] rounded-2xl border border-white/10 shadow-2xl overflow-hidden aspect-video">
               <img 
                 src="https://picsum.photos/seed/tech-dashboard/1920/1080" 
                 alt="Dashboard Preview" 
                 className="w-full h-full object-cover opacity-80"
                 referrerPolicy="no-referrer"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-transparent to-transparent"></div>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <section id="features" className="py-32">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="text-yellow-400" />,
                  title: "Instant Generation",
                  desc: "Type a prompt and watch Lumina generate complete HTML, CSS, and JS in real-time."
                },
                {
                  icon: <Code className="text-blue-400" />,
                  title: "Full Code Control",
                  desc: "Edit every line of code with our integrated Monaco editor. Real-time preview updates."
                },
                {
                  icon: <Globe className="text-purple-400" />,
                  title: "One-Click Deploy",
                  desc: "Ship your creations to global edge servers instantly with built-in hosting."
                }
              ].map((feature, i) => (
                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/10 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <Zap size={20} className="text-blue-500" />
            <span className="font-bold">Lumina AI</span>
          </div>
          <p className="text-sm text-gray-500">© 2026 Lumina Technologies. Built with intelligence.</p>
          <div className="flex gap-6">
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Twitter</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">GitHub</a>
             <a href="#" className="text-gray-500 hover:text-white transition-colors">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
