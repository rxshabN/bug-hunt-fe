"use client";

import { Button } from "@/components/ui/button";
import { motion, AnimatePresence, easeInOut } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import axios, { AxiosError } from "axios";

export default function Home() {
  const router = useRouter();
  const [showText, setShowText] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [name, setName] = useState("");
  const [regNo, setRegNo] = useState("");

  useEffect(() => {
    const checkEventStatus = async () => {
      if (localStorage.getItem("end") === "true") {
        router.replace("/end");
        return;
      }
    };
    checkEventStatus();

    const storedName = localStorage.getItem("name");
    const storedRegNo = localStorage.getItem("registration_number");

    if (storedName && storedRegNo) {
      setName(storedName);
      setRegNo(storedRegNo);
      setTimeout(() => {
        setShowText(false);
        setShowButtons(true);
      }, 6500);
    } else {
      setTimeout(() => {
        setShowText(false);
        setShowForm(true);
      }, 6500);
    }
  }, [router]);

  const handleSubmit = () => {
    if (!name.trim() || !regNo.trim()) {
      toast.error("Please fill out both fields!");
      return;
    }
    localStorage.setItem("name", name);
    localStorage.setItem("registration_number", regNo);
    localStorage.setItem("score", "0");
    setShowForm(false);
    setShowButtons(true);
  };

  const handleClick = async (id: string) => {
    try {
      await axios.get(
        "https://coding-relay-be.onrender.com/leaderboard/getTimer"
      );
      router.push(`/${id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 400) {
        toast.error("Event has not started yet");
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-start text-center">
        <AnimatePresence mode="wait">
          {showText && (
            <motion.div
              key="text"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: easeInOut }}
            >
              <h1 className="line-1 anim-typewriter">Bug Hunt 2.0</h1>
              <h2 className="line-2 anim-typewriter-2">
                It&apos;s not a <span className="text-black">bug, </span>
                it&apos;s a <span className="text-black">feature!</span>
              </h2>
            </motion.div>
          )}
          {showForm && (
            <motion.div
              key="input-form"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8, ease: easeInOut }}
              className="flex flex-col gap-6 items-center justify-center h-[50vh]"
            >
              <input
                type="text"
                placeholder="Enter your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-96 h-16 p-1 text-2xl text-center bg-white/90 border-[3px] border-orange-500 rounded-lg shadow-[#b4501e99] shadow-md outline-none focus:shadow-xl focus:shadow-[#b4501e99] transition-all duration-500"
              />
              <input
                type="text"
                placeholder="Enter your Registration Number"
                value={regNo}
                onChange={(e) => setRegNo(e.target.value)}
                className="w-96 h-16 text-2xl p-1 text-center bg-white/90 border-[3px] border-orange-500 rounded-lg shadow-[#b4501e99] shadow-md outline-none focus:shadow-xl focus:shadow-[#b4501e99] transition-all duration-500"
              />
              <Button
                onClick={handleSubmit}
                className="relative w-52 h-16 p-1 rounded-lg bg-orange-500 transition-all duration-500 group"
              >
                <div className="flex items-center justify-center w-full h-full px-10 py-5 text-2xl text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4501e99] group-hover:bg-white/90 group-hover:text-[1.8rem]">
                  Submit
                </div>
              </Button>
            </motion.div>
          )}
          {showButtons && (
            <motion.div
              key="new-content"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: easeInOut }}
              className="flex flex-col gap-y-10 text-black items-center justify-start h-[60vh] mt-24"
            >
              <h2 className="text-center text-7xl">Welcome, {name}</h2>
              <h3 className="text-center text-4xl">
                Select your preferred programming language to begin
              </h3>
              <div className="gap-x-10 flex items-center justify-center">
                <Button
                  onClick={() => handleClick("python")}
                  className="relative w-96 h-20 p-1 rounded-lg bg-orange-500 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4501e99] group-hover:bg-white/90 group-hover:text-[2.2rem]">
                    Python
                  </div>
                </Button>
                <Button
                  onClick={() => handleClick("cpp")}
                  className="relative w-96 h-20 p-1 rounded-lg bg-orange-500 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4501e99] group-hover:bg-white/90 group-hover:text-[2.2rem]">
                    C/C++
                  </div>
                </Button>
                <Button
                  onClick={() => handleClick("java")}
                  className="relative w-96 h-20 p-1 rounded-lg bg-orange-500 transition-all duration-500 group"
                >
                  <div className="flex items-center justify-center w-full h-full px-10 py-5 text-3xl text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4501e99] group-hover:bg-white/90 group-hover:text-[2.2rem]">
                    Java
                  </div>
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <Toaster />
      </div>
    </>
  );
}
