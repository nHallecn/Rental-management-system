"use client";

import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from 'sonner';

// This layout wraps only the login page and provides the AuthContext.
export default function LoginLayout({ children }) {
  return (
    <AuthProvider>
      {children}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}
