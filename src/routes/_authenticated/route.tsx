"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    console.log("[AuthenticatedLayout] useEffect: Checking localStorage for 'admin_session'...");
    
    // 1. Check if the session exists in localStorage
    const session = localStorage.getItem("admin_session");
    console.log("[AuthenticatedLayout] Retrieved session value:", session);

    if (!session) {
      console.log("[AuthenticatedLayout] No session found. Redirecting to /auth...");
      // Redirect to auth if not found
      router.replace("/auth");
    } else {
      console.log("[AuthenticatedLayout] Session found! Setting isAuthenticated to true.");
      // Optional: If you need to verify the user against MongoDB, 
      // you can make a fetch request to an API route here using the email from localStorage.
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
    console.log("[AuthenticatedLayout] Loading state set to false.");
  }, [router]);

  // 2. Show a loading screen while checking localStorage
  if (isLoading) {
    console.log("[AuthenticatedLayout] Render state: Showing loading screen...");
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // 3. If not authenticated, render nothing (router.replace will handle the redirect)
  if (!isAuthenticated) {
    console.log("[AuthenticatedLayout] Render state: Not authenticated, rendering null while redirecting.");
    return null;
  }

  // 4. Render the protected children if authenticated
  console.log("[AuthenticatedLayout] Render state: Authenticated successfully. Rendering protected children.");
  return <>{children}</>;
}