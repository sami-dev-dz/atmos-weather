"use client";
import React from "react";
import { LuEye, LuSunrise, LuSunset } from "react-icons/lu";
import { FiDroplet } from "react-icons/fi";
import { MdAir } from "react-icons/md";
import { ImMeter } from "react-icons/im";

export interface WeatherDetailProps {
  visability: string;
  humidity: string;
  windSpeed: string;
  airPressure: string;
  sunrise: string;
  sunset: string;
}

const metrics = (props: WeatherDetailProps) => [
  { icon: <LuEye />,      label: "Visibility",  value: props.visability  },
  { icon: <FiDroplet />,  label: "Humidity",    value: props.humidity    },
  { icon: <MdAir />,      label: "Wind",        value: props.windSpeed   },
  { icon: <ImMeter />,    label: "Pressure",    value: props.airPressure },
  { icon: <LuSunrise />,  label: "Sunrise",     value: props.sunrise     },
  { icon: <LuSunset />,   label: "Sunset",      value: props.sunset      },
];

export default function WeatherDetails(props: WeatherDetailProps) {
  return (
    <>
      {metrics(props).map((m, i) => (
        <SingleWeatherDetail key={i} icon={m.icon} information={m.label} value={m.value} />
      ))}
    </>
  );
}

export interface SingleWeatherDetailProps {
  information: string;
  icon: React.ReactNode;
  value: string;
}

function SingleWeatherDetail({ information, icon, value }: SingleWeatherDetailProps) {
  return (
    <div className="flex flex-col items-center gap-1.5 text-center min-w-[64px]">
      <p className="label-caps">{information}</p>
      <div className="text-xl text-secondary">{icon}</div>
      <p className="text-white text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}