import ScrollAnimation from "./ScrollAnimation";

const About = () => {
  return (
    <section id="about" className="section-container">
      <ScrollAnimation>
        <div className="red-accent-line" />
        <h2 className="section-title">About Me</h2>
      </ScrollAnimation>
      
      <div className="grid md:grid-cols-2 gap-12 items-start">
        <ScrollAnimation delay={0.1}>
          <div className="space-y-6">
            <p className="text-muted-foreground leading-relaxed">
              I'm a final-year <span className="text-foreground font-medium">B.Tech Computer Science student</span> at DKTE, Ichalkaranji, 
              passionate about designing and building robust backend systems that power real-world applications.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Currently working as a <span className="text-foreground font-medium">Software Engineer Trainee at Maximus Infoware</span>, 
              where I focus on optimizing server-side workflows, ensuring scalability, reliability, and high performance 
              for critical digital platforms.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              My experience with startups has strengthened my ability to build complex backend systems under tight deadlines, 
              design efficient APIs, and manage high-volume data workflows while maintaining strong reliability and security standards.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation delay={0.2} direction="right">
          <div className="bg-card border border-border rounded-lg p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Quick Facts</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Education:</span> B.Tech in Computer Science, DKTE Ichalkaranji
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Focus:</span> Backend Architecture, APIs, Data Workflows
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Experience:</span> Designing scalable, high-performance backend systems
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Problem Solving:</span> Optimizing workflows, ensuring reliability and scalability
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">
                  <span className="text-foreground font-medium">Leadership:</span> MLSA President, Student Chapter Lead
                </span>
              </li>
            </ul>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default About;
