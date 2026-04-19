import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { Toaster } from "../src/components/ui/sonner";
import LandingPage from "../src/pages/LandingPage";
import LoginPage from "../src/pages/LoginPage";
import RegisterPage from "../src/pages/RegisterPage";
import ProfilePage from "../src/pages/ProfilePage";
import SettingsPage from "../src/pages/SettingsPage";
import TermsPage from "../src/pages/TermsPage";
import PrivacyPage from "../src/pages/PrivacyPage";
import RefundPage from "../src/pages/RefundPage";
import SuccessPage from "../src/pages/SuccessPage";
import CancelPage from "../src/pages/CancelPage";
import "../src/App.css";
import AboutPage from "./pages/AboutPage";

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <div className="App">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/terms" element={<TermsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/privacy" element={<PrivacyPage />} />
            <Route path="/refund" element={<RefundPage />} />
            <Route path="/success" element={<SuccessPage />} />
            <Route path="/cancel" element={<CancelPage />} />
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" />
      </div>
    </ThemeProvider>
  );
}

export default App;