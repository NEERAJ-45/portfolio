import { FaJava, FaDatabase, FaAws } from 'react-icons/fa6';
import {
  SiJavascript, SiTypescript, SiPython, SiSpringboot, SiApachekafka,
  SiNodedotjs, SiReact, SiNextdotjs, SiPostgresql, SiMysql, SiMongodb,
  SiRedis, SiLinux, SiDocker, SiGit, SiGithubactions, SiPostman, SiJira
} from 'react-icons/si';

export const logoBadge = (icon: React.ReactNode, title: string, color: string) => (
  <div className="glass-logo-badge" style={{ '--brand-color': color, color } as React.CSSProperties}>
    {icon}
    <div className="glass-tooltip">{title}</div>
  </div>
);

export const skillRow1 = [
  { node: logoBadge(<FaJava />, 'Java', '#e76f51') },
  { node: logoBadge(<SiSpringboot />, 'Spring Boot', '#6db33f') },
  { node: logoBadge(<SiApachekafka />, 'Apache Kafka', '#c5ff7c') },
  { node: logoBadge(<SiNodedotjs />, 'Node.js', '#5fa04e') },
  { node: logoBadge(<SiPython />, 'Python', '#3776ab') },
  { node: logoBadge(<SiJavascript />, 'JavaScript', '#f7df1e') },
  { node: logoBadge(<SiTypescript />, 'TypeScript', '#3178c6') },
];

export const skillRow2 = [
  { node: logoBadge(<SiReact />, 'React', '#61dafb') },
  { node: logoBadge(<SiNextdotjs />, 'Next.js', '#ffffff') },
  { node: logoBadge(<SiPostgresql />, 'PostgreSQL', '#4169e1') },
  { node: logoBadge(<SiMysql />, 'MySQL', '#00758f') },
  { node: logoBadge(<SiMongodb />, 'MongoDB', '#47a248') },
  { node: logoBadge(<SiRedis />, 'Redis', '#dc382d') },
  { node: logoBadge(<FaDatabase />, 'Oracle DB & SQL', '#ffb454') },
];

export const skillRow3 = [
  { node: logoBadge(<SiLinux />, 'Linux', '#fcc624') },
  { node: logoBadge(<SiDocker />, 'Docker', '#2496ed') },
  { node: logoBadge(<FaAws />, 'AWS', '#ff9900') },
  { node: logoBadge(<SiGit />, 'Git', '#f05032') },
  { node: logoBadge(<SiGithubactions />, 'CI/CD & GitHub Actions', '#2088ff') },
  { node: logoBadge(<SiPostman />, 'Postman', '#ff6c37') },
  { node: logoBadge(<SiJira />, 'Jira', '#0052cc') },
];
