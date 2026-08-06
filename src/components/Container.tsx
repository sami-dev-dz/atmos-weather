"use client";
import { cn } from "@/utils/cn";
import React from "react";

export default function Container(props: React.HTMLProps<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={cn("w-full surface rounded-2xl flex py-5", props.className)}
    />
  );
}