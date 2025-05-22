import { InfiniteMovingCards } from "./ui/infinite-moving-cards";
import { motion } from "motion/react";
import bg from "../assets/images/bg.png";
import synthetix from "../assets/images/synthetix.png";
import binance from "../assets/images/binance.png";
import uniswap from "../assets/images/uniswap.png";
import base from "../assets/images/base.png";

const companies = [
  {
    name: "Synthetix",
    logo: synthetix,
  },
  {
    name: "Binance",
    logo: binance,
  },
  {
    name: "Uniswap",
    logo: uniswap,
  },
  {
    name: "Base",
    logo: base,
  },
];

function Companies() {
  return (
    <div className="pt-20" style={{ backgroundImage: `url(${bg})` }}>
      <motion.h1
        className="text-4xl font-bold text-center"
        style={{ fontFamily: "KarlaBold" }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Trusted by Companies Worldwide
      </motion.h1>
      <div className="w-full flex justify-center items-center mt-8">
        <InfiniteMovingCards
          items={companies}
          direction="left"
          speed="normal"
          pauseOnHover={true}
        />
      </div>
    </div>
  );
}

export default Companies;
