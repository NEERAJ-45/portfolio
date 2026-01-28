import { Github, Linkedin, Mail, ChevronDown, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Typed from "typed.js";
import avatarImage from "@/assets/avatar.jpg";

const Hero = () => {
  const typedRef = useRef(null);

  useEffect(() => {
    const options = {
      strings: [
        "Software Engineer",
        "Backend Developer",
        "Problem Solver",
        "API Architect",
        "Data Workflow Optimizer",
        "Performance Enthusiast",
      ],
      typeSpeed: 50,
      backSpeed: 25,
      backDelay: 1500,
      loop: true,
      showCursor: true,
      cursorChar: "|",
    };

    const typed = new Typed(typedRef.current, options);

    return () => typed.destroy(); // Cleanup on unmount
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />

      {/* Red accent glow */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-primary font-mono  text-lg mb-4"
            >
              Hi, my name is
            </motion.p>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4"
            >
              Neeraj Surnis
            </motion.h1>

            {/* Typed.js animated subheading */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6 h-12"
            >
              <span ref={typedRef}></span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-muted-foreground text-lg max-w-xl mb-8"
            >
              Passionate about building robust and scalable backend systems.
              Experienced in designing APIs, optimizing data workflows, and
              developing secure, high-performance server-side solutions for
              real-world applications in fast-paced environments.
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="flex items-center justify-center lg:justify-start space-x-6"
            >
              <a
                href="https://github.com/NEERAJ-45"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="GitHub"
              >
                <Github size={24} />
              </a>
              <a
                href="https://linkedin.com/in/neeraj-surnis"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="LinkedIn"
              >
                <Linkedin size={24} />
              </a>
              <a
                href="https://twitter.com/neerajsurnis04"
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label="Twitter"
              >
                <Twitter size={24} />
              </a>
              <a
                href="mailto:neerajsurnis@gmail.com"
                className="social-link"
                aria-label="Email"
              >
                <Mail size={24} />
              </a>
            </motion.div>
          </div>

          {/* Avatar */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-2 border-primary/30 shadow-2xl shadow-primary/20 relative z-10">
              <img
                src={avatarImage}
                alt="Neeraj Surnis"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative ring */}
            <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/20 scale-110 animate-pulse" />
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce"
        >
          <a href="#about" aria-label="Scroll to about section">
            <ChevronDown
              className="text-muted-foreground hover:text-primary transition-colors"
              size={32}
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
