/**
 * Gann Navigator - Main Application
 * PRODUCTION READY — GLOBAL SYSTEM APPLIED TO ALL PAGES
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { GlobalProviders } from "@/providers/GlobalProviders";
import { GlobalLayout } from "@/components/layout/GlobalLayout";
import { lazy, Suspense } from "react";

// Lazy-loaded pages for performance
const Index = lazy(() => import("./pages/Index"));
const Charts = lazy(() => import("./pages/Charts"));
const Scanner = lazy(() => import("./pages/Scanner"));
const Forecasting = lazy(() => import("./pages/Forecasting"));
const Gann = lazy(() => import("./pages/Gann"));
const Astro = lazy(() => import("./pages/Astro"));
const Ehlers = lazy(() => import("./pages/Ehlers"));
const AI = lazy(() => import("./pages/AI"));
const Options = lazy(() => import("./pages/Options"));
const Risk = lazy(() => import("./pages/Risk"));
const Backtest = lazy(() => import("./pages/Backtest"));
const Settings = lazy(() => import("./pages/Settings"));
const GannTools = lazy(() => import("./pages/GannTools"));
const TradingMode = lazy(() => import("./pages/TradingMode"));
const HFT = lazy(() => import("./pages/HFT"));
const PatternRecognition = lazy(() => import("./pages/PatternRecognition"));
const SlippageSpike = lazy(() => import("./pages/SlippageSpike"));
const Reports = lazy(() => import("./pages/Reports"));
const Journal = lazy(() => import("./pages/Journal"));
const BackendAPI = lazy(() => import("./pages/BackendAPI"));
const NotFound = lazy(() => import("./pages/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const App = () => (
  <GlobalProviders>
    <BrowserRouter>
      <GlobalLayout>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/charts" element={<Charts />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/forecasting" element={<Forecasting />} />
            <Route path="/gann" element={<Gann />} />
            <Route path="/gann/*" element={<Gann />} />
            <Route path="/astro" element={<Astro />} />
            <Route path="/planetary" element={<Astro />} />
            <Route path="/ehlers" element={<Ehlers />} />
            <Route path="/indicators" element={<Ehlers />} />
            <Route path="/ai" element={<AI />} />
            <Route path="/options" element={<Options />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/backtest" element={<Backtest />} />
            <Route path="/gann-tools" element={<GannTools />} />
            <Route path="/trading-mode" element={<TradingMode />} />
            <Route path="/hft" element={<HFT />} />
            <Route path="/pattern-recognition" element={<PatternRecognition />} />
            <Route path="/slippage-spike" element={<SlippageSpike />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/journal" element={<Journal />} />
            <Route path="/backend-api" element={<BackendAPI />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </GlobalLayout>
    </BrowserRouter>
  </GlobalProviders>
);

export default App;
