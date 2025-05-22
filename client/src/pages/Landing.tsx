import Companies from "../components/Companies";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import How from "../components/How";
import { CTA } from "../components/CTA";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import { useState } from "react";
import MobileMenuOverlay from "@/components/MobileMenu";
import { createPortal } from "react-dom";

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div style={{ fontFamily: "KarlaRegular" }}>
      <Navbar onMenuClick={() => setMenuOpen(true)} />
      {menuOpen &&
        createPortal(
          <MobileMenuOverlay onClose={() => setMenuOpen(false)} />,
          document.body
        )}
      <Hero />
      <Companies />
      <How />
      <CTA />
      <FAQ />
      <Footer />
    </div>
  );
}

export default Landing;
