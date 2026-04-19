import React from 'react';
import { Button } from '@/components/ui/button';
import { LayoutGrid, Mail, Github } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Auth() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0B0F19] flex items-center justify-center p-6 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent)]">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-blue-500/20 mb-4">
            <LayoutGrid size={24} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
          <p className="text-muted-foreground">Sign in to your Lumina account</p>
        </div>

        <div className="space-y-4">
          <Button className="w-full h-12 bg-white text-black hover:bg-gray-200" onClick={() => navigate('/dashboard')}>
            <Github className="mr-2" size={20} />
            Continue with GitHub
          </Button>
          <Button variant="outline" className="w-full h-12 border-white/10 hover:bg-white/5" onClick={() => navigate('/dashboard')}>
            <Mail className="mr-2" size={20} />
            Continue with Google
          </Button>
          
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0B0F19] px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-4">
             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-400">Email Address</label>
               <input 
                 type="email" 
                 placeholder="name@example.com"
                 className="w-full h-11 bg-white/5 border border-white/10 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500" 
               />
             </div>
             <Button className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white" onClick={() => navigate('/dashboard')}>
               Sign In
             </Button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Don't have an account? <a href="#" className="text-blue-400 hover:underline">Sign up for free</a>
        </p>
      </div>
    </div>
  );
}
