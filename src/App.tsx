import { Toaster } from "@/components/ui/toaster";
import { Router } from "./Router";
export default function App() {
  return (
    <main className="h-screen flex">
      <Router />
      <Toaster />
    </main>
  );
}
