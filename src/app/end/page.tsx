"use client";

import { easeInOut, motion } from "framer-motion";
import { useEffect, useState } from "react";

const Verified = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [score, setScore] = useState(0);
  useEffect(() => {
    const score = localStorage.getItem("score");
    const name = localStorage.getItem("name");
    const regNo = localStorage.getItem("registration_number");
    if (score && name && regNo) {
      setScore(parseInt(score, 10));
      setName(name);
      setRegNo(regNo);
    }
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: easeInOut }}
      className="min-h-screen min-w-screen flex flex-col gap-y-10 items-center justify-center -mt-52"
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5, ease: easeInOut }}
        className="text-5xl"
      >
        The hunt is over!
      </motion.h1>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.3, ease: easeInOut }}
        className="text-7xl text-center"
      >
        Your final score is {score}
      </motion.h2>
      <motion.h3
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.1, ease: easeInOut }}
        className="text-4xl text-center"
      >
        Your details: {name}, {regNo}
      </motion.h3>
    </motion.div>
  );
};

export default Verified;
