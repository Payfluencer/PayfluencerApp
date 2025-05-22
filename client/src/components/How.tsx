import { motion } from "motion/react";
import bg from "../assets/images/bg.png";
import { FaAward } from "react-icons/fa";
import { IoIosChatboxes } from "react-icons/io";
import { TfiWrite } from "react-icons/tfi";
import Working from "./Working";
import { Button } from "./ui/button";
import publish from "../assets/images/publish.png";
import submit from "../assets/images/submit.jpg";
import payouts from "../assets/images/payouts.svg";
import { useState } from "react";
const workings = [
  {
    index: "1",
    title: "Publish a Bounty",
    description:
      "Publish a bounty for your project and get it done by the community.",
    icon: <TfiWrite size={64} color="#202020FF" />,
  },
  {
    index: "2",
    title: "Creators Respond",
    description: "Creators respond to your bounty and submit their proposals.",
    icon: <IoIosChatboxes size={64} color="#202020FF" />,
  },
  {
    index: "3",
    title: "Approve & Reward",
    description:
      "Approve the creator's proposal and reward them via our platform.",
    icon: <FaAward size={64} color="#202020FF" />,
  },
];

function How() {
  const activeImages = [publish, submit, payouts];
  const [active, setActive] = useState(1);
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
      <div className="flex flex-col gap-4 md:flex-row justify-center md:gap-12 items-center mt-12 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4 justify-center items-center">
          {workings.map((working) => (
            <Working
              key={working.title}
              working={working}
              active={active}
              setActive={setActive}
            />
          ))}
        </div>
        <div className="w-full md:w-1/2 bg-gray-200 shadow-lg rounded-lg p-4">
          <img
            src={activeImages[active - 1]}
            alt="active"
            className="object-cover border-[1px] border-[#fff] rounded-lg"
          />
        </div>
      </div>
      <div className="flex justify-center items-center mt-8">
        <Button className="bg-[#000] text-white py-2 rounded-md text-xl px-12 h-12">
          Learn More
        </Button>
      </div>
    </div>
  );
}

export default How;
