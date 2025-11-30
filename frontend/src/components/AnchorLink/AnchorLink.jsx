const AnchorLink = ({ to, children, onClick }) => (
  <a
    href={`#${to.toLowerCase()}`}
    onClick={(e) => {
      e.preventDefault();
      document.getElementById(to.toLowerCase())?.scrollIntoView({ behavior: 'smooth' });
      if (onClick) onClick();
    }}
    className="transition-colors hover:text-neon-cyan active:text-neon-purple focus:outline-none focus:ring-2 focus:ring-neon-purple/50 rounded-md p-1"
  >
    {children}
  </a>
);

export default AnchorLink;