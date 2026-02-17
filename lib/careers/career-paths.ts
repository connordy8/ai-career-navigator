export interface TrainingProgram {
  id: string;
  name: string;
  provider: string;
  providerUrl: string;
  duration: string;
  cost: string;
  format: string;
  description: string;
  isFeatured?: boolean;
}

export interface CareerPath {
  id: string;
  title: string;
  icon: string;
  description: string;
  salaryRange: string;
  timeToEntry: string;
  demandLevel: "High" | "Very High" | "Growing";
  skills: string[];
  steppingStones: string[];
  programs: TrainingProgram[];
}

export const careerPaths: CareerPath[] = [
  {
    id: "it-support",
    title: "IT Support / Help Desk",
    icon: "💻",
    description: "Help people solve tech problems. Set up computers, fix software issues, and keep systems running. One of the fastest-growing entry points into tech careers.",
    salaryRange: "$18-26/hr",
    timeToEntry: "3-6 months",
    demandLevel: "Very High",
    skills: ["Troubleshooting", "Customer service", "Basic networking", "Windows/Mac OS", "Problem solving"],
    steppingStones: ["Help Desk Analyst → System Administrator → Network Engineer → IT Manager"],
    programs: [
      {
        id: "ma-it",
        name: "IT Support Career Track",
        provider: "Merit America",
        providerUrl: "https://meritamerica.org",
        duration: "5 months (part-time)",
        cost: "Free",
        format: "Online, live sessions",
        description: "Learn IT support fundamentals with career coaching, mentorship, and job placement support. Includes CompTIA A+ certification prep. No cost to learners.",
        isFeatured: true,
      },
      {
        id: "ps-it",
        name: "IT Support",
        provider: "Per Scholas",
        providerUrl: "https://perscholas.org",
        duration: "12-15 weeks (full-time)",
        cost: "Free",
        format: "In-person or online",
        description: "Intensive tech training with job placement support. Learn IT fundamentals and prepare for CompTIA A+ certification.",
      },
      {
        id: "google-it",
        name: "Google IT Support Certificate",
        provider: "Google (via Coursera)",
        providerUrl: "https://www.coursera.org/professional-certificates/google-it-support",
        duration: "3-6 months (self-paced)",
        cost: "$49/month",
        format: "Online, self-paced",
        description: "Learn IT support fundamentals from Google. Includes hands-on labs. No experience needed.",
      },
    ],
  },
  {
    id: "data-analytics",
    title: "Data Analytics",
    icon: "📊",
    description: "Turn numbers into useful information. Help companies make better decisions by analyzing data and creating reports. Great for people who like finding patterns.",
    salaryRange: "$22-35/hr",
    timeToEntry: "4-6 months",
    demandLevel: "Very High",
    skills: ["Excel / Google Sheets", "SQL basics", "Data visualization", "Attention to detail", "Critical thinking"],
    steppingStones: ["Data Analyst → Senior Data Analyst → Data Scientist → Analytics Manager"],
    programs: [
      {
        id: "ma-data",
        name: "Data Analytics Career Track",
        provider: "Merit America",
        providerUrl: "https://meritamerica.org",
        duration: "5 months (part-time)",
        cost: "Free",
        format: "Online, live sessions",
        description: "Learn data analytics with Excel, SQL, Tableau, and Python basics. Includes career coaching and job placement support. No cost to learners.",
        isFeatured: true,
      },
      {
        id: "google-data",
        name: "Google Data Analytics Certificate",
        provider: "Google (via Coursera)",
        providerUrl: "https://www.coursera.org/professional-certificates/google-data-analytics",
        duration: "3-6 months (self-paced)",
        cost: "$49/month",
        format: "Online, self-paced",
        description: "Learn data analysis using spreadsheets, SQL, R programming, and Tableau. Created by Google.",
      },
    ],
  },
  {
    id: "java-development",
    title: "Software Development (Java)",
    icon: "👨‍💻",
    description: "Build websites and apps that people use every day. Java is one of the most in-demand programming languages. High earning potential with room to grow.",
    salaryRange: "$25-40/hr",
    timeToEntry: "5-8 months",
    demandLevel: "Very High",
    skills: ["Java programming", "Problem solving", "Logical thinking", "Teamwork", "Attention to detail"],
    steppingStones: ["Junior Developer → Software Developer → Senior Developer → Tech Lead"],
    programs: [
      {
        id: "ma-java",
        name: "Java Development Career Track",
        provider: "Merit America",
        providerUrl: "https://meritamerica.org",
        duration: "5 months (part-time)",
        cost: "Free",
        format: "Online, live sessions",
        description: "Learn Java programming from scratch. Build real projects. Includes career coaching and job placement support. No cost to learners.",
        isFeatured: true,
      },
      {
        id: "fcc-web",
        name: "Full Stack Web Development",
        provider: "freeCodeCamp",
        providerUrl: "https://www.freecodecamp.org",
        duration: "6-12 months (self-paced)",
        cost: "Free",
        format: "Online, self-paced",
        description: "Learn HTML, CSS, JavaScript, and more through interactive coding challenges. Completely free, forever.",
      },
    ],
  },
  {
    id: "cybersecurity",
    title: "Cybersecurity",
    icon: "🔒",
    description: "Protect companies from hackers and data breaches. One of the fastest-growing and highest-paying fields in tech. Every company needs security people.",
    salaryRange: "$22-35/hr",
    timeToEntry: "4-8 months",
    demandLevel: "Very High",
    skills: ["Network basics", "Attention to detail", "Problem solving", "Analytical thinking", "Continuous learning"],
    steppingStones: ["Security Analyst → Security Engineer → Senior Security Engineer → CISO"],
    programs: [
      {
        id: "ps-cyber",
        name: "Cybersecurity",
        provider: "Per Scholas",
        providerUrl: "https://perscholas.org",
        duration: "12-15 weeks (full-time)",
        cost: "Free",
        format: "In-person or online",
        description: "Intensive cybersecurity training. Learn security fundamentals, threat detection, and incident response. CompTIA Security+ prep included.",
      },
      {
        id: "google-cyber",
        name: "Google Cybersecurity Certificate",
        provider: "Google (via Coursera)",
        providerUrl: "https://www.coursera.org/professional-certificates/google-cybersecurity",
        duration: "3-6 months (self-paced)",
        cost: "$49/month",
        format: "Online, self-paced",
        description: "Learn cybersecurity fundamentals from Google. No prior experience needed. Includes hands-on practice.",
      },
    ],
  },
  {
    id: "healthcare",
    title: "Healthcare (Medical Assistant / CNA / Phlebotomy)",
    icon: "🏥",
    description: "Care for patients in clinics, hospitals, and care facilities. Healthcare jobs are always in demand and can lead to nursing or other advanced healthcare careers.",
    salaryRange: "$15-22/hr",
    timeToEntry: "4-16 weeks",
    demandLevel: "Very High",
    skills: ["Patient care", "Communication", "Attention to detail", "Compassion", "Physical stamina"],
    steppingStones: ["CNA / Phlebotomist → Medical Assistant → LVN/LPN → RN → Nurse Practitioner"],
    programs: [
      {
        id: "cc-cna",
        name: "Certified Nursing Assistant Program",
        provider: "Local Community Colleges",
        providerUrl: "https://cew.georgetown.edu/cew-reports/roi2025/",
        duration: "4-8 weeks",
        cost: "$500-$1,500 (financial aid available)",
        format: "In-person (classroom + clinical)",
        description: "Learn patient care fundamentals. Clinical rotations in real healthcare settings. Many employers offer tuition reimbursement.",
      },
      {
        id: "cc-phleb",
        name: "Phlebotomy Certification",
        provider: "Local Community Colleges",
        providerUrl: "https://cew.georgetown.edu/cew-reports/roi2025/",
        duration: "4-8 weeks",
        cost: "$700-$1,500 (financial aid available)",
        format: "In-person (classroom + clinical)",
        description: "Learn to draw blood for lab tests. Quick certification that leads to stable, good-paying work in clinics and hospitals.",
      },
      {
        id: "cc-ma",
        name: "Medical Assistant Certificate",
        provider: "Local Community Colleges",
        providerUrl: "https://cew.georgetown.edu/cew-reports/roi2025/",
        duration: "3-6 months",
        cost: "$1,000-$3,000 (financial aid available)",
        format: "In-person or hybrid",
        description: "Learn clinical and administrative skills. Assist doctors, take vitals, manage patient records. High demand everywhere.",
      },
    ],
  },
  {
    id: "skilled-trades",
    title: "Skilled Trades (HVAC / Electrical / Plumbing)",
    icon: "🔧",
    description: "Hands-on work that's always needed. HVAC, electrical, and plumbing technicians earn great pay with overtime opportunities. Learn while you earn through apprenticeships.",
    salaryRange: "$18-35/hr",
    timeToEntry: "3-12 months",
    demandLevel: "High",
    skills: ["Mechanical aptitude", "Physical fitness", "Problem solving", "Safety awareness", "Math basics"],
    steppingStones: ["Apprentice → Journeyman → Master Technician → Start your own business"],
    programs: [
      {
        id: "cc-hvac",
        name: "HVAC Technician Program",
        provider: "Local Community Colleges & Trade Schools",
        providerUrl: "https://cew.georgetown.edu/cew-reports/roi2025/",
        duration: "6-12 months",
        cost: "$2,000-$5,000 (financial aid available)",
        format: "In-person (classroom + hands-on)",
        description: "Learn heating, ventilation, and air conditioning installation and repair. EPA certification included. High demand year-round.",
      },
    ],
  },
  {
    id: "cdl-driving",
    title: "Commercial Driving (CDL)",
    icon: "🚛",
    description: "Drive trucks for a living. CDL drivers are in huge demand with signing bonuses common. Local routes mean you can be home every night.",
    salaryRange: "$22-32/hr",
    timeToEntry: "3-7 weeks",
    demandLevel: "Very High",
    skills: ["Safe driving", "Time management", "Physical stamina", "Navigation", "Record keeping"],
    steppingStones: ["CDL Driver (local) → Long-haul Driver → Owner-operator → Fleet manager"],
    programs: [
      {
        id: "cdl-school",
        name: "CDL Training Program",
        provider: "Various CDL Schools",
        providerUrl: "https://www.fmcsa.dot.gov/registration/commercial-drivers-license",
        duration: "3-7 weeks",
        cost: "$3,000-$7,000 (many employers reimburse)",
        format: "In-person (classroom + driving)",
        description: "Get your Commercial Driver's License. Many trucking companies offer free training in exchange for a work commitment.",
      },
    ],
  },
  {
    id: "business-operations",
    title: "Business Operations / Finance",
    icon: "📋",
    description: "Keep businesses running smoothly. Handle operations, process payments, manage accounts. Good path for detail-oriented people who like working with numbers.",
    salaryRange: "$18-28/hr",
    timeToEntry: "4-8 months",
    demandLevel: "High",
    skills: ["Organization", "Attention to detail", "Excel / spreadsheets", "Communication", "Problem solving"],
    steppingStones: ["Operations Coordinator → Operations Manager → Director of Operations"],
    programs: [
      {
        id: "yu-fin",
        name: "Financial Operations",
        provider: "Year Up",
        providerUrl: "https://yearup.org",
        duration: "6 months training + 6 months internship",
        cost: "Free (stipend provided)",
        format: "In-person",
        description: "Learn business and financial operations with a guaranteed internship at a top company. Receive a weekly stipend during the program.",
      },
      {
        id: "yu-biz",
        name: "Business Operations",
        provider: "Year Up",
        providerUrl: "https://yearup.org",
        duration: "6 months training + 6 months internship",
        cost: "Free (stipend provided)",
        format: "In-person",
        description: "Build professional skills and get hands-on experience at Fortune 500 companies. Includes a paid internship.",
      },
    ],
  },
];
