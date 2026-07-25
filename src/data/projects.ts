export interface ProjectData {
  id: string;
  num: string;
  title: string;
  motto?: string;
  repoUrl: string;
  color: string;
  tags: string[];
  shortDesc: string;
  fullDesc: string;
  features: string[];
  hustleDetails?: boolean;
}

export const projectsData: ProjectData[] = [
  {
    id: 'revpay',
    num: '01',
    title: 'RevPay — Distributed Payment System',
    repoUrl: 'https://github.com/NEERAJ-45/RevPay-Distributed-Payment-System',
    color: 'rgba(197, 255, 124, 0.18)',
    tags: ['Java 21', 'Spring Boot', 'Kafka', 'Redis', 'Postgres', 'AWS'],
    shortDesc: 'Distributed event-driven payment processing platform built with Spring Boot microservices and Apache Kafka events.',
    fullDesc: 'RevPay is a resilient financial transaction processing platform built to handle concurrent payment dispatches with high throughput. Utilizes Spring Boot microservices communicating via Apache Kafka event channels. Features transactional Outbox pattern, Redis idempotency keys, and optimistic database locking to eliminate duplicate charges and lost updates.',
    features: [
      'Event-driven microservices architecture communicating over Apache Kafka streams',
      'Transactional Outbox Pattern guaranteeing atomic DB state and event dispatch',
      'Redis Idempotency Keys preventing duplicate charge submissions',
      'Optimistic locking & PostgreSQL/Oracle PL/SQL query tuning',
    ],
  },
  {
    id: 'docmanager',
    num: '02',
    title: 'Document Workflow Manager',
    repoUrl: 'https://github.com/NEERAJ-45/document-workflow-manager',
    color: 'rgba(255, 180, 84, 0.18)',
    tags: ['Node.js', 'Express', 'MongoDB', 'Firebase', 'Docker', 'RBAC'],
    shortDesc: 'Multi-stage document review and approval pipeline featuring granular Role-Based Access Control (RBAC).',
    fullDesc: 'Secure enterprise document lifecycle manager enforcing multi-stage review pipelines (Draft → Review → Approved). Implements client-side AES-256 document payload encryption, RSA-2048 key exchange for secure reviewer handshakes, and Firebase real-time push notifications.',
    features: [
      'Granular 3-Tier Role Based Access Control (Draft, Reviewer, Approver)',
      'AES-256 client-side payload encryption before persistence',
      'RSA-2048 key exchange for secure reviewer validation handshakes',
      'Firebase Cloud Messaging real-time push alerts',
    ],
  },
  {
    id: 'hustle',
    num: '03',
    title: 'Hustle.ai — AI Job Hunting Platform',
    repoUrl: 'https://github.com/NEERAJ-45/Hustle.ai/',
    color: 'rgba(255, 111, 145, 0.22)',
    tags: ['Next.js', 'FastAPI', 'Kafka', 'Redis', 'MongoDB', 'LLMs', 'Nodemailer'],
    shortDesc: 'Full-stack AI job hunting platform. One-click tailored ATS resume & cover letter generation, auto-apply via email & API.',
    fullDesc: 'A full-stack AI-powered job hunting platform enabling users to discover jobs, generate tailored ATS resumes and cover letters with one click, and auto-apply via email or API — backed by an async ML pipeline using Kafka, Redis caching, and a FastAPI model layer.',
    features: [
      'One-click LLM pipeline analyzing JDs & generating tailored ATS resumes & cover letters',
      'Automated PDF conversion & Nodemailer email dispatch with PDF attachments',
      'Kafka async pipelines for background ML scoring & LLM document generation',
      '5 Justified Redis Caching Layers (Search Cache, JD Hash, Status, Rate Limiting, JWT Blacklist)',
    ],
    hustleDetails: true,
  },
  {
    id: 'lms',
    num: '04',
    title: 'LMS — Learning Management System',
    repoUrl: 'https://github.com/NEERAJ-45/lms',
    color: 'rgba(99, 102, 241, 0.18)',
    tags: ['Spring Boot', 'React', 'MySQL', 'REST APIs', 'Tailwind CSS'],
    shortDesc: 'Full-stack course management platform supporting role-based dashboards for students, instructors, and administrators.',
    fullDesc: 'Comprehensive educational platform supporting course enrollment, instructor uploads, student assignment submissions, and administrative grade tracking. Designed with optimized database queries and modular state management to ensure low latency and high availability.',
    features: [
      'Multi-Role User Dashboards (Student, Instructor, Admin)',
      'Optimized MySQL relational schema & JPA repository pipelines',
      'Interactive course player & progress tracker',
      '40% reduction in initial state loading times via state management',
    ],
  },
];
