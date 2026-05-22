import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Polygon,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Icon, LatLngBounds, LatLngExpression } from "leaflet";
import { useContext, useEffect, useState } from "react";
import { motion } from "framer-motion";
import GameContext from "./GameContext";
import fresnoCountyBoundary from "@/data/fresnoCountyBoundary.json";

const FRESNO_CENTER: LatLngExpression = [36.7610058, -119.6550193];
const FRESNO_ZOOM = 9;
const FRESNO_COUNTY_RING = fresnoCountyBoundary as [number, number][];

const {
  minLat: FRESNO_MIN_LAT,
  maxLat: FRESNO_MAX_LAT,
  minLng: FRESNO_MIN_LNG,
  maxLng: FRESNO_MAX_LNG,
} = FRESNO_COUNTY_RING.reduce(
  (bounds, [lat, lng]) => ({
    minLat: Math.min(bounds.minLat, lat),
    maxLat: Math.max(bounds.maxLat, lat),
    minLng: Math.min(bounds.minLng, lng),
    maxLng: Math.max(bounds.maxLng, lng),
  }),
  {
    minLat: Infinity,
    maxLat: -Infinity,
    minLng: Infinity,
    maxLng: -Infinity,
  }
);

const FRESNO_COUNTY_BOUNDS = new LatLngBounds(
  [FRESNO_MIN_LAT, FRESNO_MIN_LNG],
  [FRESNO_MAX_LAT, FRESNO_MAX_LNG]
).pad(0.08);

const FRESNO_COUNTY_MASK_RING: [number, number][] = [
  [FRESNO_MAX_LAT + 1.5, FRESNO_MIN_LNG - 1.5],
  [FRESNO_MAX_LAT + 1.5, FRESNO_MAX_LNG + 1.5],
  [FRESNO_MIN_LAT - 1.5, FRESNO_MAX_LNG + 1.5],
  [FRESNO_MIN_LAT - 1.5, FRESNO_MIN_LNG - 1.5],
];

const guessIcon = new Icon({
  iconUrl: "/brand/cone.svg",
  iconSize: [34, 34],
  iconAnchor: [17, 31],
});

const answerIcon = new Icon({
  iconUrl:
    "data:image/svg+xml," +
    encodeURIComponent(
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="8" fill="%230e3a59"/><circle cx="12" cy="12" r="3" fill="%23ffffff"/></svg>'
    ),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

function isInsideCounty(point: [number, number]) {
  const [lat, lng] = point;
  let inside = false;

  for (
    let i = 0, j = FRESNO_COUNTY_RING.length - 1;
    i < FRESNO_COUNTY_RING.length;
    j = i++
  ) {
    const [latI, lngI] = FRESNO_COUNTY_RING[i];
    const [latJ, lngJ] = FRESNO_COUNTY_RING[j];

    const intersects =
      (latI > lat) !== (latJ > lat) &&
      lng <
        ((lngJ - lngI) * (lat - latI)) / (latJ - latI || Number.EPSILON) +
          lngI;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function MapClickHandler() {
  const { phase, setGuessPos, setPhase } = useContext(GameContext);

  useMapEvents({
    click(e) {
      if (phase !== "INTRO" && phase !== "PLAYING") return;
      if (!isInsideCounty([e.latlng.lat, e.latlng.lng])) return;

      setGuessPos([e.latlng.lat, e.latlng.lng]);
      if (phase === "INTRO") {
        setPhase("PLAYING");
      }
    },
  });

  return null;
}

function FitBounds({
  guessPos,
  answerPos,
  active,
}: {
  guessPos: [number, number] | null;
  answerPos: LatLngExpression;
  active: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!active || !guessPos) return;

    const bounds = new LatLngBounds(
      [guessPos[0], guessPos[1]],
      answerPos as [number, number]
    );
    map.fitBounds(bounds, { padding: [48, 48], maxZoom: 15 });
  }, [active, guessPos, answerPos, map]);

  return null;
}

export default function FresnoMap() {
  const { phase, guessPos, todaysPothole, handleGuess } = useContext(GameContext);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    if (phase === "SCORED") {
      const timer = setTimeout(() => setShowAnswer(true), 300);
      return () => clearTimeout(timer);
    }

    setShowAnswer(false);
    return undefined;
  }, [phase]);

  const answerPos: LatLngExpression = [todaysPothole.lat, todaysPothole.lng];
  const isInteracting = guessPos !== null || phase === "SCORED";
  const showGuessButton = phase === "INTRO" || phase === "PLAYING";
  const isReadyToSubmit = phase === "PLAYING" && guessPos !== null;

  return (
    <div className={`fresno-map ${isInteracting ? "fresno-map--active" : ""}`}>
      <div className="fresno-map__container">
        <MapContainer
          center={FRESNO_CENTER}
          zoom={FRESNO_ZOOM}
          minZoom={8}
          maxZoom={18}
          scrollWheelZoom={true}
          doubleClickZoom={false}
          attributionControl={false}
          className="fresno-map__leaflet"
          maxBounds={FRESNO_COUNTY_BOUNDS}
          maxBoundsViscosity={1}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <Polygon
            positions={[FRESNO_COUNTY_MASK_RING, FRESNO_COUNTY_RING]}
            pathOptions={{
              stroke: false,
              fillColor: "#0e3a59",
              fillOpacity: 0.22,
              fillRule: "evenodd",
            }}
            interactive={false}
          />
          <Polygon
            positions={FRESNO_COUNTY_RING}
            pathOptions={{
              color: "#0e3a59",
              weight: 4,
              opacity: 1,
              fill: false,
            }}
            interactive={false}
          />
          <MapClickHandler />
          <FitBounds guessPos={guessPos} answerPos={answerPos} active={showAnswer} />

          {guessPos && (
            <Marker
              position={guessPos as LatLngExpression}
              icon={guessIcon}
            />
          )}

          {showAnswer && (
            <>
              <Marker position={answerPos} icon={answerIcon} />
              {guessPos && (
                <Polyline
                  positions={[guessPos as LatLngExpression, answerPos]}
                  pathOptions={{
                    color: "#0e3a59",
                    weight: 2,
                    dashArray: "5 7",
                  }}
                />
              )}
            </>
          )}
        </MapContainer>
      </div>

      {showGuessButton && (
        <div className="fresno-map__guess-wrapper">
          <motion.button
            whileHover={isReadyToSubmit ? { scale: 1.02 } : undefined}
            whileTap={isReadyToSubmit ? { scale: 0.98 } : undefined}
            onClick={handleGuess}
            disabled={!isReadyToSubmit}
            className={`fresno-map__guess-btn ${
              isReadyToSubmit ? "fresno-map__guess-btn--active" : ""
            }`}
          >
            <i className="fa-solid fa-crosshairs"></i>
            {isReadyToSubmit ? "Lock In Guess!" : "Click Map To Guess"}
          </motion.button>
        </div>
      )}
    </div>
  );
}
