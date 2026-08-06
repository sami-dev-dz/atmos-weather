"use client";
import React from "react";
import WeatherIcon from "./WeatherIcon";
import WeatherDetails, { WeatherDetailProps } from "./WeatherDetails";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { format, parseISO } from "date-fns";

export interface ForecastWeatherDetailProps extends WeatherDetailProps {
  weatherIcon: string;
  date: string;
  day: string;
  temp: number;
  feels_like: number;
  temp_min: number;
  temp_max: number;
  description: string;
}

export default function ForecastWeatherDetail(props: ForecastWeatherDetailProps) {
  const { weatherIcon = "02d", date, day, temp, temp_min, temp_max, description } = props;

  return (
    <div
      className="rounded-2xl px-6 py-5 flex flex-col sm:flex-row gap-5 sm:gap-8 sm:items-center fade-up"
      style={{ backgroundColor: "#0d1220", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* Day + icon */}
      <div className="flex items-center gap-4 sm:w-52 shrink-0">
        <WeatherIcon iconName={weatherIcon} className="h-14 w-14" />
        <div>
          <p className="text-white font-semibold text-sm leading-none">{day}</p>
          <p className="label-caps mt-1">{date}</p>
          <p className="text-secondary text-xs mt-1 capitalize">{description}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="divider sm:hidden" />
      <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

      {/* Temp */}
      <div className="flex items-baseline gap-3 sm:w-32 shrink-0">
        <span className="text-white text-3xl font-bold tabular-nums">
          {convertKelvinToCelsius(temp ?? 0)}°
        </span>
        <div className="flex flex-col text-xs leading-tight tabular-nums">
          <span className="accent-warm font-medium">{convertKelvinToCelsius(temp_max ?? 0)}°</span>
          <span className="text-tertiary">{convertKelvinToCelsius(temp_min ?? 0)}°</span>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden sm:block w-px self-stretch" style={{ backgroundColor: "rgba(255,255,255,0.06)" }} />

      {/* Details */}
      <div className="flex-1 flex flex-wrap gap-x-6 gap-y-3 justify-start sm:justify-around">
        <WeatherDetails {...props} />
      </div>
    </div>
  );
}