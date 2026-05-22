import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import GameContext, { GamePhase } from "./GameContext";
import {
  Pothole,
  getDailyPothole,
  getDistanceMiles,
  calculateScore,
} from "@/data/potholes";
import { CAMPAIGN_LINKS } from "@/data/campaign";
import { getOrCreateVisitorId, trackVisitorEvent } from "@/lib/visitorClient";
import AppBrandmark from "./AppBrandmark";
import CampaignFooter from "./CampaignFooter";
import CampaignInfoModal from "./CampaignInfoModal";
import CampaignSupportPanel from "./CampaignSupportPanel";
import PotholeViewer from "./PotholeViewer";
import ScoreDisplay from "./ScoreDisplay";
import Leaderboard from "./Leaderboard";

const FresnoMap = dynamic(() => import("./FresnoMap"), { ssr: false });
const PANEL_COPY = [
  "Drop the cone over a location on the map to guess where the pictured pothole is located within Fresno County. It could be right down YOUR street!",
  "Get a high-score and share with your friends. There's a new puzzle to try every 24 hours.",
];

type ShareState = "idle" | "shared" | "copied" | "error";

function getShareMessage(
  score: number,
  distance: number,
  isPastPlay: boolean,
  url: string
) {
  const challengeLabel = isPastPlay
    ? "a past Fresno County replay challenge"
    : "today's Fresno County daily challenge";

  return [
    `I scored ${score.toLocaleString()} / 5,000 on ${url}`,
    "",
    `I was ${distance.toFixed(2)} miles away from ${challengeLabel}.`,
    "",
    `Can you beat me? Try it here -> ${url}`,
  ].join("\n");
}

