import React from 'react';

export interface NavigationBarProps {
  onNavClick?: (item: string) => void;
  activeItem?: string;
  className?: string;
}

export const NavigationBar: React.FC<NavigationBarProps> = ({
  onNavClick,
  activeItem,
  className = '',
}) => {
  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Plans', href: '#plans' },
    { label: 'Security', href: '#security' },
    { label: 'About', href: '#about' },
  ];

  const handleItemClick = (e: React.MouseEvent<HTMLAnchorElement>, label: string) => {
    if (onNavClick) {
      e.preventDefault();
      onNavClick(label);
    }
  };

  return (
    <nav className={`w-full flex justify-center items-center pt-4 md:pt-6 px-4 z-30 ${className}`}>
      <div className="bg-white/70 backdrop-blur-md rounded-xl px-4 md:px-6 py-3 shadow-sm border border-black/5 flex items-center justify-between sm:justify-start gap-6 md:gap-8 max-w-fit">
        {/* Custom SVG Logo: two geometric arrow/chevron shapes in #1B133C, 24x24px */}
        <a 
          href="#home"
          onClick={(e) => handleItemClick(e, 'Home')}
          className="flex items-center gap-2 transition-transform hover:scale-105" 
          aria-label="Home"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 256 256"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 shrink-0"
          >
            <path
              d="M 256 256 L 128 256 L 0 128 L 128 128 Z"
              fill="#1B133C"
            />
            <path
              d="M 256 128 L 128 128 L 0 0 L 128 0 Z"
              fill="#1B133C"
            />
          </svg>
        </a>

        {/* Navigation Links (hidden on mobile, shown sm: and up) */}
        <div className="hidden sm:flex items-center gap-6 md:gap-8">
          {navLinks.map((link) => {
            const isActive = activeItem?.toLowerCase() === link.label.toLowerCase();
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleItemClick(e, link.label)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  isActive 
                    ? 'text-[#1B133C] font-semibold' 
                    : 'text-[#1B133C]/80 hover:text-[#1B133C]'
                }`}
              >
                {link.label}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
