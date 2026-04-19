import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut } from '@clerk/clerk-react';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import Pricing from './pages/Pricing';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn("VITE_CLERK_PUBLISHABLE_KEY is missing. Auth will not work.");
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: (
      <>
        <SignedIn>
          <Dashboard />
        </SignedIn>
        <SignedOut>
          <Navigate to="/auth" replace />
        </SignedOut>
      </>
    ),
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '/pricing',
    element: <Pricing />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <TooltipProvider>
        <RouterProvider router={router} />
        <Toaster position="top-right" theme="dark" richColors />
      </TooltipProvider>
    </ClerkProvider>
  );
}

