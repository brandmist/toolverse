import { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ScrollToTop from './components/layout/ScrollToTop';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CookieConsent } from './components/layout/CookieConsent';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ImageToolProvider } from './context/ImageToolContext';
import { McpProvider } from './features/mcp/context/McpContext';
import { useStore } from './store/useStore';
import { NativeAd } from './components/ui/NativeAd';
import { AdBanner } from './components/ui/AdBanner';

// Lazy loaded Pages
const Home = lazy(() => import('./pages/Home').then(m => ({ default: m.Home })));
const Categories = lazy(() => import('./pages/Categories').then(m => ({ default: m.Categories })));
const CategoryDetail = lazy(() => import('./pages/CategoryDetail').then(m => ({ default: m.CategoryDetail })));
const Search = lazy(() => import('./pages/Search').then(m => ({ default: m.Search })));
const Favorites = lazy(() => import('./pages/Favorites').then(m => ({ default: m.Favorites })));
const ToolDetail = lazy(() => import('./pages/ToolDetail').then(m => ({ default: m.ToolDetail })));
const AllTools = lazy(() => import('./pages/AllTools').then(m => ({ default: m.AllTools })));
const StaticPage = lazy(() => import('./pages/StaticPage').then(m => ({ default: m.StaticPage })));
const BlogDetail = lazy(() => import('./pages/BlogDetail').then(m => ({ default: m.BlogDetail })));
const NotFound = lazy(() => import('./pages/NotFound').then(m => ({ default: m.NotFound })));
const McpDashboard = lazy(() => import('./features/mcp/components/McpDashboard').then(m => ({ default: m.McpDashboard })));

// Loading Fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
  </div>
);

export default function App() {

  return (
    <HelmetProvider>
      <ErrorBoundary>
        <ImageToolProvider>
          <McpProvider>
            <Router>
              <ScrollToTop />
            <div className="min-h-screen flex flex-col relative overflow-x-hidden">
              {/* Subtle mesh gradients that adapt to light/dark themes via opacity and color vars */}
              <div className="fixed top-[-100px] right-[-100px] w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
              <div className="fixed bottom-[-100px] left-[-100px] w-[400px] h-[400px] bg-accent/10 rounded-full blur-[120px] pointer-events-none z-0"></div>
              
              <div className="relative z-10 flex flex-col min-h-screen w-full">
                <Navbar />
                
                {/* Global Native Ad Container (invisible) */}
                <NativeAd />

                {/* Floating Skyscrapers - Desktop Only */}
                <div className="hidden xl:block fixed top-1/2 right-4 -translate-y-1/2 z-40">
                  <AdBanner adKey="81045c2de93bfbab7c8203b44ab27f1c" height={600} width={160} />
                </div>
                <div className="hidden xl:block fixed top-1/2 left-4 -translate-y-1/2 z-40">
                  <AdBanner adKey="81045c2de93bfbab7c8203b44ab27f1c" height={600} width={160} />
                </div>

                <main className="flex-grow">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/tools" element={<AllTools />} />
                      <Route path="/categories" element={<Categories />} />
                      <Route path="/category/:id" element={<CategoryDetail />} />
                      <Route path="/search" element={<Search />} />
                      <Route path="/favorites" element={<Favorites />} />
                      <Route path="/tool/:id" element={<ToolDetail />} />
                      <Route path="/mcp" element={<McpDashboard />} />
                      
                      <Route path="/blog/:slug" element={<BlogDetail />} />
                      
                      {/* Static Pages via generic component to avoid massive bundle bloat */}
                      <Route path="/:pageId" element={<StaticPage />} />

                      {/* 404 Page */}
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </Suspense>
                </main>
                <Footer />
                <CookieConsent />
              </div>
              </div>
            </Router>
          </McpProvider>
        </ImageToolProvider>
      </ErrorBoundary>
    </HelmetProvider>
  );
}
