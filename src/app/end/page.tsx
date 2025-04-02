"use client";

import { easeInOut, motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Verified = () => {
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");
  const [score, setScore] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const score = localStorage.getItem("score");
    const name = localStorage.getItem("name");
    const regNo = localStorage.getItem("registration_number");
    const dataSubmitted = localStorage.getItem("dataSubmitted") === "true";

    if (score && name && regNo) {
      const scoreInt = parseInt(score, 10);
      setScore(scoreInt);
      setName(name);
      setRegNo(regNo);
      setIsSubmitted(dataSubmitted);

      const submitData = async () => {
        try {
          const response = await axios.post(
            "https://coding-relay-be.onrender.com/teams/createTeam",
            {
              team_name: `${name},\n${regNo}`,
              score: scoreInt,
            }
          );

          if (response.status === 200) {
            localStorage.setItem("dataSubmitted", "true");
            setIsSubmitted(true);
            toast.success("Details updated successfully in database");
          }
        } catch (error) {
          toast.error("Failed to update details in database");
        }
      };

      if (!dataSubmitted) {
        submitData();
      }
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
      {isSubmitted ? (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.8, ease: easeInOut }}
          className="text-xl text-black-500"
        >
          Your score has been submitted!
        </motion.p>
      ) : (
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 2.8, ease: easeInOut }}
          className="text-xl text-black-500"
        >
          Failed to submit score!
        </motion.p>
      )}
    </motion.div>
  );
};

export default Verified;
