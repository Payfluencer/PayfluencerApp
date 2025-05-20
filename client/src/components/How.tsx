import { motion } from "motion/react";
import bg from "../assets/images/bg.png";
import { FaAward } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import Working from "./Working";
import { Button } from "./ui/button";

const workings = [
  {
    title: "Publish a Bounty",
    description:
      "Publish a bounty for your project and get it done by the community.",
    icon: <TfiWrite size={64} color="#FA5E06" />,
  },
  {
    title: "Creators Respond",
    description: "Creators respond to your bounty and submit their proposals.",
    icon: <IoIosChatboxes size={64} color="#FA5E06" />,
  },
  {
    title: "Approve & Reward",
    description:
      "Approve the creator's proposal and reward them via our platform.",
    icon: <FaAward size={64} color="#FA5E06" />,
  },
];

function How() {
  return (
    <div className="pt-20 pb-20" style={{ backgroundImage: `url(${bg})` }}>
      <motion.h1
        className="text-4xl font-bold text-center my-8`"
        style={{ fontFamily: "KarlaBold" }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        How it works
      </motion.h1>
      <div className="flex flex-col gap-4 md:flex-row justify-center items-center mt-12">
        {workings.map((working) => (
          <Working key={working.title} working={working} />
        ))}
      </div>
      <div className="flex justify-center items-center mt-8">
        <Button className="bg-[#FA5E06] text-white px-4 py-2 rounded-md text-xl h-12">
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default How;
