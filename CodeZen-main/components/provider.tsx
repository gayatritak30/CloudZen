"use client";

import React from "react";
import { ClerkProvider } from "@clerk/nextjs";
const provider = ({ children }: { children: React.ReactNode }) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};

export default provider;
