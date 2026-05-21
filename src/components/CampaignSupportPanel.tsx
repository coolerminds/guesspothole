import {
  CAMPAIGN_LINKS,
  CAMPAIGN_SUPPORT_ACTIONS,
} from "@/data/campaign";

export default function CampaignSupportPanel() {
  return (
    <section className="campaign-support" aria-labelledby="campaign-support-title">
      <div className="campaign-support__eyebrow">
        Support Better Roads, Safe Streets
      </div>
      <h2 id="campaign-support-title" className="campaign-support__title">
        Support Better Roads, Safe Streets Today!
      </h2>
      <p className="campaign-support__copy">
        The campaign for Better Roads, Safe Streets is needed to continue the
        funding to fix potholes and repair neighborhood streets without raising
        taxes and requiring strong citizen oversight and annual fiscal audits.
      </p>

      <div className="campaign-support__list">
        {CAMPAIGN_SUPPORT_ACTIONS.map((action) => (
          <a
            key={action.title}
            href={action.href}
            target="_blank"
            rel="noreferrer"
            className="campaign-support__card"
          >
            <div className="campaign-support__icon">
              <i className={action.iconClassName}></i>
            </div>
            <div className="campaign-support__body">
              <div className="campaign-support__card-title">{action.title}</div>
              <div className="campaign-support__card-copy">
                {action.description}
              </div>
            </div>
            <div className="campaign-support__label">{action.label}</div>
          </a>
        ))}
      </div>

      <a
        href={CAMPAIGN_LINKS.plan}
        target="_blank"
        rel="noreferrer"
        className="campaign-support__plan-link"
      >
        Learn more about the plan <i className="fa-solid fa-arrow-right"></i>
      </a>
    </section>
  );
}
