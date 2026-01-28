const Footer = () => {
  return (
    <footer className="border-t border-border py-8">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <p className="text-muted-foreground text-sm">
          Designed & Built by{" "}
          <span className="text-primary font-medium">Neeraj Surnis</span>
        </p>
        <p className="text-muted-foreground/60 text-xs mt-2">
          © {new Date().getFullYear()} All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;