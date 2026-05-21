import {
  CAMPAIGN_COPYRIGHT,
  CAMPAIGN_DISCLAIMER,
  CAMPAIGN_FOOTER_LINKS,
  CAMPAIGN_SOCIAL_LINKS,
} from "@/data/campaign";

export default function CampaignFooter() {
  return (
    <footer className="campaign-footer">
      <nav className="campaign-footer__nav" aria-label="Campaign links">
        {CAMPAIGN_FOOTER_LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="campaign-footer__nav-link"
          >
            {link.label}
          </a>
        ))}
      </nav>

      <p className="campaign-footer__disclaimer">{CAMPAIGN_DISCLAIMER}</p>

      <div className="campaign-footer__socials" aria-label="Campaign social links">
        {CAMPAIGN_SOCIAL_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="campaign-footer__social-link"
            aria-label={link.label}
            title={link.label}
          >
            <i className={link.iconClassName}></i>
          </a>
        ))}
      </div>

      <p className="campaign-footer__copyright">{CAMPAIGN_COPYRIGHT}</p>
    </footer>
  );
}
