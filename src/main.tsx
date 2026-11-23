import { Component, type ErrorInfo, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error?.message || 'Errore imprevisto di caricamento.' };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Errore rendering applicazione:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#070A10] text-[#F8F7F4] p-6">
          <div className="max-w-md w-full rounded-lg border border-[#28354D] bg-[#0D121C] p-6 space-y-4">
            <h1 className="text-xl font-bold text-[#E5C17B]">
              Si è verificato un problema nel caricamento
            </h1>
            <p className="text-sm text-[#CBD5E1]">
              {this.state.message}
            </p>
            <button
              type="button"
              onClick={() => {
                try {
                  localStorage.clear();
                } catch {
                  // ignore
                }
                window.location.reload();
              }}
              className="px-4 py-2 text-xs font-bold rounded-md bg-[#E5C17B] text-[#070A10] hover:bg-[#F0D294] cursor-pointer"
            >
              Ripristina e ricarica pagina
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  );
}
