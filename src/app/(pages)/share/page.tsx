"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

const Share = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/");
  }, [router]);

  return <div>Redirecting to home...</div>;
};

export default Share;
