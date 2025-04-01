"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export interface TestCase {
  id: number;
  input: string;
  output: string;
}

interface Question {
  id: number;
  question: string;
  testCaseId: TestCase[];
}

type Difficulty = "easy" | "medium" | "hard";

interface QuestionsState {
  easy: Question[];
  medium: Question[];
  hard: Question[];
}

const Cpp = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [, setWorker] = useState<Worker | null>(null);
  const [questions, setQuestions] = useState<QuestionsState>({
    easy: [],
    medium: [],
    hard: [],
  });
  const [selectedSection, setSelectedSection] = useState<Difficulty>("easy");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pointsToAdd, setPointsToAdd] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("language")) {
      localStorage.setItem("language", "cpp");
    }
    const storedScore = localStorage.getItem("score");
    if (storedScore) {
      setScore(parseInt(storedScore, 10));
    }

    const storedLanguage = localStorage.getItem("language");
    const currentLanguage = pathname.split("/")[1];

    if (storedLanguage && storedLanguage !== currentLanguage) {
      router.replace(`/${storedLanguage}`);
      return;
    }
  }, [pathname, router]);

  useEffect(() => {
    const checkEventStatus = async () => {
      if (localStorage.getItem("end") === "true") {
        router.replace("/end");
        return;
      }
    };

    checkEventStatus();
  }, [router]);

  useEffect(() => {
    let timerWorker: Worker | null = null;

    const fetchStartTime = async () => {
      try {
        const response = await axios.get(
          "https://coding-relay-be.onrender.com/leaderboard/getTimer"
        );
        const { start_time } = response.data;

        const eventStartTime = new Date(start_time).getTime();
        const eventEndTime = eventStartTime + 1.25 * 60 * 60 * 1000;
        const currentTime = new Date().getTime();

        const remainingTime = Math.max(
          Math.floor((eventEndTime - currentTime) / 1000),
          0
        );
        setTimeLeft(remainingTime);

        startTimerWorker(remainingTime);
      } catch (error) {
        console.error("Failed to fetch start time", error);
      }
    };

    const startTimerWorker = (initialTime: number) => {
      timerWorker = new Worker(new URL("./worker.ts", import.meta.url));

      setWorker(timerWorker);

      timerWorker.onmessage = (e) => {
        if (e.data === "end") {
          localStorage.setItem("end", "true");
          window.location.replace("/end");
        } else {
          setTimeLeft(e.data);
        }
      };

      timerWorker.postMessage({ type: "start", time: initialTime });
    };

    fetchStartTime();

    return () => {
      if (timerWorker) {
        timerWorker.terminate();
      }
    };
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${secs}`;
  };

  const fetchQuestions = async () => {
    const difficulties: Difficulty[] = ["easy", "medium", "hard"];
    const fetchedQuestions: QuestionsState = {
      easy: [],
      medium: [],
      hard: [],
    };

    for (const difficulty of difficulties) {
      try {
        const response = await axios.get(
          `https://coding-relay-be.onrender.com/questions/getQuestionsByDifficulty?difficulty=${difficulty}&language=cpp`
        );
        const availableQuestions = response.data;

        const storedQuestionKeys: Record<Difficulty, string[]> = {
          easy: ["easy-question1", "easy-question2"],
          medium: ["medium-question1", "medium-question2"],
          hard: ["hard-question1"],
        };

        const storedIds = storedQuestionKeys[difficulty].map((key) =>
          localStorage.getItem(key)
        );

        if (storedIds.every((id) => id !== null)) {
          const selectedQuestions = storedIds
            .filter((id): id is string => id !== null)
            .map((id) =>
              availableQuestions.find(
                (q: Question) => q.id === parseInt(id, 10)
              )
            )
            .filter((q): q is Question => q !== undefined);

          fetchedQuestions[difficulty] = selectedQuestions;
        } else {
          const selectedQuestions: Question[] =
            difficulty === "hard"
              ? [
                  availableQuestions[
                    Math.floor(Math.random() * availableQuestions.length)
                  ],
                ]
              : availableQuestions.sort(() => 0.5 - Math.random()).slice(0, 2);

          selectedQuestions.forEach((q: Question, index: number) => {
            localStorage.setItem(
              `${difficulty}-question${index + 1}`,
              q.id.toString()
            );
          });

          fetchedQuestions[difficulty] = selectedQuestions;
        }
      } catch (error) {
        console.error(`Failed to fetch ${difficulty} questions`, error);
      }
    }
    setQuestions(fetchedQuestions);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setPointsToAdd("");
    setPassword("");
    setError("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPointsToAdd("");
    setPassword("");
    setError("");
  };

  const handleSubmitScore = () => {
    const points = parseInt(pointsToAdd, 10);

    if (isNaN(points) || points <= 0) {
      setError("Please enter a valid positive number for points");
      return;
    }

    if (password === "pogu") {
      const newScore = score + points;
      localStorage.setItem("score", newScore.toString());
      setScore(newScore);
      toast.success(`Score updated to ${newScore}`);
      closeModal();
    } else {
      setError("Incorrect password. Score not updated.");
    }
  };

  const handleSectionChange = (level: Difficulty) => {
    setSelectedSection(level);
    window.scrollTo(0, 0);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center w-fit mx-10">
      <div className="absolute left-0 top-0 rounded-2xl text-black text-[5rem] font-bold bg-white/90 px-7 py-0 border-4 border-orange-500 shadow-[#b4501e99] shadow-md hover:shadow-xl hover:shadow-[#b4501e99] transition-all duration-500">
        {formatTime(timeLeft)}
      </div>
      <div className="text-black text-[6rem] absolute top-0 right-0">
        Score: {score}
      </div>
      <div className="relative top-20 my-16 flex flex-col items-center justify-center w-full h-max gap-y-5">
        <AnimatePresence mode="wait">
          {questions[selectedSection].map((question) => (
            <motion.div
              key={question.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="p-1 relative break-words w-[92.5vw] h-fit bg-transparent rounded-lg space-y-7"
            >
              <pre className="border-orange-500 shadow-[#b4501e99] shadow-md hover:shadow-xl hover:shadow-[#b4501e99] transition-all duration-500 flex flex-col items-left text-black justify-center bg-white/90 w-full p-4 h-full rounded-lg text-[1.3rem] px-5">
                <span className="font-bold text-2xl">Debug this code:</span>{" "}
                <br />
                {question.question}
              </pre>
              <p className="text-5xl">Test Cases for the above code:</p>
              <div className="w-full h-max flex flex-col items-center justify-center gap-y-5">
                {question.testCaseId.map((testCase: TestCase) => (
                  <div
                    key={testCase.id}
                    className="border-orange-500 shadow-[#b4501e99] shadow-md hover:shadow-xl hover:shadow-[#b4501e99] transition-all duration-500 relative p-1 text-xl break-words w-full h-fit bg-white/90 rounded-lg"
                  >
                    <pre className="flex gap-y-2 flex-col items-start justify-center bg-white/90 text-black w-full h-full p-4 rounded-lg text-xl px-5">
                      <span>Input: {testCase.input}</span>
                      <span>Output: {testCase.output}</span>
                    </pre>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative flex items-center justify-between w-full h-max top-10 my-6">
        <div className="flex gap-x-4">
          {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
            <Button
              key={level}
              onClick={() => handleSectionChange(level)}
              className="relative w-36 h-16 p-1 rounded-lg hover:bg-red-700 bg-orange-900 transition-all duration-500 group"
            >
              <div className="flex items-center justify-center w-full h-full p-5 text-2xl text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4301e99] group-hover:bg-white/90 group-hover:text-[1.65rem] uppercase">
                {level}
              </div>
            </Button>
          ))}
        </div>
        <div>
          <Button
            onClick={openModal}
            className="relative w-60 h-16 p-1 rounded-lg hover:bg-red-700 bg-orange-900 transition-all duration-500 group"
          >
            <div className="flex items-center justify-center w-full h-full px-10 py-5 text-[1.7rem] text-black bg-white/90 rounded-lg transition-all duration-500 group-hover:shadow-xl group-hover:shadow-[#b4301e99] group-hover:bg-white/90 group-hover:text-[1.8rem] uppercase">
              Submit Code
            </div>
          </Button>
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black opacity-75"
            onClick={closeModal}
          ></div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative p-2 rounded-lg bg-orange-500 z-10 w-[500px]"
          >
            <div className="bg-white/90 p-8 rounded-lg">
              <h2 className="text-4xl font-bold mb-6 text-black text-center">
                Submit Score
              </h2>

              {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                  {error}
                </div>
              )}

              <div className="mb-6">
                <label className="block text-black text-2xl mb-2">
                  Points to Add:
                </label>
                <input
                  type="number"
                  value={pointsToAdd}
                  onChange={(e) => setPointsToAdd(e.target.value)}
                  className="border-orange-500 rounded-lg shadow-[#b4501e99] shadow-md outline-none focus:shadow-xl focus:shadow-[#b4501e99] transition-all duration-500 w-full p-3 text-xl border-2 focus:outline-none focus:border-orange-600 bg-white/90 text-black"
                  placeholder="Enter points"
                />
              </div>

              <div className="mb-8">
                <label className="block text-black text-2xl mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 text-xl border-2 bg-white/90 border-orange-500 rounded-lg shadow-[#b4501e99] shadow-md outline-none focus:shadow-xl focus:shadow-[#b4501e99] transition-all duration-500 text-black"
                  placeholder="Enter password"
                />
              </div>
              <div className="flex justify-between gap-4">
                <Button
                  onClick={closeModal}
                  className="w-1/2 h-12 p-1 rounded-lg bg-red-500 transition-all duration-500 group"
                >
                  <div className="bg-white/90 border-[3px] border-orange-500 rounded-lg outline-none transition-all duration-500 flex items-center justify-center w-full h-full p-3 text-xl text-black uppercase hover:text-[1.4rem]">
                    Cancel
                  </div>
                </Button>
                <Button
                  onClick={handleSubmitScore}
                  className="w-1/2 h-12 p-1 rounded-lg bg-red-500 transition-all duration-500 group"
                >
                  <div className="bg-white/90 border-[3px] border-orange-500 rounded-lg outline-none transition-all duration-500 flex items-center justify-center w-full h-full p-3 text-xl text-black uppercase hover:text-[1.4rem]">
                    Submit
                  </div>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Cpp;
