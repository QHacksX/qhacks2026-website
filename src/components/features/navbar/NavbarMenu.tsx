"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Instagram, Linkedin, Twitter } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useEffect, useState } from "react";

const NavbarMenu = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects & Stories", href: "#projects" },
    { name: "What's New", href: "#news" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "FAQ", href: "#faq" },
    { name: "2024", href: "#2024" },
  ];

  const socialLinks = [
    { icon: Instagram, href: "https://instagram.com/qhacks", label: "Instagram" },
    { icon: Twitter, href: "https://twitter.com/qhacks", label: "Twitter" },
    { icon: Linkedin, href: "https://linkedin.com/company/qhacks", label: "LinkedIn" },
    { icon: FaTiktok, href: "https://tiktok.com/@qhacks", label: "TikTok" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Show navbar when scrolling up, hide when scrolling down
      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const targetId = href.replace('#', '');
      const targetElement = document.getElementById(targetId);
      
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ 
        y: isVisible ? 0 : -100, 
        opacity: isVisible ? 1 : 0 
      }}
      transition={{ 
        duration: 1, 
        delay: isVisible && lastScrollY === 0 ? 4 : 0,
        ease: "easeOut"
      }}
      className="fixed top-0 left-0 right-0 z-[102] will-change-transform"
      style={{ transform: 'translateZ(0)' }}
    >
      {/* Black gradient at the very top */}
      <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/30 via-black/15 to-transparent pointer-events-none" />
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex items-center justify-between h-12 sm:h-14 lg:h-16">
          {/* Logo */}
          <a href="#home" onClick={(e) => handleNavClick(e, "#home")} className="flex-shrink-0 touch-manipulation">
            <Image
              src="/logo/QHacks_logo.svg"
              alt="QHacks Logo"
              width={32}
              height={32}
              className="w-6 h-6 sm:w-7 sm:h-7 lg:w-8 lg:h-8"
              quality={90}
            />
          </a>

          {/* Navigation Links - Hidden on mobile, visible on desktop */}
          <ul className="hidden lg:flex items-center gap-4 xl:gap-6">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-white/80 hover:text-white text-xs xl:text-sm font-light transition-colors duration-200 relative group touch-manipulation"
                >
                  {link.name}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white/80 group-hover:w-full transition-all duration-300" />
                </a>
              </li>
            ))}
          </ul>

          {/* Social Icons */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="text-white/70 hover:text-white transition-colors duration-200 touch-manipulation active:scale-95"
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default NavbarMenu;
