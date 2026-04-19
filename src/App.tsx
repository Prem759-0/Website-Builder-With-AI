import { StrictMode } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import { Toaster } from 'sonner';
import { TooltipProvider } from '@/components/ui/tooltip';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Landing />,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
  },
  {
    path: '/auth',
    element: <Auth />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  }
]);

export default function App() {
  return (
    <TooltipProvider>
      <RouterProvider router={router} />
      <Toaster position="top-right" theme="dark" richColors />
    </TooltipProvider>
  );
}
