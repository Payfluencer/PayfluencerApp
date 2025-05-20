import { Button } from "./ui/button";
import { Vortex } from "./ui/vortex";

export function CTA() {
  return (
    <div className="w-[100%] overflow-hidden pb-20">
      <Vortex
        backgroundColor="white"
        rangeY={800}
        particleCount={500}
        baseHue={120}
        className="flex items-center flex-col justify-center px-2 md:px-10  py-4 w-full h-[350px]"
      >
        <h2 className="text-black text-2xl md:text-6xl font-bold text-center mt-12">
          Ready to power your next campaign with user‑generated content?
        </h2>
        <p className="text-black text-sm md:text-2xl max-w-xl mt-6 text-center">
          Post bounties. Get high‑quality blog posts, videos, tweets &
          more—rewarding creators at every step.
        </p>
        <div className="flex items-center mt-12 flex-col md:flex-row gap-4 w-full justify-center">
          <Button className="bg-[#FA5E06] text-white px-4 py-2 rounded-md text-xl h-12">
            Get Started
          </Button>
          <Button className="bg-gray-900 text-[#fff] px-4 py-2 rounded-md text-lg h-12">
            For Companies
          </Button>
        </div>
      </Vortex>
    </div>
  );
}
