import Image from "next/image";
import { CAMPAIGN_LINKS } from "@/data/campaign";

interface AppBrandmarkProps {
  onInfoClick: () => void;
}

export default function AppBrandmark({ onInfoClick }: AppBrandmarkProps) {
  return (
    <div className="app-card__brandmark-wrap">
      <a
        href={CAMPAIGN_LINKS.home}
        target="_blank"
        rel="noreferrer"
        className="app-card__brandmark-link"
        aria-label="Visit Better Roads, Safe Streets campaign site"
      >
        <Image
          src="/brand/brss-color-light.svg"
          alt="Better Roads. Safe Streets."
          className="app-card__brandmark"
          width={220}
          height={72}
        />
      </a>
      <button
        type="button"
        className="app-card__brandmark-info"
        onClick={onInfoClick}
        aria-label="Open Better Roads, Safe Streets measure info"
        title="Measure info"
      >
        <i className="fa-solid fa-info"></i>
      </button>
    </div>
  );
}
