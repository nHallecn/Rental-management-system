"use client";

import { Toaster } from 'sonner';

// This layout wraps only the register page.
// It doesn't need AuthProvider, but we include Toaster for notifications.
export default function RegisterLayout({ children }) {
  return (
    <>
      {children}
      <Toaster richColors position="top-right" />
    </>
  );
}
