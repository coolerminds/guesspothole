import {
  CAMPAIGN_LINKS,
  CAMPAIGN_SUPPORT_ACTIONS,
} from "@/data/campaign";

export default function CampaignSupportPanel() {
  const donateAction = CAMPAIGN_SUPPORT_ACTIONS[0];

  return (
    <section className="campaign-support" aria-labelledby="campaign-support-title">
      <h2 id="campaign-support-title" className="campaign-support__title">
        Support Better Roads, Safe Streets Today!
      </h2>

      <div className="campaign-support__list">
        <a
          href={donateAction.href}
          target="_blank"
          rel="noreferrer"
          className="campaign-support__card"
        >
          <div className="campaign-support__body">
            <div className="campaign-support__card-title">{donateAction.title}</div>
            <div className="campaign-support__card-copy">
              {donateAction.description}
            </div>
          </div>
        </a>
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
