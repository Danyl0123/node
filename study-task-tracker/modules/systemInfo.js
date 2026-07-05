import os from "os";

export const getSystemInfo = () => {
  console.log("Operating System:", os.type());
  console.log("Free Memory:", os.freemem(), "bytes");
  console.log("System Uptime:", os.uptime(), "seconds");
  console.log("Number of CPUs:", os.cpus().length);
};
