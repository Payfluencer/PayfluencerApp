import Companies from "../components/Companies";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import How from "../components/How";
import { CTA } from "../components/CTA";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
function Landing() {
  return (
    <div style={{ fontFamily: "KarlaRegular" }}>
      <Navbar />
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
