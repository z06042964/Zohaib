import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import BackgroundRemover from "./pages/BackgroundRemover";
import ImageConverter from "./pages/ImageConverter";
import ImageCompressor from "./pages/ImageCompressor";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Contact from "./pages/Contact";
import About from "./pages/About";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/background-remover" element={<BackgroundRemover />} />
          <Route path="/image-compressor" element={<ImageCompressor />} />
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
