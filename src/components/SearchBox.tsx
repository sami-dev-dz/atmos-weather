"use client";
import { cn } from "@/utils/cn";
import React from "react";
import { IoSearch } from "react-icons/io5";

type Props = {
  className?: string;
  value: string;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
};

export default function SearchBox(props: Props) {
  return (
    <form
      onSubmit={props.onSubmit}
      className={cn(
        "flex relative items-center justify-center h-10",
        props.className
      )}
    >
      <input
        type="text"
        value={props.value}
        onChange={props.onChange}
        placeholder="Search city..."
        className="px-4 py-2 w-[240px] bg-white/10 border border-white/20 rounded-l-full focus:outline-none focus:border-blue-400/60 focus:bg-white/15 h-full text-white placeholder:text-white/40 text-sm transition-all duration-300"
      />
      <button className="px-4 py-[9px] bg-blue-500/70 hover:bg-blue-500 text-white rounded-r-full focus:outline-none h-full transition-all duration-300 border border-blue-400/30 border-l-0">
        <IoSearch className="text-base" />
      </button>
    </form>
  );
}