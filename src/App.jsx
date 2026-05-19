import AppRoutes from "@/routes/AppRoutes.jsx";
import ErrorBoundary from "@/components/system/ErrorBoundary.jsx";

export default function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
    </ErrorBoundary>
  );
}
