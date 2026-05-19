import { Component } from "react";
import ErrorState from "@/components/ui/ErrorState.jsx";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erro capturado pelo ErrorBoundary", error, info);
  }

  render() {
    if (this.state.error) {
      return (
        <main className="page-shell">
          <ErrorState
            title="Algo saiu do esperado"
            message="Atualize a pagina ou volte para uma rota principal."
          />
        </main>
      );
    }

    return this.props.children;
  }
}
