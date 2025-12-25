const AnchorLink = ({ to, children, onClick }) => (
  <a
    href={`#${to.toLowerCase()}`}
    onClick={(e) => {
      e.preventDefault();
      document
        .getElementById(to.toLowerCase())
        ?.scrollIntoView({ behavior: 'smooth' });
      if (onClick) onClick();
    }}
    className="
      transition-all duration-300 ease-out
      hover:text-neon-cyan
      hover:scale-110
      transform
      rounded-md p-1
    "
  >
    {children}
  </a>
);

export default AnchorLink;
