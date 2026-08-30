import { redirect } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";

export default async function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data, error } = await supabase.auth.getUser();
  
  if (error || !data.user) {
    redirect("/auth");
  }

  return <>{children}</>;
}