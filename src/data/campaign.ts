export const CAMPAIGN_LINKS = {
  home: "https://betterroadssafestreets.com/",
  plan: "https://betterroadssafestreets.com/the-plan/",
  supporters: "https://betterroadssafestreets.com/supporters/",
  getInvolved: "https://betterroadssafestreets.com/get-involved/",
  donate:
    "https://www.efundraisingconnections.com/c/FresnoCountyResidentsforBetterRoadsandSafe",
  facebook: "https://www.facebook.com/betterroadssafestreets",
  instagram: "https://www.instagram.com/betterroadssafestreets",
  youtube: "https://www.youtube.com/@betterroadssafestreets-fresno",
} as const;

export const CAMPAIGN_MEASURE_POINTS = [
  "Keeps local tax dollars here, prioritizing projects thousands of residents say matter most: repairing neighborhood roads and creating safer streets.",
  "Makes it quicker, safer, and easier for all of us to get from point A to point B, regardless of whether we drive, take the bus, bike, or walk.",
  "Invests in making neighborhoods safer: newer intersections, better lighting, and improved traffic signals to reduce crashes and protect drivers, cyclists, and pedestrians.",
  "Directs resources where they're needed most, starting with neighborhoods that have the worst roads, most potholes, and fewest transportation options.",
  "Strengthens our economy by investing in transportation projects that create good local jobs and help small businesses grow.",
];

export const CAMPAIGN_SUPPORT_ACTIONS = [
  {
    title: "Volunteer",
    description: "Become a volunteer with Better Roads, Safe Streets.",
    label: "Get Involved",
    href: CAMPAIGN_LINKS.getInvolved,
    iconClassName: "fa-solid fa-seedling",
  },
  {
    title: "Endorse Our Efforts",
    description:
      "Show your support by endorsing the citizen-led effort for a better transportation future. Add your name to our list of supporters.",
    label: "Supporters",
    href: CAMPAIGN_LINKS.supporters,
    iconClassName: "fa-solid fa-bullhorn",
  },
  {
    title: "Donate",
    description:
      "Your financial contribution will help ensure we have what we need to reach voters and win in November!",
    label: "Donate",
    href: CAMPAIGN_LINKS.donate,
    iconClassName: "fa-regular fa-credit-card",
  },
] as const;

export const CAMPAIGN_FOOTER_LINKS = [
  {
    label: "BetterRoadsSafeStreets.com",
    href: CAMPAIGN_LINKS.home,
  },
  {
    label: "The Plan",
    href: CAMPAIGN_LINKS.plan,
  },
  {
    label: "Get Involved",
    href: CAMPAIGN_LINKS.getInvolved,
  },
  {
    label: "Supporters",
    href: CAMPAIGN_LINKS.supporters,
  },
  {
    label: "Donate",
    href: CAMPAIGN_LINKS.donate,
  },
] as const;

export const CAMPAIGN_SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: CAMPAIGN_LINKS.facebook,
    iconClassName: "fa-brands fa-facebook-f",
  },
  {
    label: "Instagram",
    href: CAMPAIGN_LINKS.instagram,
    iconClassName: "fa-brands fa-instagram",
  },
  {
    label: "YouTube",
    href: CAMPAIGN_LINKS.youtube,
    iconClassName: "fa-brands fa-youtube",
  },
] as const;

export const CAMPAIGN_DISCLAIMER =
  "Paid for by Fresno County Residents for Better Roads and Safe Streets, Sponsored by Nonprofit Community Organizations and Labor Organizations. Committee Top Funders: Central Valley Community Foundation & North Coast States Regional Council of Carpenters";

export const CAMPAIGN_COPYRIGHT =
  "Fresno County Residents For Better Roads and Safe Streets";
