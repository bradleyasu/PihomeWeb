import { useEffect, useState } from "react";
import { Tooltip } from "@mui/material";
import {
  Shuffle,
  Block,
  OpenInNew,
} from "@mui/icons-material";
import ScreenButton from "../components/ScreenButton/ScreenButton";
import Timer from "../components/Timer/Timer";
import { usePiHome } from "../providers/PihomeStateProvider";
import { API } from "../constants";
import "./ScreenControl.css";

export type Screen = {
  icon: string;
  label: string;
  pin: boolean;
  hidden: boolean;
  requires_pin?: boolean;
};

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const MONTHS = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];

function formatTime(d: Date) {
  const h = d.getHours() % 12 || 12;
  const m = String(d.getMinutes()).padStart(2, "0");
  const ampm = d.getHours() >= 12 ? "PM" : "AM";
  return `${h}:${m} ${ampm}`;
}

function formatDate(d: Date) {
  return `${DAYS[d.getDay()]}, ${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

const ScreenControl = () => {
  const pihome = usePiHome();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const screens: any[] | undefined = pihome?.phstate?.screens?.screens;
  const currentScreen: string | undefined = pihome?.phstate?.screens?.current;
  const timers: any[] = pihome?.phstate?.timers ?? [];

  // Weather
  const weather = pihome?.phstate?.weather;
  const temperature: number | undefined = weather?.temperature;
  const humidity: number | undefined = weather?.humidity;
  const windSpeed: number | undefined = weather?.wind_speed;

  // Determine day vs night using sunrise/sunset from first future entry
  const isDay = (() => {
    const entry = weather?.future?.[0]?.values;
    if (!entry?.sunriseTime || !entry?.sunsetTime) return true;
    const t = now.getTime();
    return t >= new Date(entry.sunriseTime).getTime() && t <= new Date(entry.sunsetTime).getTime();
  })();

  // Find the future entry whose startTime is closest to now (for day/night codes)
  const nearestFuture = (() => {
    if (!weather?.future?.length) return null;
    const nowMs = now.getTime();
    return weather.future.reduce((best: any, cur: any) => {
      const bd = Math.abs(new Date(best.startTime).getTime() - nowMs);
      const cd = Math.abs(new Date(cur.startTime).getTime() - nowMs);
      return cd < bd ? cur : best;
    }, weather.future[0]);
  })();

  const weatherIconCode: number | undefined = isDay
    ? nearestFuture?.values?.weatherCodeDay
    : nearestFuture?.values?.weatherCodeNight;
  const weatherIconUrl: string | undefined = weatherIconCode
    ? `https://cdn.pihome.io/cdn/pihome/assets/weather/${weatherIconCode}.png`
    : undefined;
  const wallpaperCurrent: string | undefined = pihome?.phstate?.wallpaper?.current;
  const wallpaperSource: string | undefined = pihome?.phstate?.wallpaper?.source;
  const wallpaper: string | undefined = wallpaperCurrent
    ? `${API.replace(/\/$/, '')}/wallpaper/${encodeURIComponent(wallpaperCurrent)}`
    : undefined;

  const wallpaperName = wallpaperSource
    ? wallpaperSource.split("/").pop()?.replace(/\.[^.]+$/, "") ?? ""
    : "";

  const visibleScreens = screens?.filter((s: any) => {
    const data = s[Object.keys(s)[0]];
    return !data?.hidden && !data?.requires_pin;
  }) ?? [];

  const currentScreenLabel = (() => {
    if (!currentScreen || !screens) return null;
    const match = screens.find((s: any) => Object.keys(s)[0] === currentScreen);
    if (!match) return currentScreen;
    return match[currentScreen]?.label ?? currentScreen;
  })();

  const send = (payload: any) => pihome.send_payload(payload);

  const handleScreenClick = (id: string) => {
    send({ type: "app", app: id });
  };

  const handleShuffle = () => send({ type: "wallpaper", action: "shuffle" });
  const handleBan    = () => {
    if (!wallpaperSource) return;
    send({ type: "wallpaper", action: "ban", value: wallpaperSource });
    send({ type: "wallpaper", action: "shuffle" });
    send({ type: "sfx", name: "trash" });
  };

  return (
    <div className="home-page">
      {/* ── Hero: wallpaper + clock ── */}
      <div className="hero-card">
        {wallpaper && (
          <div
            className="hero-bg"
            style={{ backgroundImage: `url(${wallpaper})` }}
          />
        )}
        <div className="hero-overlay" />
        <div className="hero-content">

          {/* ── Weather widget (top-right) ── */}
          <div className="hero-top">
            {weather && (
              <div className="hero-weather">
                {weatherIconUrl && (
                  <img
                    className="hero-weather-icon"
                    src={weatherIconUrl}
                    alt="weather"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                )}
                <div className="hero-weather-info">
                  <span className="hero-weather-temp">
                    {temperature !== undefined ? `${Math.round(temperature)}°` : '--'}
                  </span>
                  <div className="hero-weather-meta">
                    {humidity !== undefined && <span>{humidity}% humidity</span>}
                    {windSpeed !== undefined && <span>· {Math.round(windSpeed)} mph</span>}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Clock + controls (bottom) ── */}
          <div className="hero-bottom">
          <div className="hero-time">{formatTime(now)}</div>
          <div className="hero-date">{formatDate(now)}</div>

          <div className="hero-wallpaper-row">
            <div className="hero-wallpaper-left">
              <span className="hero-wallpaper-name">
                {wallpaperName || "No wallpaper"}
              </span>
              {wallpaperSource && (
                <Tooltip title="Open wallpaper source" placement="top">
                  <a
                    className="wp-btn"
                    href={wallpaperSource}
                    target="_blank"
                    rel="noreferrer noopener"
                  >
                    <OpenInNew sx={{ fontSize: 13 }} />
                  </a>
                </Tooltip>
              )}
            </div>
            <div className="hero-wallpaper-controls">
              <Tooltip title="Shuffle wallpaper" placement="top">
                <button className="wp-btn" onClick={handleShuffle}>
                  <Shuffle sx={{ fontSize: 14 }} />
                </button>
              </Tooltip>
              <Tooltip title="Ban this wallpaper" placement="top">
                <button className="wp-btn wp-btn-danger" onClick={handleBan}>
                  <Block sx={{ fontSize: 13 }} />
                </button>
              </Tooltip>
            </div>
          </div>
          </div>{/* hero-bottom */}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="home-body">

        {/* Active timers */}
        {timers.length > 0 && (
          <div>
            <div className="section-heading">
              <span className="section-title">Timers</span>
              <span className="section-meta">{timers.length} active</span>
            </div>
            <div className="timers-strip">
              {timers.map((t: any, i: number) => (
                <Timer
                  key={t.id ?? i}
                  label={t.label ?? "Timer"}
                  endTime={t.end_time ?? 0}
                  duration={t.duration ?? 0}
                  elapsed={t.elapsed_time ?? 0}
                />
              ))}
            </div>
          </div>
        )}

        {/* App launcher */}
        <div>
          <div className="section-heading">
            <span className="section-title">Apps</span>
            {currentScreenLabel && (
              <span className="section-meta">
                Active: {currentScreenLabel}
              </span>
            )}
          </div>

          {currentScreenLabel && (
            <div className="active-screen-badge">
              <span className="active-screen-dot" />
              {currentScreenLabel}
            </div>
          )}

          {!screens ? (
            <div className="apps-grid-skeleton">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton-app" />
              ))}
            </div>
          ) : (
            <div className="apps-grid">
              {visibleScreens.map((screen: any) => {
                const id = Object.keys(screen)[0] as string;
                const data = screen[id];
                return (
                  <ScreenButton
                    key={id}
                    id={id}
                    screen={data}
                    isActive={id === currentScreen}
                    onClick={() => handleScreenClick(id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenControl;
