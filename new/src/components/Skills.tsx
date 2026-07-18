import { Code2, Database, Server, Terminal, Wrench, Layers } from "lucide-react";
import ScrollAnimation from "./ScrollAnimation";

const skillCategories = [
  {
    title: "Programming",
    icon: Code2,
    skills: ["Python", "Java", "C#", "JavaScript", "SQL"],
  },
  {
    title: "Backend",
    icon: Server,
    skills: ["REST APIs", "Python Services", "Spring Core", "ASP.NET Core Web API"],
  },
  {
    title: "Databases",
    icon: Database,
    skills: ["PostgreSQL", "Oracle", "MySQL", "MongoDB"],
  },
  {
    title: "Frontend",
    icon: Layers,
    skills: ["React", "Redux", "Tailwind CSS","API Integration"],
  },
  {
    title: "Core Computer Science",
    icon: Layers,  
    skills: [
      "Data Structures & Algorithms",
      "Object-Oriented Design",
      "Concurrency",
      "Database Systems",
    ],
  },
  {
    title: "Tools",
    icon: Wrench,
    skills: ["Git", "Docker", "Postman", "Jira", "Unit Testing"],
  },
];

const Skills = () => {
  return (
    <section id="skills" className="bg-card/50">
      <div className="section-container">
        <ScrollAnimation>
          <div className="red-accent-line" />
          <h2 className="section-title">Skills & Technologies</h2>
          <p className="section-subtitle">
            The tools and technologies I use to bring ideas to life
          </p>
        </ScrollAnimation>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {skillCategories.map((category, index) => {
            const Icon = category.icon;
            return (
              <ScrollAnimation 
                key={category.title} 
                delay={index * 0.1}
                direction={index % 2 === 0 ? "up" : "right"}
              >
                <div className="project-card h-full">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="text-primary" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {category.title}
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                      <span key={skill} className="skill-tag">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollAnimation>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Skills;