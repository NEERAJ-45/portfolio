export type Principle = {
  index: string;
  title: string;
  body: string;
  tag: string;
};

export type Experience = {
  index: string;
  period: string;
  company: string;
  role: string;
  description: string;
  tags: string[];
  metric: { value: string; label: string };
};

export type Project = {
  index: string;
  name: string;
  kicker: string;
  subtitle: string;
  description: string;
  tags: string[];
  flow: string[];
  readout: string[];
  stats: { value: string; label: string }[];
  tone: "ink" | "paper" | "acid";
};

export type StackGroup = {
  index: string;
  title: string;
  items: string[];
};

export const profile = {
  name: "Neeraj Surnis",
  role: "Backend Software Engineer",
  location: "Maharashtra, India",
  email: "neerajsurnis@gmail.com",
  phone: "+91 93226 96345",
  phoneHref: "tel:+919322696345",
  github: "https://github.com/NEERAJ-45",
  linkedin: "https://linkedin.com/in/neeraj-surnis",
  current: "Software Engineer / Maximus Infoware",
};

export const principles: Principle[] = [
  {
    index: "01",
    title: "Idempotency, by default.",
    body: "Retries are inevitable. Duplicate charges are not. Idempotency keys, outbox patterns, and safe replays are table stakes.",
    tag: "Non-negotiable",
  },
  {
    index: "02",
    title: "Design for failure.",
    body: "Queues back up. Nodes disappear. The system should degrade gracefully, not surprise the people relying on it.",
    tag: "Resilience",
  },
  {
    index: "03",
    title: "Measure the floor.",
    body: "Query plans, p95s, and the boring numbers. Trust is built in the slowest request, not the demo.",
    tag: "Performance",
  },
];

export const experience: Experience[] = [
  {
    index: "01",
    period: "May 2024 — Aug 2024",
    company: "Tiyara Innovations LLP",
    role: "Full Stack Intern",
    description:
      "Secured data flows, JWT user sessions, booking validation logic, and REST API pathways.",
    tags: ["JWT sessions", "REST APIs", "Validation"],
    metric: { value: "JWT", label: "Session security" },
  },
  {
    index: "02",
    period: "Nov 2024 — Feb 2025",
    company: "Sainisoft Infotech",
    role: "Software Developer Intern",
    description:
      "Integrated course workflows supporting 5K+ users. Reworked state loading to cut load time by 40%.",
    tags: ["5K+ users", "Workflow", "State loading"],
    metric: { value: "−40%", label: "Load time" },
  },
  {
    index: "03",
    period: "Dec 2025 — Present",
    company: "Maximus Infoware",
    role: "Software Engineer",
    description:
      "Event-driven Spring Boot backends, Kafka validation pipelines, RBAC securing 10K+ transactions, and Oracle PL/SQL tuning by 40%.",
    tags: ["Spring Boot", "Kafka", "RBAC", "Oracle", "PL/SQL"],
    metric: { value: "10K+", label: "Transactions secured" },
  },
  {
    index: "04",
    period: "Ongoing",
    company: "Freelance Projects",
    role: "Software Consultant",
    description:
      "Custom server microservices, third-party payment integrations, and Docker deployments on AWS.",
    tags: ["Microservices", "Payments", "Docker", "AWS"],
    metric: { value: "E2E", label: "Client delivery" },
  },
  {
    index: "05",
    period: "Graduating 2026",
    company: "DKTE, Ichalkaranji",
    role: "B.Tech in Computer Science",
    description:
      "Distributed databases, software engineering patterns, and systems fundamentals. CGPA: 7.86.",
    tags: ["Distributed databases", "Systems", "Engineering patterns"],
    metric: { value: "7.86", label: "CGPA" },
  },
];

