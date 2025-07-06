
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';
import { UniversalDataManagerPage } from './components/UniversalDataManagerPage';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/toaster';
import { useIndexedDBFix } from './hooks/useIndexedDBFix';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function AppContent() {
  const { fixDatabase } = useIndexedDBFix();

  useEffect(() => {
    // Initialiser la réparation IndexedDB au démarrage
    fixDatabase();
  }, [fixDatabase]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/universal-data-manager" element={<UniversalDataManagerPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
