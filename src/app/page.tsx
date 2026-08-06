"use client";
import Container from "@/components/Container";
import ForecastWeatherDetail from "@/components/ForecastWeatherDetail";
import Navbar from "@/components/Navbar";
import WeatherDetails from "@/components/WeatherDetails";
import WeatherIcon from "@/components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format, fromUnixTime, parseISO } from "date-fns";
import { useQuery } from "react-query";
import { loadingCityAtom, placeAtom } from "./atom";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { MdOutlineLocationOn } from "react-icons/md";
import { LuSunrise, LuSunset } from "react-icons/lu";

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    temp_kf: number;
    sea_level: number;
    grnd_level: number;
  };
  weather: { id: number; main: string; description: string; icon: string }[];
  clouds: { all: number };
  wind: { speed: number; deg: number; gust: number };
  visibility: number;
  pop: number;
  sys: { pod: string };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: { lat: number; lon: number };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

export default function Home() {
  const [place] = useAtom(placeAtom);
  const [loadingCity] = useAtom(loadingCityAtom);

  const { isLoading, error, data, refetch } = useQuery<WeatherData, Error>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${place}&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );

  useEffect(() => { refetch(); }, [place, refetch]);

  const firstData = data?.list[0];

  const uniqueDates = [
    ...new Set(
      data?.list.map(
        (entry) => new Date(entry.dt * 1000).toISOString().split("T")[0]
      )
    ),
  ];

  const firstDataForEachDate = uniqueDates.map((date) =>
    data?.list.find((entry) => {
      const entryDate = new Date(entry.dt * 1000).toISOString().split("T")[0];
      const entryTime = new Date(entry.dt * 1000).getHours();
      return entryDate === date && entryTime >= 6;
    })
  ).filter(Boolean);

  if (isLoading) return <FullPageSkeleton />;

  if (error)
    return (
      <div style={{ backgroundColor: "#070b14" }} className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg font-semibold">{error.message}</p>
          <p className="text-tertiary text-sm mt-2">Check your API key or network connection.</p>
        </div>
      </div>
    );

  const sunriseFormatted = data?.city?.sunrise
    ? format(fromUnixTime(data.city.sunrise), "H:mm")
    : "—";
  const sunsetFormatted = data?.city?.sunset
    ? format(fromUnixTime(data.city.sunset), "H:mm")
    : "—";

  return (
    <div style={{ backgroundColor: "#070b14", minHeight: "100vh" }}>
      <Navbar location={data?.city.name ? `${data.city.name}, ${data.city.country}` : undefined} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-16 pt-8 flex flex-col gap-5">
        {loadingCity ? <ContentSkeleton /> : (
          <>

            {/* ── Hero ────────────────────────────────────────────── */}
            <div
              className="rounded-3xl p-7 sm:p-10 relative overflow-hidden fade-up fade-up-1"
              style={{ backgroundColor: "#0d1220", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              {/* subtle top-right ambient */}
              <div
                className="absolute -top-24 -right-24 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(232,168,64,0.06) 0%, transparent 70%)" }}
              />

              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 relative z-10">
                <div>
                  {/* Date */}
                  <p className="label-caps mb-4">
                    {format(parseISO(firstData?.dt_txt ?? new Date().toISOString()), "EEEE, dd MMMM yyyy")}
                  </p>

                  {/* Temperature */}
                  <div className="flex items-start gap-1">
                    <span className="temp-display">{convertKelvinToCelsius(firstData?.main.temp ?? 296)}</span>
                    <span className="text-white text-5xl font-light mt-4">°C</span>
                  </div>

                  {/* Condition + feels like */}
                  <div className="mt-3 flex flex-wrap items-center gap-4">
                    <p className="text-secondary text-base capitalize font-medium">
                      {firstData?.weather?.[0]?.description}
                    </p>
                    <span className="label-caps">
                      Feels like {convertKelvinToCelsius(firstData?.main?.feels_like ?? 0)}°
                    </span>
                  </div>

                  {/* Min / Max */}
                  <div className="mt-3 flex items-center gap-3 text-sm">
                    <span className="accent-warm font-semibold tabular-nums">
                      ↑ {convertKelvinToCelsius(firstData?.main?.temp_max ?? 0)}°
                    </span>
                    <span className="text-tertiary tabular-nums">
                      ↓ {convertKelvinToCelsius(firstData?.main?.temp_min ?? 0)}°
                    </span>
                  </div>
                </div>

                {/* Icon + location */}
                <div className="flex flex-col items-start sm:items-end gap-3">
                  <WeatherIcon
                    iconName={getDayOrNightIcon(firstData?.weather?.[0]?.icon ?? "", firstData?.dt_txt ?? "")}
                    className="h-32 w-32"
                  />
                  {data?.city.name && (
                    <div className="flex items-center gap-1.5 text-secondary text-sm">
                      <MdOutlineLocationOn className="text-base accent-cool shrink-0" />
                      <span>{data.city.name}, {data.city.country}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Sunrise / Sunset inline strip */}
              <div className="divider mt-7 mb-5" />
              <div className="flex items-center gap-8 text-sm">
                <div className="flex items-center gap-2 text-secondary">
                  <LuSunrise className="text-base accent-warm" />
                  <span className="label-caps mr-1">Sunrise</span>
                  <span className="text-white font-medium tabular-nums">{sunriseFormatted}</span>
                </div>
                <div className="flex items-center gap-2 text-secondary">
                  <LuSunset className="text-base accent-warm" />
                  <span className="label-caps mr-1">Sunset</span>
                  <span className="text-white font-medium tabular-nums">{sunsetFormatted}</span>
                </div>
                <div className="ml-auto hidden sm:flex items-center gap-6 text-sm">
                  <Metric label="Humidity" value={`${firstData?.main.humidity}%`} />
                  <Metric label="Wind" value={convertWindSpeed(firstData?.wind.speed ?? 0)} />
                  <Metric label="Pressure" value={`${firstData?.main.pressure} hPa`} />
                  <Metric label="Visibility" value={metersToKilometers(firstData?.visibility ?? 10000)} />
                </div>
              </div>
            </div>

            {/* ── Hourly ──────────────────────────────────────────── */}
            <div
              className="rounded-2xl px-6 py-5 fade-up fade-up-2"
              style={{ backgroundColor: "#0d1220", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <p className="label-caps mb-4">Hourly</p>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {data?.list?.slice(0, 14).map((d, i) => {
                  const isNow = i === 0;
                  return (
                    <div
                      key={i}
                      className="flex flex-col items-center gap-2 rounded-xl px-3 py-3 min-w-[70px] shrink-0 transition-colors"
                      style={{
                        backgroundColor: isNow ? "rgba(232,168,64,0.10)" : "rgba(255,255,255,0.03)",
                        border: isNow ? "1px solid rgba(232,168,64,0.20)" : "1px solid rgba(255,255,255,0.04)",
                      }}
                    >
                      <p className="text-[11px] font-medium tabular-nums" style={{ color: isNow ? "#e8a840" : "rgba(255,255,255,0.4)" }}>
                        {i === 0 ? "Now" : format(parseISO(d.dt_txt), "h a")}
                      </p>
                      <WeatherIcon
                        iconName={getDayOrNightIcon(d.weather?.[0]?.icon ?? "", d.dt_txt)}
                        className="h-9 w-9"
                      />
                      <p className="text-white text-sm font-semibold tabular-nums">
                        {convertKelvinToCelsius(d.main?.temp ?? 0)}°
                      </p>
                      {d.pop > 0 && (
                        <p className="text-[10px] accent-cool tabular-nums">{Math.round(d.pop * 100)}%</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* ── 7-Day ───────────────────────────────────────────── */}
            <div className="fade-up fade-up-3">
              <p className="label-caps mb-3 px-1">7-Day Forecast</p>
              <div className="flex flex-col gap-2">
                {firstDataForEachDate.map((d, i) => (
                  <ForecastWeatherDetail
                    key={i}
                    description={d?.weather?.[0]?.description ?? ""}
                    weatherIcon={d?.weather?.[0]?.icon ?? "01d"}
                    date={d ? format(parseISO(d.dt_txt), "dd MMM") : ""}
                    day={d ? format(parseISO(d.dt_txt), "EEEE") : ""}
                    feels_like={d?.main?.feels_like ?? 0}
                    temp={d?.main?.temp ?? 0}
                    temp_max={d?.main?.temp_max ?? 0}
                    temp_min={d?.main?.temp_min ?? 0}
                    airPressure={`${d?.main?.pressure ?? 0} hPa`}
                    humidity={`${d?.main?.humidity ?? 0}%`}
                    sunrise={sunriseFormatted}
                    sunset={sunsetFormatted}
                    visability={metersToKilometers(d?.visibility ?? 10000)}
                    windSpeed={convertWindSpeed(d?.wind?.speed ?? 0)}
                  />
                ))}
              </div>
            </div>

          </>
        )}
      </main>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5 text-right">
      <p className="label-caps">{label}</p>
      <p className="text-white text-sm font-medium tabular-nums">{value}</p>
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-3xl h-72 shimmer-dark" />
      <div className="rounded-2xl h-32 shimmer-dark" />
      {[1,2,3,4].map((i) => (
        <div key={i} className="rounded-2xl h-20 shimmer-dark" />
      ))}
    </div>
  );
}

function FullPageSkeleton() {
  return (
    <div style={{ backgroundColor: "#070b14" }} className="min-h-screen">
      <div className="h-16 w-full" style={{ backgroundColor: "#0d1220", borderBottom: "1px solid rgba(255,255,255,0.06)" }} />
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col gap-5">
        <div className="rounded-3xl h-72 shimmer-dark" />
        <div className="rounded-2xl h-32 shimmer-dark" />
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-2xl h-20 shimmer-dark" />
        ))}
      </div>
    </div>
  );
}
