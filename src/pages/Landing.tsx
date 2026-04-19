import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Rocket, Sparkles, Code, Globe, ArrowRight, Zap, Shield, Users, Command, Terminal, Layers } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] text-white selection:bg-blue-500/30 overflow-x-hidden relative">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />
        <div className="absolute top-[30%] left-[20%] w-[1px] h-[1px] shadow-[0_0_100px_50px_rgba(59,130,246,0.1)] rounded-full animate-ping" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F19]/50 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-500/20">
              <Zap size={24} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter">LUMINA</span>
          </div>
          
          <div className="hidden lg:flex items-center gap-10 text-[11px] font-bold uppercase tracking-[0.2em] text-gray-500">
            {["Showcase", "Features", "Pricing", "Enterprise"].map((item) => (
              <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-blue-400 transition-colors">{item}</a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" className="text-sm font-bold text-gray-400 hover:text-white" onClick={() => navigate('/auth')}>
              Sign In
            </Button>
            <Button 
              className="bg-white text-black hover:bg-gray-200 h-11 px-6 rounded-xl font-bold text-sm shadow-xl transition-all active:scale-95" 
              onClick={() => navigate('/dashboard')}
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-44 pb-32">
        {/* Hero Section */}
        <section className="container mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-blue-500/5 border border-blue-500/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-10"
            >
              <Sparkles size={14} className="animate-pulse" />
              The Intelligence Layer for Web
            </motion.div>
            
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-[-0.04em] leading-[0.9] max-w-5xl bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-600">
              BUILD THE FUTURE
              <br />
              <span className="text-blue-500">IN SECONDS.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-14 leading-relaxed font-medium">
              Lumina is the professional AI website builder. Describe your vision, and watch as high-performance code generates before your eyes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Button 
                size="lg" 
                className="h-16 px-10 text-lg bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold shadow-2xl shadow-blue-600/20 flex items-center gap-3 group transition-all"
                onClick={() => navigate('/dashboard')}
              >
                Create Website Free
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="h-16 px-10 text-lg border-white/10 hover:bg-white/5 rounded-2xl font-bold transition-all">
                Learn how it works
              </Button>
            </div>

            {/* Social Proof */}
            <div className="mt-20 flex flex-col items-center gap-4">
               <div className="flex -space-x-4">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-[#0B0F19] overflow-hidden bg-gray-800 ring-2 ring-blue-500/10">
                      <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="User" />
                    </div>
                  ))}
               </div>
               <p className="text-[11px] font-bold text-gray-500 uppercase tracking-widest">
                  Trusted by <span className="text-white">20,000+</span> digital architects
               </p>
            </div>
          </motion.div>

          {/* Hero UI Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-32 max-w-6xl mx-auto group relative"
          >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-[32px] blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000" />
            <div className="relative bg-[#111827] rounded-[30px] border border-white/10 shadow-2xl overflow-hidden aspect-[16/10]">
               <div className="h-12 border-b border-white/5 bg-[#111827]/80 flex items-center px-6 gap-2">
                  <div className="flex gap-1.5 leading-none">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/20 border border-red-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/20 border border-yellow-500/30" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/20 border border-green-500/30" />
                  </div>
                  <div className="ml-4 flex-1 h-6 bg-white/5 rounded-full" />
               </div>
               <div className="relative h-full">
                  <img 
                    src="https://picsum.photos/seed/lumina-app/1920/1200" 
                    alt="Lumina Dashboard" 
                    className="w-full h-full object-cover opacity-90 scale-100 group-hover:scale-[1.02] transition-transform duration-[2s]"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-transparent to-transparent" />
                  
                  {/* Floating UI Elements */}
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                     <div className="bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center animate-ping opacity-25" />
                     <div className="absolute bg-blue-600 h-16 w-16 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/50">
                        <Zap size={32} className="text-white fill-white" />
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* Features - Value Propositions */}
        <section id="features" className="py-44 relative">
          <div className="container mx-auto px-6">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">ENGINEERED FOR EXCELLENCE</h2>
              <p className="text-gray-500 max-w-xl mx-auto font-medium">Lumina combines state-of-the-art LLMs with a refined design system to produce production-grade output.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  icon: <Terminal className="text-blue-400" />,
                  title: "Real-time Code",
                  desc: "Watch as valid TypeScript, Tailwind, and React code is written in real-time. No hidden layers."
                },
                {
                  icon: <Command className="text-indigo-400" />,
                  title: "Smart Context",
                  desc: "Lumina understands your design intent, maintaining consistent theme and spacing across pages."
                },
                {
                  icon: <Layers className="text-purple-400" />,
                  title: "Atomic Structure",
                  desc: "Generated code is component-based, making it easy to extend and maintain in professional IDEs."
                }
              ].map((feature, i) => (
                <div key={i} className="p-10 rounded-[32px] bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all hover:bg-white/[0.05] group">
                  <div className="w-14 h-14 rounded-2xl bg-white/[0.03] flex items-center justify-center mb-10 group-hover:scale-110 transition-transform shadow-xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-black mb-6 tracking-tight uppercase text-white/90">{feature.title}</h3>
                  <p className="text-gray-500 leading-relaxed font-medium">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-32">
          <div className="container mx-auto px-6">
             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[40px] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-blue-500/20">
                <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                <div className="relative z-10 flex flex-col items-center">
                   <h2 className="text-4xl md:text-7xl font-black mb-10 tracking-tight text-white leading-tight">
                      STOP CODING.<br />START ARCHITECTING.
                   </h2>
                   <p className="text-blue-100/70 max-w-xl mx-auto mb-12 font-medium text-lg">
                      Join the thousands of developers building their future with Lumina. No credit card required.
                   </p>
                   <Button 
                     size="lg" 
                     className="h-16 px-12 text-lg bg-white text-blue-600 hover:bg-blue-50 flex items-center gap-3 font-black rounded-2xl shadow-xl transition-all active:scale-95"
                     onClick={() => navigate('/dashboard')}
                    >
                      Instant Access
                      <Rocket size={20} />
                   </Button>
                </div>
             </div>
          </div>
        </section>
      </main>

      <footer className="relative z-10 border-t border-white/5 py-24 bg-[#0B0F19]/80 backdrop-blur-md">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <Zap size={24} className="text-blue-500 fill-blue-500" />
              <span className="font-black text-2xl">LUMINA</span>
            </div>
            <p className="text-gray-500 max-w-xs font-medium leading-relaxed mb-8">
              The professional layer for AI-driven web development. 
              Accelerating digital architecture since 2026.
            </p>
            <div className="flex gap-4">
               {[Shield, Users, Globe].map((Icon, i) => (
                 <div key={i} className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 hover:text-white transition-colors cursor-pointer border border-white/5">
                   <Icon size={18} />
                 </div>
               ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-8">Product</h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">Generator</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Pricing</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Security</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">API</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-white mb-8">Company</h4>
            <ul className="space-y-4 text-gray-500 font-bold text-sm">
              <li><a href="#" className="hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Journal</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Press</a></li>
            </ul>
          </div>
        </div>
        <div className="container mx-auto px-6 mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[11px] font-bold text-gray-600 uppercase tracking-widest">
           <p>© 2026 LUMINA ARCHITECTS. ALL CODE RESERVED.</p>
           <div className="flex gap-8">
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">License</a>
           </div>
        </div>
      </footer>
    </div>
  );
}

