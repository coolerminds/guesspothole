import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  CAMPAIGN_LINKS,
  CAMPAIGN_MEASURE_POINTS,
} from "@/data/campaign";

interface CampaignInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CampaignInfoModal({
  isOpen,
  onClose,
}: CampaignInfoModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="campaign-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Better Roads, Safe Streets measure info"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.22 }}
            className="campaign-modal__card"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="campaign-modal__close"
              onClick={onClose}
              aria-label="Close measure info"
            >
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="campaign-modal__eyebrow">Measure Info</div>
            <h2 className="campaign-modal__title">
              The Better Roads, Safe Streets Ballot Measure
            </h2>
            <ul className="campaign-modal__list">
              {CAMPAIGN_MEASURE_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
            <div className="campaign-modal__actions">
              <a
                href={CAMPAIGN_LINKS.plan}
                target="_blank"
                rel="noreferrer"
                className="campaign-modal__action campaign-modal__action--primary"
              >
                Learn more about the plan
              </a>
              <a
                href={CAMPAIGN_LINKS.home}
                target="_blank"
                rel="noreferrer"
                className="campaign-modal__action campaign-modal__action--secondary"
              >
                Visit campaign site
              </a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
