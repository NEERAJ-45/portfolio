"use client";

import { motion, MotionValue, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const COLORS = {
  lime: "#c5ff7c",
  amber: "#ffb454",
  rose: "#ff6f91",
  indigo: "#6366f1",
} as const;

const techColumns = [
  [
    { name: "Java", color: COLORS.lime },
    { name: "Spring Boot", color: COLORS.lime },
    { name: "Kafka", color: COLORS.amber },
    { name: "REST APIs", color: COLORS.lime },
    { name: "Node.js", color: COLORS.rose },
  ],
  [
    { name: "Python", color: COLORS.amber },
    { name: "React", color: COLORS.rose },
    { name: "Next.js", color: COLORS.lime },
    { name: "JavaScript", color: COLORS.amber },
    { name: "TypeScript", color: COLORS.indigo },
  ],
  [
    { name: "PostgreSQL", color: COLORS.indigo },
    { name: "MySQL", color: COLORS.rose },
    { name: "MongoDB", color: COLORS.lime },
    { name: "Redis", color: COLORS.amber },
    { name: "Oracle DB", color: COLORS.indigo },
    { name: "PL/SQL", color: COLORS.rose },
  ],
  [
    { name: "Docker", color: COLORS.indigo },
    { name: "AWS", color: COLORS.amber },
    { name: "Linux", color: COLORS.lime },
    { name: "CI/CD", color: COLORS.rose },
    { name: "Git", color: COLORS.amber },
    { name: "CloudWatch", color: COLORS.lime },
    { name: "X-Ray", color: COLORS.indigo },
  ],
];

const TechStackParallax = () => {
  const gallery = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: gallery,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 250]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y4 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <section className="relative w-full bg-[#0a0a0a]" id="skills">
      <div ref={gallery} className="relative box-border flex h-[120vh] gap-8 overflow-hidden bg-[#0a0a0a] p-8">
        <Column items={techColumns[0]} y={y} />
        <Column items={techColumns[1]} y={y2} />
        <Column items={techColumns[2]} y={y3} />
        <Column items={techColumns[3]} y={y4} />
      </div>
    </section>
  );
};

type ColumnProps = {
  items: { name: string; color: string }[];
  y: MotionValue<number>;
};

const Column = ({ items, y }: ColumnProps) => {
  return (
    <motion.div
      className="relative flex w-1/4 min-w-44 flex-col gap-8"
      style={{ y }}
    >
      {[...items, ...items].map((item, i) => (
        <div
          key={i}
          className="group relative flex min-h-24 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-white/[0.03] backdrop-blur-sm transition-all duration-500 hover:border-white/20 hover:bg-white/[0.07]"
          style={{
            boxShadow: `inset 0 0 60px -20px ${item.color}15`,
          }}
        >
          <span
            className="text-center text-base font-semibold tracking-tight transition-all duration-500 group-hover:scale-110 sm:text-lg"
            style={{ color: item.color }}
          >
            {item.name}
          </span>
        </div>
      ))}
    </motion.div>
  );
};

export { TechStackParallax };
