import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SurveyProvider } from "@/contexts/SurveyContext";
import Index from "./pages/Index.tsx";
import Survey from "./pages/Survey.tsx";
import SurveyResults from "./pages/SurveyResults.tsx";
import SurveyTips from "./pages/SurveyTips.tsx";
import Statistics from "./pages/Statistics.tsx";
import Benchmark from "./pages/Benchmark.tsx";
import Suggestions from "./pages/Suggestions.tsx";
import SuggestionDetail from "./pages/SuggestionDetail.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SurveyProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/survey" element={<Survey />} />
            <Route path="/survey/results" element={<SurveyResults />} />
            <Route path="/survey/tips" element={<SurveyTips />} />
            <Route path="/statistics" element={<Statistics />} />
            <Route path="/benchmark" element={<Benchmark />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/suggestions/:category" element={<SuggestionDetail />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </SurveyProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
