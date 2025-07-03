
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
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { useState } from 'react';

const queryClient = new QueryClient();

function App() {
  const [activeSection, setActiveSection] = useState('home');

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route 
                path="/" 
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
                      <main className="flex-1">
                        <Index activeSection={activeSection} setActiveSection={setActiveSection} />
                      </main>
                    </div>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/settings" 
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar activeSection="settings" setActiveSection={() => {}} />
                      <main className="flex-1">
                        <Settings />
                      </main>
                    </div>
                  </SidebarProvider>
                } 
              />
              <Route 
                path="/universal-data-manager" 
                element={
                  <SidebarProvider>
                    <div className="min-h-screen flex w-full">
                      <AppSidebar activeSection="data-manager" setActiveSection={() => {}} />
                      <main className="flex-1">
                        <UniversalDataManagerPage />
                      </main>
                    </div>
                  </SidebarProvider>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Router>
          <Toaster />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
