import { ExternalLink, Github, Server } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const projects = [
  {
    title: "Hustle.ai - AI Job Matching Platform",
    description:
      "AI-powered job matching platform using NLP embeddings for intelligent job-resume matching. Built Python-based services processing 2K+ matching requests per day.",
    tech: ["Python", "NLP", "REST API", "Machine Learning"],
    highlights: [
      "Built Python-based services for job–resume matching using NLP embeddings",
      "Designed REST APIs to process 2K+ matching requests per day",
      "Implemented intelligent matching algorithms for accurate results",
    ],
    github: "https://github.com/NEERAJ-45/Hustle.ai",
  },
  {
    title: "Document Workflow Manager",
    description:
      "Secure role-based document approval system with multi-stage workflows, JWT authentication, and comprehensive audit logging.",
    tech: ["MongoDB", "JWT & OAuth", "ExpressJs", "React" ,"NodeJs"],
    highlights: [
      "Developed role-based document approval system with multi-stage workflows",
      "Implemented JWT authentication, audit logs, and approval tracking for 1K+ records",
      "Reduced manual approval turnaround time by 60%",
    ],
    github: "https://github.com/NEERAJ-45/document-workflow-manager",
  },
  {
    title: "Rentpe —  Rental E-Commerce Platform",
    description:
      "Full-stack furniture & electronics rental platform with comprehensive inventory management, pricing systems, and order workflows.",
    tech: ["React", "Spring Core", "REST API", "PostgreSQL"],
    highlights: [
      "Built REST APIs for catalog, pricing, orders, and inventory availability",
      "Handled rental lifecycle workflows processing 1.5K+ transactions",
      "Improved API response time by 30% via query and logic optimization",
    ],
    github: "",
  },
];

const Projects = () => {
  return (
    <section id="projects" className="section-container">
      <ScrollAnimation>
        <div className="red-accent-line" />
        <h2 className="section-title">Featured Projects</h2>
        <p className="section-subtitle">
          Real-world applications I've built with a focus on backend architecture
        </p>
      </ScrollAnimation>

      <div className="space-y-8">
        {projects.map((project, index) => (
          <ScrollAnimation key={project.title} delay={index * 0.15}>
            <div className="project-card group">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <Server className="text-primary" size={20} />
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="space-y-2 mb-4">
                    {project.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start space-x-2 text-sm text-muted-foreground">
                        <span className="w-1.5 h-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="lg:text-right">
                  <div className="flex flex-wrap gap-2 lg:justify-end mb-4">
                    {project.tech.map((tech) => (
                      <span
                        key={tech}
                        className="px-3 py-1 bg-secondary text-sm text-muted-foreground rounded-md font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center space-x-4 lg:justify-end">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-primary transition-colors"
                      aria-label="View source code"
                    >
                      <Github size={16} />
                      <span>Code</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimation>
        ))}
      </div>
    </section>
  );
};

export default Projects;