export const projects: Project[] = [
  {
    index: "01",
    name: "RevPay",
    kicker: "Event-driven payments",
    subtitle: "A payment platform that refuses to double-charge.",
    description:
      "Spring Boot microservices and Kafka events move money through a ledger that can survive retries. Optimistic locks, Redis idempotency keys, and the outbox pattern keep the state honest.",
    tags: ["Java 21", "Spring Boot", "Kafka", "Redis", "PostgreSQL", "AWS"],
    flow: ["API", "Kafka", "Ledger"],
    readout: ["Outbox / on", "Idempotency / on", "Locks / optimistic"],
    stats: [
      { value: "0", label: "Lost updates" },
      { value: "3", label: "Safety layers" },
    ],
    tone: "ink",
  },
  {
    index: "02",
    name: "Document Workflow",
    kicker: "Secure approvals",
    subtitle: "Three stages. No shortcuts.",
    description:
      "A three-stage document approval pipeline with role-based access. AES-256 client-side encryption and RSA-2048 key exchange protect the payload; Firebase alerts keep reviewers moving.",
    tags: ["Node.js", "Express", "MongoDB", "Firebase", "Docker"],
    flow: ["Upload", "Review", "Approve"],
    readout: ["AES-256 / on", "RSA-2048 / on", "Alerts / Firebase"],
    stats: [
      { value: "3", label: "Approval stages" },
      { value: "2", label: "Crypto layers" },
    ],
    tone: "acid",
  },
  {
    index: "03",
    name: "Freelance Systems",
    kicker: "Client delivery",
    subtitle: "From brief to deployed service.",
    description:
      "Bespoke full-stack systems for clients: dashboard metrics, third-party payment validations, and automated administrative workflows, shipped in Docker on AWS.",
    tags: ["React", "Next.js", "REST APIs", "Docker", "AWS"],
    flow: ["Client", "API", "Deploy"],
    readout: ["Docker / on", "AWS / on", "Integrations / live"],
    stats: [
      { value: "E2E", label: "Delivery" },
      { value: "Custom", label: "Scope" },
    ],
    tone: "paper",
  },
  {
    index: "04",
    name: "LMS Course Manager",
    kicker: "Admin at scale",
    subtitle: "Five thousand users, one clean dashboard.",
    description:
      "Admin dashboards supporting 5K+ users with role-based access. Optimized frontend state structures reduced load times by 40%.",
    tags: ["Spring Boot", "React", "MySQL", "State management"],
    flow: ["Admin", "Course", "User"],
    readout: ["RBAC / on", "State / optimized", "Load / −40%"],
    stats: [
      { value: "5K+", label: "Users" },
      { value: "−40%", label: "Load time" },
    ],
    tone: "ink",
  },
];

export const stackGroups: StackGroup[] = [
  {
    index: "01",
    title: "Languages",
    items: ["Java 21", "Python", "JavaScript", "SQL", "PL/SQL"],
  },
  {
    index: "02",
    title: "Backend",
    items: ["Spring Boot", "Node.js", "REST APIs", "Kafka", "JWT / RBAC"],
  },
  {
    index: "03",
    title: "Data",
    items: ["PostgreSQL", "MySQL", "MongoDB", "Redis", "Oracle", "Firebase"],
  },
  {
    index: "04",
    title: "Frontend",
    items: ["React", "Next.js", "State management"],
  },
  {
    index: "05",
    title: "Cloud & Ops",
    items: [
      "AWS (EC2/S3)",
      "Docker",
      "CloudWatch",
      "X-Ray",
      "CI/CD",
      "Linux",
      "Git",
      "Postman",
      "Jira",
    ],
  },
];

export const tickerItems = [
  "Java 21",
  "Spring Boot",
  "Kafka",
  "Redis",
  "PostgreSQL",
  "Oracle",
  "PL/SQL",
  "AWS",
  "Docker",
  "React",
  "Next.js",
  "Event-driven",
  "Idempotent",
  "RBAC",
  "CI/CD",
  "Linux",
];

export const sections = [
  { id: "hero", number: "00", label: "Intro" },
  { id: "principles", number: "01", label: "Principles" },
  { id: "ledger", number: "02", label: "Ledger" },
  { id: "systems", number: "03", label: "Systems" },
  { id: "toolkit", number: "04", label: "Toolkit" },
  { id: "contact", number: "05", label: "Contact" },
] as const;
