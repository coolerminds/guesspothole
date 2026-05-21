import { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import GameContext from "./GameContext";

export default function PotholeViewer() {
  const { todaysPothole } = useContext(GameContext);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if (!isExpanded) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsExpanded(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isExpanded]);

  return (
    <>
      <motion.figure
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="pothole-viewer"
      >
        <div className="pothole-viewer__frame">
          <Image
            src={todaysPothole.image}
            alt={`Pothole ${todaysPothole.id}`}
            fill
            sizes="(max-width: 768px) calc(100vw - 72px), 560px"
            className="pothole-viewer__img"
            priority
          />
          <button
            type="button"
            className="pothole-viewer__expand-btn"
            onClick={() => setIsExpanded(true)}
            aria-label="Expand pothole photo"
          >
            <i className="fa-solid fa-expand"></i>
            
          </button>
        </div>
        {todaysPothole.hint && (
          <motion.figcaption
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="pothole-viewer__hint"
          >
            <i className="fa-solid fa-lightbulb"></i>
            Hint: {todaysPothole.hint}
          </motion.figcaption>
        )}
      </motion.figure>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="pothole-viewer__lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Expanded pothole photo"
            onClick={() => setIsExpanded(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 16 }}
              transition={{ duration: 0.22 }}
              className="pothole-viewer__lightbox-shell"
              onClick={(event) => event.stopPropagation()}
            >
              <button
                type="button"
                className="pothole-viewer__lightbox-close"
                onClick={() => setIsExpanded(false)}
                aria-label="Close expanded pothole photo"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
              <div className="pothole-viewer__lightbox-frame">
                <div className="pothole-viewer__lightbox-photo">
                  <Image
                    src={todaysPothole.image}
                    alt={`Full view of pothole ${todaysPothole.id}`}
                    fill
                    sizes="(max-width: 768px) calc(100vw - 56px), 620px"
                    className="pothole-viewer__lightbox-img"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
