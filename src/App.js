import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import PublicSiteGate from "./components/layout/PublicSiteGate";
import Layout from "./components/layout/Layout";
import ProtectedAdminRoute from "./components/admin/ProtectedAdminRoute";
import { AdsConfigProvider } from "./context/AdsConfigContext";
import { AuthProvider } from "./context/AuthContext";
import { FooterConfigProvider } from "./context/FooterConfigContext";
import { HeaderCodeProvider } from "./context/HeaderCodeContext";
import { NavbarLinksProvider } from "./context/NavbarLinksContext";
import { SettingsConfigProvider } from "./context/SettingsConfigContext";
import Home from "./pages/Home";
import BackgroundRemover from "./pages/BackgroundRemover";
import ImageConverter from "./pages/ImageConverter";
import ImageCompressor from "./pages/ImageCompressor";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import About from "./pages/About";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <AuthProvider>
      <SettingsConfigProvider>
        <AdsConfigProvider>
          <HeaderCodeProvider>
            <FooterConfigProvider>
              <NavbarLinksProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin/signup" element={<AdminSignup />} />
                    <Route element={<ProtectedAdminRoute />}>
                      <Route path="/admin" element={<AdminDashboard />} />
                    </Route>

                    <Route element={<PublicSiteGate />}>
                      <Route element={<Layout />}>
                        <Route path="/" element={<Home />} />
                        <Route
                          path="/background-remover"
                          element={<BackgroundRemover />}
                        />
                        <Route
                          path="/image-compressor"
                          element={<ImageCompressor />}
                        />
                        <Route
                          path="/png-to-jpg"
                          element={<ImageConverter variant="png-to-jpg" />}
                        />
                        <Route
                          path="/tools/background-remover"
                          element={<Navigate to="/background-remover" replace />}
                        />
                        <Route
                          path="/tools/image-converter"
                          element={<Navigate to="/png-to-jpg" replace />}
                        />
                        <Route
                          path="/tools/image-compressor"
                          element={<Navigate to="/image-compressor" replace />}
                        />
                        <Route path="/privacy" element={<PrivacyPolicy />} />
                        <Route path="/terms" element={<TermsOfService />} />
                        <Route path="/contact" element={<Contact />} />
                        <Route path="/about" element={<About />} />
                      </Route>
                    </Route>
                  </Routes>
                </BrowserRouter>
              </NavbarLinksProvider>
            </FooterConfigProvider>
          </HeaderCodeProvider>
        </AdsConfigProvider>
      </SettingsConfigProvider>
    </AuthProvider>
  );
}

export default App;
