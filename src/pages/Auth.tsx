import React from 'react';
import { SignIn, SignUp } from '@clerk/clerk-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LayoutGrid, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Auth() {
  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl mx-auto flex items-center justify-center shadow-xl shadow-blue-500/20 mb-6 group cursor-default">
            <LayoutGrid size={28} className="text-white group-hover:scale-110 transition-transform" />
          </div>
          <h1 className="text-4xl font-black mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
            Lumina AI
          </h1>
          <p className="text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles size={16} className="text-blue-400" />
            Build the future in seconds
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-2 shadow-2xl">
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-transparent p-1 mb-2">
              <TabsTrigger 
                value="signin" 
                className="rounded-2xl data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all py-2.5"
              >
                Sign In
              </TabsTrigger>
              <TabsTrigger 
                value="signup"
                className="rounded-2xl data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all py-2.5"
              >
                Sign Up
              </TabsTrigger>
            </TabsList>
            
            <div className="p-4">
              <TabsContent value="signin" className="mt-0 outline-none">
                <SignIn 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent border-none shadow-none p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      dividerLine: "bg-white/10",
                      dividerText: "text-muted-foreground",
                      formFieldLabel: "text-gray-400 font-medium",
                      formFieldInput: "bg-white/5 border-white/10 text-white focus:ring-blue-500 rounded-xl px-4 h-11",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 h-11 rounded-xl",
                      footerActionText: "text-gray-500",
                      footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                      identityPreviewText: "text-white",
                      identityPreviewEditButtonIcon: "text-blue-400",
                    }
                  }}
                  routing="path"
                  path="/auth"
                  signUpUrl="/auth"
                />
              </TabsContent>
              
              <TabsContent value="signup" className="mt-0 outline-none">
                <SignUp 
                  appearance={{
                    elements: {
                      rootBox: "w-full",
                      card: "bg-transparent border-none shadow-none p-0",
                      headerTitle: "hidden",
                      headerSubtitle: "hidden",
                      socialButtonsBlockButton: "bg-white/5 border-white/10 text-white hover:bg-white/10 transition-colors",
                      socialButtonsBlockButtonText: "text-white font-medium",
                      dividerLine: "bg-white/10",
                      dividerText: "text-muted-foreground",
                      formFieldLabel: "text-gray-400 font-medium",
                      formFieldInput: "bg-white/5 border-white/10 text-white focus:ring-blue-500 rounded-xl px-4 h-11",
                      formButtonPrimary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 h-11 rounded-xl",
                      footerActionText: "text-gray-500",
                      footerActionLink: "text-blue-400 hover:text-blue-300 font-medium",
                    }
                  }}
                  routing="path"
                  path="/auth"
                  signInUrl="/auth"
                />
              </TabsContent>
            </div>
          </Tabs>
        </div>

        <p className="text-center text-[10px] text-gray-500 mt-8 tracking-widest uppercase">
          Secured by Clerk & Lumina Guard
        </p>
      </motion.div>
    </div>
  );
}

