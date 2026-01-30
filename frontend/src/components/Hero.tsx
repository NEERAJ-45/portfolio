import { Github, Linkedin, Mail, ChevronDown, Twitter } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import Typed from "typed.js";

import avatarImage from "@/assets/avatar.jpg";
import resumePdf from "../assets/Resume_Neeraj_Surnis.pdf";

const Hero = () => {
  const typedRef = useRef<HTMLSpanElement>(null);

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

    const typed = new Typed(typedRef.current!, options);

    return () => typed.destroy();
  }, []);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />

      <div className="section-container relative z-10 w-full">
        <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-12">
          {/* Text Section */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial="hidden"
              animate="show"
              variants={containerVariants}
            >
              <motion.p
                variants={itemVariants}
                className="text-primary font-mono text-lg mb-4"
              >
                Hi, my name is
              </motion.p>

              <motion.h1
                variants={itemVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4"
              >
                Neeraj Surnis
              </motion.h1>

              <motion.h2
                variants={itemVariants}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-muted-foreground mb-6 h-12"
              >
                <span ref={typedRef}></span>
              </motion.h2>

              <motion.p
                variants={itemVariants}
                className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0 mb-8"
              >
                Passionate about building robust and scalable backend systems.
                Experienced in designing APIs, optimizing data workflows, and
                developing secure, high-performance server-side solutions.
              </motion.p>

              {/* Social + Button */}
              <motion.div
                variants={itemVariants}
                className="
                  flex flex-col
                  sm:flex-row
                  items-center
                  justify-center lg:justify-start
                  gap-4 sm:gap-6
                "
              >
                {/* Social Icons */}
                <div className="flex items-center gap-6">
                  {[
                    {
                      href: "https://github.com/NEERAJ-45",
                      icon: <Github size={24} />,
                      label: "GitHub",
                    },
                    {
                      href: "https://linkedin.com/in/neeraj-surnis",
                      icon: <Linkedin size={24} />,
                      label: "LinkedIn",
                    },
                    {
                      href: "https://twitter.com/neerajsurnis04",
                      icon: <Twitter size={24} />,
                      label: "Twitter",
                    },
                    {
                      href: "mailto:neerajsurnis@gmail.com",
                      icon: <Mail size={24} />,
                      label: "Email",
                    },
                  ].map((item, idx) => (
                    <motion.a
                      key={idx}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={item.label}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.5 + idx * 0.1,
                        duration: 0.4,
                      }}
                      className="social-link hover:scale-110 transition-transform"
                    >
                      {item.icon}
                    </motion.a>
                  ))}
                </div>

                {/* Resume Button */}
                <motion.a
                  href={resumePdf}
                  download
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    px-6 py-3
                    bg-primary text-background
                    font-medium
                    rounded-lg
                    shadow-sm
                    hover:bg-primary/80
                    transition-colors
                     w-fit
                    mx-auto sm:mx-0
                   
                  "
                >
                  Download Resume
                </motion.a>
              </motion.div>
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

            <div className="absolute inset-0 w-64 h-64 md:w-80 md:h-80 rounded-full border border-primary/20 scale-110 animate-pulse" />
          </motion.div>
        </div>

        {/* Scroll Arrow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
          className="absolute bottom-8 inset-x-0 flex justify-center animate-bounce"
        >
          <a href="#about" aria-label="Scroll to about section">
            <ChevronDown
              size={32}
              className="text-muted-foreground hover:text-primary transition-colors"
            />
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
