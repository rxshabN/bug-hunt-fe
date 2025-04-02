export let remainingTime = 0;
let intervalId: ReturnType<typeof setInterval> | null = null;

self.onmessage = (e) => {
  if (e.data.type === "start") {
    if (intervalId !== null) {
      clearInterval(intervalId);
    }

    remainingTime = e.data.time;

    intervalId = setInterval(() => {
      if (remainingTime > 0) {
        remainingTime--;
        self.postMessage(remainingTime);
      } else {
        self.postMessage("end");
        if (intervalId !== null) {
          clearInterval(intervalId);
          intervalId = null;
        }
      }
    }, 1000);
  }
};
