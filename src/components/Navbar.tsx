"use client";
import React, { useState } from "react";
import { MdOutlineLocationOn, MdMyLocation } from "react-icons/md";
import { TbSunFilled } from "react-icons/tb";
import { IoSearch } from "react-icons/io5";
import axios from "axios";
import { loadingCityAtom, placeAtom } from "@/app/atom";
import { useAtom } from "jotai";

type Props = { location?: string };
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_KEY;

export default function Navbar({ location }: Props) {
  const [city, setCity] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [, setPlace] = useAtom(placeAtom);
  const [, setLoadingCity] = useAtom(loadingCityAtom);

  async function handleInputChange(value: string) {
    setCity(value);
    if (value.length >= 3) {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}`
        );
        setSuggestions(res.data.list.map((item: any) => item.name));
        setError("");
        setShowSuggestions(true);
      } catch {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }

  function handleSuggestionClick(value: string) {
    setCity(value);
    setShowSuggestions(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoadingCity(true);
    if (suggestions.length === 0) {
      setError("City not found");
      setLoadingCity(false);
    } else {
      setError("");
      setTimeout(() => {
        setLoadingCity(false);
        setPlace(city);
        setShowSuggestions(false);
        setCity("");
      }, 400);
    }
  }

  function handleCurrentLocation() {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        setLoadingCity(true);
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${API_KEY}`
        );
        setTimeout(() => {
          setLoadingCity(false);
          setPlace(res.data.name);
        }, 400);
      } catch {
        setLoadingCity(false);
      }
    });
  }

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: "rgba(7, 11, 20, 0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <div className="flex items-center gap-2.5 shrink-0">
          <TbSunFilled className="text-[22px] accent-warm" />
          <span className="text-white font-semibold text-[17px] tracking-tight">Atmos</span>
        </div>

        {/* Location chip */}
        {location && (
          <div className="hidden md:flex items-center gap-1.5 text-secondary text-sm">
            <MdOutlineLocationOn className="text-base accent-cool shrink-0" />
            <span className="truncate max-w-[160px]">{location}</span>
          </div>
        )}

        {/* Right controls */}
        <div className="flex items-center gap-3 ml-auto">
          <button
            onClick={handleCurrentLocation}
            title="Use current location"
            className="p-2 rounded-lg text-tertiary hover:text-white transition-colors"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <MdMyLocation className="text-[18px]" />
          </button>

          {/* Search */}
          <div className="relative">
            <form onSubmit={handleSubmit} className="flex items-center h-9">
              <input
                type="text"
                value={city}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Search city…"
                className="w-[190px] h-full px-4 text-sm text-white placeholder:text-tertiary focus:outline-none transition-all"
                style={{
                  backgroundColor: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRight: "none",
                  borderRadius: "8px 0 0 8px",
                }}
              />
              <button
                type="submit"
                className="h-full px-3 text-tertiary hover:text-white transition-colors"
                style={{
                  backgroundColor: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderLeft: "none",
                  borderRadius: "0 8px 8px 0",
                }}
              >
                <IoSearch className="text-[15px]" />
              </button>
            </form>

            {((showSuggestions && suggestions.length > 0) || error) && (
              <ul
                className="absolute top-11 left-0 w-full rounded-xl overflow-hidden z-50"
                style={{ backgroundColor: "#111826", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                {error && (
                  <li className="px-4 py-3 text-sm" style={{ color: "#ef4444" }}>{error}</li>
                )}
                {suggestions.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleSuggestionClick(item)}
                    className="px-4 py-2.5 text-sm text-secondary hover:text-white cursor-pointer transition-colors"
                    style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none" }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)")}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}