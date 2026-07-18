import { Briefcase, Calendar, MapPin } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const experiences = [
  {
    title: "Software Engineer Trainee (Intern)",
    company: "Maximus Infoware",
    location: "Thane, Maharashtra",
    period: "Dec 2025 – Present",
    description:
      "Contributing to a high-volume digital payments platform with compliance-heavy, audit-driven workflows.",
    achievements: [
      "Designed and optimized 15+ backend services and REST APIs using ASP.NET Core and Oracle, supporting critical payment flows",
      "Automated backend validation and API testing using Python, reducing manual verification effort by 50%+",
      "Debugged edge cases and optimized business logic, improving transaction success rate by ~35%",
      "Refactored complex SQL queries and stored procedures, reducing database execution latency by ~40%",
    ],
  },
  {
    title: "Full Stack Developer Intern",
    company: "SainiSoft Infotech",
    location: "Ichalkaranji, Maharashtra",
    period: "Nov 2024 – Apr 2025",
    description:
      "Worked in a startup environment contributing to full-stack development of an LMS platform for 11th–12th grade colleges.",
    achievements: [
      "Built 10+ REST APIs and multiple React UI modules, accelerating feature delivery and improving UI consistency",
      "Resolved 20+ frontend and backend bugs in collaboration with senior developers, improving system stability",
      "Assisted in deployments and iterative releases, contributing to bi-weekly production updates",
      "Used Git-based version control to manage features and fixes across multiple release cycles",
    ],
  },
  {
    title: "Software Development Intern",
    company: "Tiyara Innovations LLP",
    location: "Remote",
    period: "May 2025 – Nov 2025",
    description:
      "Developed backend services for a rental-based e-commerce platform using RESTful architecture.",
    achievements: [
      "Built reusable backend components and optimized API responses, reducing API error rates by ~30%",
      "Implemented inventory, pricing, and order workflows supporting 1,500+ transactions",
      "Improved API performance and response consistency under concurrent access",
      "Worked in a startup-style environment with rapid iterations and shared ownership of features",
    ],
  },
];

const Experience = () => {
  return (
    <section id="experience" className="bg-card/50">
      <div className="section-container">
        <ScrollAnimation>
          <div className="red-accent-line" />
          <h2 className="section-title">Experience</h2>
          <p className="section-subtitle">
            My professional journey in software development
          </p>
        </ScrollAnimation>

        <div className="relative mt-16">
          {/* Center stepper line */}
          <div className="absolute left-1/2 top-0 h-full w-px bg-border -translate-x-1/2 hidden md:block" />

          <div className="space-y-20">
            {experiences.map((exp, index) => {
              const isLeft = index % 2 === 0;

              return (
                <div key={index} className="relative">
                  {/* Step dot */}
                  <div className="absolute left-1/2 top-6 w-4 h-4 bg-background border-2 border-primary rounded-full -translate-x-1/2 hidden md:block" />

                  <ScrollAnimation
                    delay={index * 0.15}
                    direction={isLeft ? "left" : "right"}
                  >
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 ${
                        isLeft ? "md:pr-16" : "md:pl-16"
                      }`}
                    >
                      <div className={isLeft ? "" : "md:col-start-2"}>
                        <div className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-all duration-300">
                          {/* Header */}
                          <h3 className="text-xl font-semibold text-foreground text-center">
                            {exp.title}
                          </h3>

                          <div className="flex items-center justify-center gap-2 text-primary font-medium mt-1">
                            <Briefcase size={14} />
                            <span>{exp.company}</span>
                          </div>

                          <div className="flex flex-col items-center text-sm text-muted-foreground gap-1 mt-2">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} />
                              <span>{exp.period}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin size={14} />
                              <span>{exp.location}</span>
                            </div>
                          </div>

                          {/* Description (JUSTIFIED) */}
                          <p className="text-muted-foreground mt-4 mb-4 text-justify">
                            {exp.description}
                          </p>

                          {/* Achievements (JUSTIFIED) */}
                          <ul className="space-y-2 text-justify max-w-xl mx-auto">
                            {exp.achievements.map((achievement, i) => (
                              <li
                                key={i}
                                className="flex items-start gap-2 text-sm text-muted-foreground"
                              >
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </ScrollAnimation>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
