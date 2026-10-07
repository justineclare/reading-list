import type { ReactNode } from "react";
import Navbar from "@/components/navbar";
import { ListProvider } from "@/context/listcontext";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <ListProvider>
      <Navbar />
      <main className="container">{children}</main>
    </ListProvider>
  );
}