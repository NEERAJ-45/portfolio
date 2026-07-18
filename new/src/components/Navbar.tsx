import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;

      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrolled(scrollTop > 50);
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="w-full flex items-center justify-between h-16 px-6 md:px-12 max-w-full mx-auto relative">
        {/* Logo */}
        <a
          href="#"
          className="text-xl font-bold text-foreground flex items-center gap-3 flex-shrink-0"
        >
          <span>
            <span className="text-primary">&lt;</span>
            neerajCodes
            <span className="text-primary">/&gt;</span>
          </span>

          {/* Motto */}
          <span className="hidden md:inline-block text-xs font-bold text-white text-muted-foreground tracking-wide">
            Clean Code. Solid Systems.
          </span>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8 ml-auto">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors duration-300"
          >
            Get in Touch
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-foreground ml-auto"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 w-full bg-background border-t border-border flex flex-col space-y-2 py-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="block py-2 px-6 text-foreground hover:text-primary font-medium transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="block mt-2 mx-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium text-center hover:bg-primary/90 transition-colors duration-300"
              onClick={() => setIsOpen(false)}
            >
              Get in Touch
            </a>
          </div>
        )}

        {/* 🔴 Bottom scroll breadcrumb */}
        <div className="absolute bottom-0 left-0 h-[2px] w-full bg-transparent">
          <div
            className="h-full bg-primary transition-transform duration-150 ease-out origin-left"
            style={{ transform: `scaleX(${scrollProgress / 100})` }}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
