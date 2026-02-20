export interface Resource {
  id: string;
  name: string;
  description: string;
  url: string;
  phone?: string;
  isLocal?: boolean;
}

export interface ResourceCategory {
  id: string;
  title: string;
  icon: string;
  description: string;
  resources: Resource[];
}

export const resourceCategories: ResourceCategory[] = [
  {
    id: "childcare",
    title: "Childcare",
    icon: "👶",
    description: "Help paying for childcare so you can work or go to school",
    resources: [
      {
        id: "cc-1",
        name: "Find Local Childcare Help (211)",
        description: "Call or text 211 to find childcare assistance programs, subsidized daycare, and Head Start in your area.",
        url: "https://www.211.org",
        phone: "211",
      },
      {
        id: "cc-2",
        name: "Head Start Programs",
        description: "Free early childhood education for children from low-income families. Full-day and part-day options available.",
        url: "https://www.benefits.gov/benefit/1915",
      },
      {
        id: "cc-3",
        name: "Child Care and Development Fund (CCDF)",
        description: "Federal program that helps low-income families pay for child care while they work or attend training.",
        url: "https://www.acf.hhs.gov/occ/ccdf-reauthorization",
      },
      {
        id: "cc-4",
        name: "MA Child Care Assistance (Vouchers)",
        description: "Massachusetts subsidized childcare for income-eligible families. Apply through your local Child Care Resource & Referral agency.",
        url: "https://www.mass.gov/child-care-financial-assistance-voucher",
        isLocal: true,
      },
    ],
  },
  {
    id: "housing",
    title: "Housing",
    icon: "🏠",
    description: "Help with rent, finding affordable housing, or preventing eviction",
    resources: [
      {
        id: "h-1",
        name: "Find Local Housing Help (211)",
        description: "Call or text 211 for emergency shelter, rental assistance, and affordable housing programs near you.",
        url: "https://www.211.org",
        phone: "211",
      },
      {
        id: "h-2",
        name: "HUD Housing Assistance",
        description: "Federal rental assistance programs including Section 8 vouchers and public housing.",
        url: "https://www.hud.gov/topics/rental_assistance",
      },
      {
        id: "h-3",
        name: "National Low Income Housing Coalition",
        description: "Find affordable rentals and housing resources in every state.",
        url: "https://nlihc.org/rental-assistance",
      },
      {
        id: "h-4",
        name: "MA Residential Assistance for Families in Transition (RAFT)",
        description: "Up to $7,000 for Massachusetts families at risk of eviction or homelessness. Covers rent, security deposits, utilities, and more.",
        url: "https://www.mass.gov/how-to/apply-for-raft",
        isLocal: true,
      },
      {
        id: "h-5",
        name: "Cambridge Affordable Housing Resources",
        description: "City of Cambridge programs including affordable housing lotteries, rental assistance, and homebuyer programs.",
        url: "https://www.cambridgema.gov/iwantto/applytolotteryhousingincambridge",
        isLocal: true,
      },
      {
        id: "h-6",
        name: "Metro Housing Boston",
        description: "Housing search assistance, homelessness prevention, and rental voucher programs for Greater Boston residents.",
        url: "https://www.metrohousingboston.org",
        isLocal: true,
      },
      {
        id: "h-7",
        name: "MA Emergency Assistance (EA) Shelter",
        description: "Emergency shelter for Massachusetts families with children who are experiencing homelessness.",
        url: "https://www.mass.gov/emergency-assistance-ea-shelter",
        isLocal: true,
      },
    ],
  },
  {
    id: "food",
    title: "Food",
    icon: "🥗",
    description: "Help with groceries, meals, and food assistance programs",
    resources: [
      {
        id: "f-1",
        name: "SNAP Benefits (Food Stamps)",
        description: "Monthly benefits to help buy groceries. Most working adults with low income qualify.",
        url: "https://www.benefits.gov/benefit/361",
      },
      {
        id: "f-2",
        name: "Find a Food Bank",
        description: "Locate food pantries and food banks near you through Feeding America's national network.",
        url: "https://www.feedingamerica.org/find-your-local-foodbank",
      },
      {
        id: "f-3",
        name: "WIC (Women, Infants, and Children)",
        description: "Nutrition assistance for pregnant and breastfeeding women, infants, and children under 5.",
        url: "https://www.fns.usda.gov/wic",
      },
      {
        id: "f-4",
        name: "Greater Boston Food Bank",
        description: "Find free food distribution sites, community meals, and mobile markets across Eastern Massachusetts.",
        url: "https://www.gbfb.org/need-food/",
        isLocal: true,
      },
    ],
  },
  {
    id: "transportation",
    title: "Transportation",
    icon: "🚌",
    description: "Help getting to work, school, or job interviews",
    resources: [
      {
        id: "t-1",
        name: "Find Local Transit Help (211)",
        description: "Call or text 211 to find discounted transit passes, rideshare programs, and transportation assistance in your area.",
        url: "https://www.211.org",
        phone: "211",
      },
      {
        id: "t-2",
        name: "Vehicles for Change",
        description: "Provides low-cost cars to families transitioning from poverty to self-sufficiency.",
        url: "https://www.vehiclesforchange.org",
      },
      {
        id: "t-3",
        name: "MBTA Reduced Fare Programs",
        description: "Discounted Charlie Cards for low-income riders in the Greater Boston area. Up to 50% off fares.",
        url: "https://www.mbta.com/fares/reduced",
        isLocal: true,
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare",
    icon: "💊",
    description: "Help getting health insurance or affordable medical care",
    resources: [
      {
        id: "hc-1",
        name: "Healthcare.gov",
        description: "Find affordable health insurance through the federal marketplace. Many people qualify for plans under $50/month.",
        url: "https://www.healthcare.gov",
      },
      {
        id: "hc-2",
        name: "Medicaid",
        description: "Free or low-cost health coverage for eligible low-income adults, children, and families.",
        url: "https://www.medicaid.gov",
      },
      {
        id: "hc-3",
        name: "Find a Health Center",
        description: "Community health centers offer care on a sliding fee scale based on your income. No one is turned away.",
        url: "https://findahealthcenter.hrsa.gov",
      },
      {
        id: "hc-4",
        name: "MassHealth (MA Medicaid)",
        description: "Massachusetts health insurance for low-income residents. Many working adults qualify. Covers medical, dental, and vision.",
        url: "https://www.mass.gov/masshealth",
        isLocal: true,
      },
    ],
  },
  {
    id: "financial",
    title: "Financial Help",
    icon: "💰",
    description: "Tax credits, emergency funds, and financial coaching",
    resources: [
      {
        id: "fin-1",
        name: "Earned Income Tax Credit (EITC)",
        description: "A tax credit worth up to $7,430 for working people with low to moderate income. Many people miss this.",
        url: "https://www.irs.gov/credits-deductions/individuals/earned-income-tax-credit-eitc",
      },
      {
        id: "fin-2",
        name: "Benefits Finder (Benefits.gov)",
        description: "Answer a few questions to find all the government benefits you might qualify for.",
        url: "https://www.benefits.gov/benefit-finder",
      },
      {
        id: "fin-3",
        name: "Find Emergency Assistance (211)",
        description: "Call or text 211 for help with utilities, rent, and other urgent financial needs.",
        url: "https://www.211.org",
        phone: "211",
      },
      {
        id: "fin-4",
        name: "MA Good Neighbor Energy Fund",
        description: "Help paying heating bills for Massachusetts residents who don't qualify for federal fuel assistance.",
        url: "https://www.magoodneighbor.org",
        isLocal: true,
      },
    ],
  },
];
