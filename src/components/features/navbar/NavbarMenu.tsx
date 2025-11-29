"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Instagram, Linkedin, Twitter, Menu, X } from "lucide-react";
import { FaTiktok } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const NavbarMenu = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasRevealed, setHasRevealed] = useState(false);
  const [hasPlayedIntro, setHasPlayedIntro] = useState(false);
  const lastScrollYRef = useRef(0);
  const tickingRef = useRef(false);

  const navLinks = [
    { name: "About", href: "#about" },
    { name: "Projects & Stories", href: "#projects" },
    { name: "What's New", href: "#news" },
    { name: "Sponsors", href: "#sponsors" },
    { name: "FAQ", href: "#faq" },
    { name: "2025", href: "https://2025.qhacks.io" },
  ];

  const socialLinks = [
    {
      icon: Instagram,
      href: "https://instagram.com/qhacks",
      label: "Instagram",
    },
    { icon: Twitter, href: "https://twitter.com/qhacks", label: "Twitter" },
    {
      icon: Linkedin,
      href: "https://linkedin.com/company/qhacks",
      label: "LinkedIn",
    },
    { icon: FaTiktok, href: "https://tiktok.com/@qhacks", label: "TikTok" },
  ];

  useEffect(() => {
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const isDesktop = window.matchMedia("(min-width: 1024px)").matches;

      if (!isDesktop) {
        setIsVisible(true);
        lastScrollYRef.current = currentScrollY;
        return;
      }

      if (!tickingRef.current) {
        window.requestAnimationFrame(() => {
          const last = lastScrollYRef.current;
          const delta = currentScrollY - last;
          const scrolledPastHero = currentScrollY > 80;

          if (currentScrollY < 12) {
            setIsVisible(true);
          } else if (delta > 6 && scrolledPastHero) {
            setIsVisible(false);
          } else if (delta < -6) {
            setIsVisible(true);
          }

          lastScrollYRef.current = currentScrollY;
          tickingRef.current = false;
        });
        tickingRef.current = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (hasRevealed && !hasPlayedIntro) {
      setHasPlayedIntro(true);
    }
  }, [hasRevealed, hasPlayedIntro]);

  useEffect(() => {
    const target = document.getElementById("home");
    if (!target) {
      setHasRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setHasRevealed(true);
          }
        });
      },
      { threshold: 0.25 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (href.startsWith("#")) {
      e.preventDefault();
      const targetId = href.replace("#", "");
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
    setMobileOpen(false);
  };

  const navTransition = hasPlayedIntro
    ? { duration: 0.25, delay: 0, ease: "easeOut" }
    : { duration: 0.6, delay: 0.8, ease: "easeInOut" };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{
        y: hasRevealed && isVisible ? 0 : -100,
        opacity: hasRevealed && isVisible ? 1 : 0,
      }}
      transition={navTransition}
      className="fixed top-0 right-0 left-0 z-[120] will-change-transform"
    >
      {/* Black gradient at the very top */}
      <div className="pointer-events-none absolute top-0 right-0 left-0 h-8 bg-gradient-to-b from-black/30 via-black/15 to-transparent" />
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="flex h-12 items-center justify-between sm:h-14 lg:h-20 xl:h-24">
          <div className="flex items-center gap-4 lg:gap-8">
            {/* Logo */}
            <a
              href="#home"
              onClick={(e) => handleNavClick(e, "#home")}
              className="flex-shrink-0 touch-manipulation"
            >
              <Image
                src="/static/logo.png"
                alt="QHacks Logo"
                width={38}
                height={38}
                className="h-9 w-9 sm:h-10 sm:w-10 lg:h-9 lg:w-9 xl:h-10 xl:w-10"
                quality={90}
              />
            </a>

            {/* Navigation Links - Hidden on mobile, visible on desktop */}
            <ul className="hidden items-center gap-6 lg:flex xl:gap-8">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    className="group relative touch-manipulation text-xs font-light text-white/80 transition-colors duration-200 hover:text-white xl:text-lg 2xl:text-xl"
                  >
                    {link.name}
                    <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-white/80 transition-all duration-300 group-hover:w-full" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 lg:gap-5 xl:gap-6">
            {/* Hamburger for mobile */}
            <button
              className="rounded-full border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/30 focus:outline-none lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Social Icons */}
            <div className="hidden items-center gap-3 sm:flex lg:gap-5 xl:gap-6">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="touch-manipulation text-white/70 transition-colors duration-200 hover:text-white active:scale-95"
                  >
                    <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 lg:h-6 lg:w-6 xl:h-7 xl:w-7" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay (portal to body to avoid transform containment) */}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {mobileOpen && (
              <>
                <motion.div
                  className="fixed inset-0 z-[101] bg-black/70 backdrop-blur-sm"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setMobileOpen(false)}
                />
                <motion.div
                  className="fixed inset-0 z-[130] flex h-screen w-screen flex-col justify-center overflow-hidden bg-black"
                  initial={{ x: "100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "100%" }}
                  transition={{ type: "spring", stiffness: 260, damping: 28 }}
                >
                  <div className="mx-auto flex h-full w-full max-w-[520px] flex-col px-4">
                    <div className="flex items-center justify-between border-b border-white/10 bg-black px-3 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/static/logo.png"
                          alt="QHacks Logo"
                          width={34}
                          height={34}
                          className="h-9 w-9"
                          quality={90}
                        />
                        <span className="text-lg font-semibold tracking-tight text-white/90">
                          QHacks
                        </span>
                      </div>
                      <button
                        className="rounded-full bg-white/5 p-2 text-white/80 transition hover:bg-white/10 hover:text-white focus:ring-2 focus:ring-white/30 focus:outline-none"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close menu"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>

                    <div className="flex-1 space-y-3 overflow-y-auto px-3 py-6">
                      {navLinks.map((link) => (
                        <motion.a
                          key={link.href}
                          href={link.href}
                          onClick={(e) => handleNavClick(e, link.href)}
                          className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3.5 text-base font-semibold text-white/90 transition hover:border-white/20 hover:bg-white/8"
                          whileHover={{ x: 4 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          {link.name}
                        </motion.a>
                      ))}
                    </div>

                    <div className="border-t border-white/10 bg-black px-3 pt-4 pb-7">
                      <p className="mb-3 text-sm text-white/60">Follow us</p>
                      <div className="flex flex-wrap items-center gap-3">
                        {socialLinks.map((social) => {
                          const Icon = social.icon;
                          return (
                            <a
                              key={social.label}
                              href={social.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={social.label}
                              className="flex h-12 w-12 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/80 transition hover:bg-white/15 hover:text-white"
                            >
                              <Icon className="h-5 w-5" />
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </motion.nav>
  );
};

export default NavbarMenu;
