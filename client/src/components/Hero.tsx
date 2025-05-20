import Lottie from "lottie-react";
import animationData from "../assets/lottie/hero.json";
import bg from "../assets/images/bg.png";
import { Button } from "@/components/ui/button";
import { TextGenerateEffect } from "./ui/text-generate-effect";
function Hero() {
  const title = "Crowdsource Your Branded Content in Minutes";
  return (
    <div
      className="flex items-center justify-between h-screen"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <section className="max-w-[1240px] mx-auto my-0 px-2 flex items-center justify-between h-screen flex-col md:mt-0 md:flex-row">
        <div className="flex flex-col items-center justify-center md:w-1/2 ">
          <TextGenerateEffect
            words={title}
            className="text-4xl md:text-6xl font-bold text-center md:text-left mt-10"
            duration={0.5}
          />
          <p className="text-lg md:text-xl text-gray-500 mt-4 text-center md:text-left">
            Post bounties. Get high‑quality blog posts, videos, tweets &
            more—rewarding creators at every step.
          </p>
          <div className="flex items-center mt-12 flex-col md:flex-row gap-4 w-full">
            <Button className="bg-[#FA5E06] text-white px-4 py-2 rounded-md w-full md:w-1/4 text-xl">
              Get Started
            </Button>
            <button className="bg-gray-900 text-[#fff] px-4 py-2 rounded-md w-full md:w-1/4 text-xl">
              Learn More
            </button>
          </div>
        </div>
        <div className="flex items-center justify-center md:w-1/2">
          <Lottie animationData={animationData} loop={true} />
        </div>
      </section>
    </div>
  );
}

export default Hero;