export default function GameContainer() {
  const [phase, setPhase] = useState<GamePhase>("INTRO");
  const [guessPos, setGuessPos] = useState<[number, number] | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isCampaignInfoOpen, setIsCampaignInfoOpen] = useState(false);
  const [shareState, setShareState] = useState<ShareState>("idle");
  const shareResetRef = useRef<number | null>(null);
  const [activePothole, setActivePothole] = useState<Pothole | null>(null);
  const visitorIdRef = useRef<string | null>(null);
  const startedKeysRef = useRef<Set<string>>(new Set());
  const placedGuessKeysRef = useRef<Set<string>>(new Set());
  const submittedKeysRef = useRef<Set<string>>(new Set());

  const dailyPothole = useMemo(() => getDailyPothole(), []);
  const todaysPothole = activePothole || dailyPothole;
  const isPastPlay = activePothole !== null;
  const potholeTrackingKey = `${todaysPothole.id}:${todaysPothole.date}:${
    isPastPlay ? "past" : "daily"
  }`;
  const showGameStage = phase === "INTRO" || phase === "PLAYING";
  const hasScoreToShare = score !== null && distance !== null;
  const canShowShareActions =
    hasScoreToShare && (phase === "SCORED" || phase === "LEADERBOARD");

  const handlePlayPast = useCallback(() => {
    if (window.__pastPothole) {
      setActivePothole(window.__pastPothole);
      setGuessPos(null);
      setScore(null);
      setDistance(null);
      setPhase("PLAYING");
      window.__pastPothole = undefined;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("play-past-pothole", handlePlayPast);
    return () =>
      window.removeEventListener("play-past-pothole", handlePlayPast);
  }, [handlePlayPast]);

  useEffect(() => {
    visitorIdRef.current = getOrCreateVisitorId();

    void trackVisitorEvent({
      event: "visited",
      visitorId: visitorIdRef.current,
      potholeId: todaysPothole.id,
      potholeDate: todaysPothole.date,
      isPastPlay,
    });
  }, [todaysPothole.id, todaysPothole.date, isPastPlay]);

  useEffect(() => {
    return () => {
      if (shareResetRef.current !== null) {
        window.clearTimeout(shareResetRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("app-cursor--placed", guessPos !== null);

    return () => {
      document.body.classList.remove("app-cursor--placed");
    };
  }, [guessPos]);

  useEffect(() => {
    if (canShowShareActions) {
      return;
    }

    if (shareResetRef.current !== null) {
      window.clearTimeout(shareResetRef.current);
      shareResetRef.current = null;
    }

    setShareState("idle");
  }, [canShowShareActions]);

  useEffect(() => {
    if (phase !== "PLAYING" || startedKeysRef.current.has(potholeTrackingKey)) {
      return;
    }

    const visitorId = visitorIdRef.current || getOrCreateVisitorId();
    visitorIdRef.current = visitorId;
    startedKeysRef.current.add(potholeTrackingKey);

    void trackVisitorEvent({
      event: "started_game",
      visitorId,
      potholeId: todaysPothole.id,
      potholeDate: todaysPothole.date,
      isPastPlay,
    });
  }, [phase, potholeTrackingKey, todaysPothole.id, todaysPothole.date, isPastPlay]);

  useEffect(() => {
    if (!guessPos || placedGuessKeysRef.current.has(potholeTrackingKey)) {
      return;
    }

    const visitorId = visitorIdRef.current || getOrCreateVisitorId();
    visitorIdRef.current = visitorId;
    placedGuessKeysRef.current.add(potholeTrackingKey);

    void trackVisitorEvent({
      event: "placed_guess_pin",
      visitorId,
      potholeId: todaysPothole.id,
      potholeDate: todaysPothole.date,
      isPastPlay,
      guessLat: guessPos[0],
      guessLng: guessPos[1],
    });
  }, [guessPos, potholeTrackingKey, todaysPothole.id, todaysPothole.date, isPastPlay]);

  useEffect(() => {
    if (
      phase !== "SCORED" ||
      score === null ||
      distance === null ||
      submittedKeysRef.current.has(potholeTrackingKey)
    ) {
      return;
    }

    const visitorId = visitorIdRef.current || getOrCreateVisitorId();
    visitorIdRef.current = visitorId;
    submittedKeysRef.current.add(potholeTrackingKey);

    void trackVisitorEvent({
      event: "submitted_guess",
      visitorId,
      potholeId: todaysPothole.id,
      potholeDate: todaysPothole.date,
      isPastPlay,
      score,
      distanceMiles: distance,
      guessLat: guessPos?.[0],
      guessLng: guessPos?.[1],
    });
  }, [
    phase,
    score,
    distance,
    guessPos,
    potholeTrackingKey,
    todaysPothole.id,
    todaysPothole.date,
    isPastPlay,
  ]);

  function handleGuess() {
    if (!guessPos) return;

    const dist = getDistanceMiles(
      guessPos[0],
      guessPos[1],
      todaysPothole.lat,
      todaysPothole.lng
    );
    const pts = calculateScore(dist);

    setDistance(dist);
    setScore(pts);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPhase("SCORED");
  }

  function goToLeaderboard() {
    setPhase("LEADERBOARD");
  }

  function restart() {
    setActivePothole(null);
    setGuessPos(null);
    setScore(null);
    setDistance(null);
    setShareState("idle");
    setPhase("INTRO");
  }

  function flashShareState(nextState: Exclude<ShareState, "idle">) {
    setShareState(nextState);

    if (shareResetRef.current !== null) {
      window.clearTimeout(shareResetRef.current);
    }

    shareResetRef.current = window.setTimeout(() => {
      setShareState("idle");
      shareResetRef.current = null;
    }, 2200);
  }

  async function copyShareFallback(message: string) {
    if (!navigator.clipboard?.writeText) {
      flashShareState("error");
      return;
    }

    await navigator.clipboard.writeText(message);
    flashShareState("copied");
  }

  async function handleShareScore() {
    if (score === null || distance === null) return;

    const shareUrl = new URL("/", window.location.origin).toString();
    const shareMessage = getShareMessage(score, distance, isPastPlay, shareUrl);

    try {
      if (navigator.share) {
        const shareData = { text: shareMessage };

        if (!navigator.canShare || navigator.canShare(shareData)) {
          await navigator.share(shareData);
        } else {
          await navigator.share(shareData);
        }

        flashShareState("shared");
        return;
      }

      await copyShareFallback(shareMessage);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      try {
        await copyShareFallback(shareMessage);
      } catch {
        flashShareState("error");
      }
    }
  }

  const shareFeedback =
    shareState === "shared"
      ? "Shared with the site link attached."
      : shareState === "copied"
      ? "Copied. Paste it into Messages, Notes, or social."
      : shareState === "error"
      ? "Sharing is unavailable"
      : "";

  function renderShareActions() {
    if (!canShowShareActions) {
      return null;
    }

    return (
      <div className="game__share-block">
        <div className="game__share-actions">
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleShareScore}
            className="game__share-btn"
          >
            SHARE SCORE <i className="fa-solid fa-arrow-up-from-bracket"></i>
          </motion.button>
        </div>
        {shareFeedback && <div className="game__share-feedback">{shareFeedback}</div>}
      </div>
    );
  }

  const contextValue = {
    phase,
    setPhase,
    todaysPothole,
    guessPos,
    setGuessPos,
    score,
    setScore,
    distance,
    setDistance,
    handleGuess,
    restart,
    isPastPlay,
  };

  return (
    <GameContext.Provider value={contextValue}>
      <main className="app-shell">
        <AnimatePresence mode="wait">
          {showGameStage && (
            <motion.section
              key="play"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24 }}
              className="app-shell__stage"
            >
              <div className="app-card app-card--play">
                <AppBrandmark onInfoClick={() => setIsCampaignInfoOpen(true)} />
                <h1 className="app-card__title">Guess That Pothole!</h1>
                <div className="app-card__copy">
                  <p>{PANEL_COPY[0]}</p>
                  <p>{PANEL_COPY[1]}</p>
                  <p>
                    Support Better Roads, Safe Streets in Fresno County!{" "}
                    <a
                      href={CAMPAIGN_LINKS.plan}
                      target="_blank"
                      rel="noreferrer"
                      className="app-card__copy-link"
                    >
                      Learn More!
                    </a>
                  </p>
                </div>
                {isPastPlay && (
                  <div className="app-card__note">
                    Past pothole · {todaysPothole.date}
                  </div>
                )}
                <PotholeViewer />
                <FresnoMap />
                <button
                  type="button"
                  onClick={goToLeaderboard}
                  className="app-card__text-link"
                >
                  View Leaderboard
                </button>
              </div>
            </motion.section>
          )}

          {phase === "SCORED" && (
            <motion.section
              key="scored"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24 }}
              className="app-shell__stage"
            >
              <div className="app-card app-card--score">
                <AppBrandmark onInfoClick={() => setIsCampaignInfoOpen(true)} />
                <h1 className="app-card__title">Guess That Pothole!</h1>
                <div className="app-card__copy">
                  <p>Thanks for Playing!</p>
                </div>
                <ScoreDisplay />
                <FresnoMap />
                {renderShareActions()}
                <CampaignSupportPanel />
                <button
                  type="button"
                  onClick={goToLeaderboard}
                  className="app-card__text-link"
                >
                  View Leaderboard
                </button>
              </div>
            </motion.section>
          )}

          {phase === "LEADERBOARD" && (
            <motion.section
              key="leaderboard"
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.24 }}
              className="app-shell__stage"
            >
              <div className="app-card app-card--leaderboard">
                <AppBrandmark onInfoClick={() => setIsCampaignInfoOpen(true)} />
                <h1 className="app-card__title">Guess That Pothole!</h1>
                <Leaderboard />
                {renderShareActions()}
                <CampaignSupportPanel />
                <button
                  type="button"
                  onClick={restart}
                  className="app-card__text-link"
                >
                  Back To Game
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
        <CampaignFooter />
        <CampaignInfoModal
          isOpen={isCampaignInfoOpen}
          onClose={() => setIsCampaignInfoOpen(false)}
        />
      </main>
    </GameContext.Provider>
  );
}
