import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "@/components/auth/ProtectedRoute.jsx";
import MainLayout from "@/layouts/MainLayout.jsx";
import Agendamentos from "@/pages/Agendamentos.jsx";
import Assistencia from "@/pages/Assistencia.jsx";
import Blog from "@/pages/Blog.jsx";
import BlogPost from "@/pages/BlogPost.jsx";
import Calendario from "@/pages/Calendario.jsx";
import Crm from "@/pages/Crm.jsx";
import Estoque from "@/pages/Estoque.jsx";
import Faq from "@/pages/Faq.jsx";
import Home from "@/pages/Home.jsx";
import Leads from "@/pages/Leads.jsx";
import Login from "@/pages/Login.jsx";
import OrdensServico from "@/pages/OrdensServico.jsx";
import Produtos from "@/pages/Produtos.jsx";
import SystemStatus from "@/pages/SystemStatus.jsx";
import Unauthorized from "@/pages/Unauthorized.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/produtos" element={<Produtos />} />
        <Route path="/assistencia" element={<Assistencia />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/login" element={<Login />} />
        <Route path="/status" element={<SystemStatus />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogPost />} />
        <Route path="/agendamentos" element={<Agendamentos />} />
        <Route element={<ProtectedRoute roles={["admin", "atendente"]} />}>
          <Route path="/leads" element={<Leads />} />
          <Route path="/crm" element={<Crm />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin", "tecnico", "atendente"]} />}>
          <Route path="/os" element={<OrdensServico />} />
          <Route path="/calendario" element={<Calendario />} />
        </Route>
        <Route element={<ProtectedRoute roles={["admin", "tecnico"]} />}>
          <Route path="/estoque" element={<Estoque />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
