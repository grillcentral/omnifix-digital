import { Outlet } from "react-router-dom";
import Footer from "@/components/Footer.jsx";
import Navbar from "@/components/Navbar.jsx";
import WhatsAppButton from "@/components/WhatsAppButton.jsx";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <Navbar />
      <Outlet />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
