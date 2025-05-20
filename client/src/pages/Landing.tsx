import Hero from "../components/Hero";
import Navbar from "../components/Navbar";

function Landing() {
  return (
    <div style={{ fontFamily: "KarlaRegular" }}>
      <Navbar />
      <Hero />

      <section className="max-w-[1240px] mx-auto my-0 px-2"></section>
    </div>
  );
}

export default Landing;
