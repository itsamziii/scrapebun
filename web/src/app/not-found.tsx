"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { motion } from "framer-motion";
import OrbScene from "./_components/orbScene";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";

const NotFound = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    const redirect = setTimeout(() => {
      router.push("/");
    }, 10000);

    return () => {
      clearTimeout(redirect);
      clearInterval(timer);
    };
  }, [router]);

  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 z-0 opacity-50">
        <OrbScene />
      </div>

      <div className="relative z-10 mx-auto max-w-md text-center">
        <motion.h1
          className="text-primary mb-4 text-9xl font-bold"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          404
        </motion.h1>

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="mb-6 text-3xl font-bold">Page Not Found</h2>
          <p className="text-muted-foreground mb-6 text-lg">
            We couldn't find the page you were looking for. Perhaps you took a
            wrong turn in digital space.
          </p>

          <div className="mb-6">
            <p className="text-muted-foreground text-sm">
              Redirecting to home in {countdown} seconds...
            </p>
          </div>

          <Button size="lg" onClick={() => router.push("/")} className="mx-2">
            Return to Home
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
