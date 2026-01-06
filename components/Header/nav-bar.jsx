"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";

/* ============================================================
                        MAIN NAVBAR (Scaled Wrapper)
============================================================ */
export default function NavBar() {
  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  /* 🔒 Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

  /* ⬆️⬇️ Hide navbar on scroll (disabled when menu open) */
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!navRef.current || mobileOpen) return;

      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        navRef.current.style.transform = "translateY(-100%)";
      } else {
        navRef.current.style.transform = "translateY(0)";
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [mobileOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // ESC key closes mobile menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
      }
    };

    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileOpen]);

  // Basic focus management: focus back to burger on close
  useEffect(() => {
    if (!mobileOpen && burgerRef.current) {
      burgerRef.current.focus();
    }
  }, [mobileOpen]);

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);

  return (
    <>
      {/* SCALED NAVBAR CONTAINER */}
      <div
        className="fixed top-0 left-0 w-full z-[1000]"
        style={{
          transform: "scale(0.9)",
          transformOrigin: "top left",
          width: "111.111%", // 1 / 0.9 ≈ 111.111% to counteract scaling shrinkage
          height: "111.111%",
          pointerEvents: mobileOpen ? "auto" : "auto", // always interactive
        }}
      >
        {/* NAVBAR */}
        <header
          ref={navRef}
          className={`
            fixed top-0 left-0 w-full h-[85px]

            /* Always solid on mobile */
            bg-[#0f2a5f] backdrop-blur-none

            /* Glass only on desktop AND only when menu closed */
            md:${mobileOpen ? "bg-[#0f2a5f]" : "bg-[#0f2a5f]/80"}
            md:${mobileOpen ? "backdrop-blur-none" : "backdrop-blur-xl"}

            border-b border-white/10
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            flex items-center justify-between
            px-6 md:px-12
            transition-all duration-300
          `}
        >
          {/* LOGO */}
          <Link href="/" className="flex items-center">
            <motion.img
              src="/logo.png"
              alt="Logo"
              className="
                w-[55px] h-[55px]
                rounded-full object-cover
                shadow-lg ring-2 ring-white/10
              "
              initial={{ rotate: -180, scale: 0.85, opacity: 0 }}
              animate={{ rotate: 0, scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.9, ease: "easeOut" }}
            />
          </Link>

          {/* DESKTOP NAV */}
          <MemoizedDesktopNav />

          {/* DESKTOP BUTTONS */}
          <div className="hidden md:flex items-center gap-4">
            <ButtonGreen text="Sign Up" link="/signup" />
            <ButtonOrange text="Login" link="/login" />
          </div>

          {/* MOBILE BURGER */}
          <button
            ref={burgerRef}
            className="md:hidden text-white text-3xl"
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <FaBars />
          </button>
        </header>
      </div>

      {/* MOBILE MENU - Outside the scaled wrapper to avoid scaling it */}
      <MobileMenu open={mobileOpen} onClose={closeMobileMenu} />
    </>
  );
}

/* ============================================================
                      DESKTOP NAV (Memoized)
============================================================ */
const MemoizedDesktopNav = memo(() => {
  const [active, setActive] = useState(null);

  return (
    <ul className="hidden md:flex items-center gap-8">
      <NavItem label="Home" link="/" />

      <DesktopDropdown
        label="Countries"
        active={active === "Countries"}
        onToggle={() => setActive(active === "Countries" ? null : "Countries")}
        items={["USA", "UK", "Canada", "Australia", "Germany", "New Zealand"]}
      />

      <DesktopDropdown
        label="Courses"
        active={active === "Courses"}
        onToggle={() => setActive(active === "Courses" ? null : "Courses")}
        items={[
          "Engineering & Technology",
          "Business & Management",
          "Medicine & Healthcare",
          "Computer Science & IT",
        ]}
      />

      <DesktopDropdown
        label="Programs"
        active={active === "Programs"}
        onToggle={() => setActive(active === "Programs" ? null : "Programs")}
        items={["Scholarships", "Universities", "Visa Guidance"]}
      />

      <NavItem label="Why Us" link="/why-us" />
      <NavItem label="Success Stories" link="/success-stories" />
      <NavItem label="Contact" link="/contact" />
    </ul>
  );
});

MemoizedDesktopNav.displayName = "MemoizedDesktopNav";

/* ============================================================
                    NAV ITEMS & DROPDOWNS (unchanged)
============================================================ */
const NavItem = ({ label, link }) => (
  <Link
    href={link}
    className="
      relative text-white font-medium px-2 py-2
      after:absolute after:left-0 after:-bottom-1
      after:h-[2px] after:w-0 after:bg-orange-400
      after:transition-all after:duration-300
      hover:after:w-full
    "
  >
    {label}
  </Link>
);

const DesktopDropdown = ({ label, active, onToggle, items }) => (
  <li className="relative">
    <button
      onClick={onToggle}
      className="flex items-center gap-2 text-white font-medium px-2 py-2"
      aria-expanded={active}
      aria-haspopup="true"
    >
      {label}
      <FaAngleDown
        className={`transition-transform ${active ? "rotate-180" : ""}`}
      />
    </button>

    <ul
      className={`
        absolute top-[120%] left-0 min-w-[240px]
        bg-white rounded-xl shadow-[0_20px_40px_rgba(0,0,0,0.15)]
        py-2 transition-all duration-200
        ${active ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
      role="menu"
    >
      {items.map((item, i) => (
        <li key={i} role="menuitem">
          <Link
            href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
            className="block px-5 py-3 mx-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white"
          >
            {item}
          </Link>
        </li>
      ))}
    </ul>
  </li>
);

/* ============================================================
                      MOBILE MENU (unchanged, outside scale)
============================================================ */
const MobileMenu = ({ open, onClose }) => {
  const [render, setRender] = useState(false);
  const menuRef = useRef(null);
  const firstLinkRef = useRef(null);

  useEffect(() => {
    if (open) {
      setRender(true);
    } else {
      const timeout = setTimeout(() => setRender(false), 400);
      return () => clearTimeout(timeout);
    }
  }, [open]);

  useEffect(() => {
    if (!open || !menuRef.current) return;

    const focusableElements = menuRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = firstLinkRef.current || focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) firstElement.focus();

    const handleKeyDown = (e) => {
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (!render) return null;

  const panelVariants = {
    hidden: { x: "100%", opacity: 0, scale: 0.95 },
    visible: { x: 0, opacity: 1, scale: 1 },
    exit: { x: "100%", opacity: 0, scale: 0.95 },
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };
  const containerVariants = {
    visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence mode="wait">
      {open && (
        <div className="fixed inset-0 z-[2000]" ref={menuRef}>
          <motion.div
            key="backdrop"
            className="absolute inset-0 bg-black/40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
          />

          <motion.div
            key="panel"
            className="absolute top-0 right-0 h-full w-[80%] bg-[#0f2a5f] p-6"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <motion.button
              className="text-white text-3xl absolute top-5 right-5 hover:opacity-80"
              onClick={onClose}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
            >
              <FaTimes />
            </motion.button>

            <motion.div
              className="mt-20 flex flex-col gap-6 text-white"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <MobileNavItem
                  ref={firstLinkRef}
                  label="Home"
                  link="/"
                  onClick={onClose}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileDropdown
                  label="Countries"
                  items={["USA", "UK", "Canada"]}
                  onClick={onClose}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileDropdown
                  label="Courses"
                  items={["Engineering", "Business", "IT"]}
                  onClick={onClose}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileDropdown
                  label="Programs"
                  items={["Scholarships", "Visa Guidance"]}
                  onClick={onClose}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavItem
                  label="Why Us"
                  link="/why-us"
                  onClick={onClose}
                />
              </motion.div>
              <motion.div variants={itemVariants}>
                <MobileNavItem
                  label="Contact"
                  link="/contact"
                  onClick={onClose}
                />
              </motion.div>
            </motion.div>

            <motion.div
              className="mt-10 flex flex-col gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <ButtonGreen
                text="Sign Up"
                link="/signup"
                full
                onClick={onClose}
              />
              <ButtonOrange text="Login" link="/login" full onClick={onClose} />
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const MobileNavItem = React.forwardRef(({ label, link, onClick }, ref) => (
  <Link
    ref={ref}
    href={link}
    onClick={onClick}
    className="text-lg border-b border-white/10 pb-2 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#0f2a5f]"
  >
    {label}
  </Link>
));

MobileNavItem.displayName = "MobileNavItem";

const MobileDropdown = ({ label, items, onClick }) => {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between w-full text-lg border-b border-white/10 pb-2"
        aria-expanded={open}
      >
        {label}
        <FaAngleDown className={`transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 ml-2 flex flex-col gap-2">
          {items.map((item, i) => (
            <Link
              key={i}
              href={`/${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={onClick}
              className="bg-[#1b3a7a] px-4 py-2 rounded-lg"
            >
              {item}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

/* ============================================================
                      BUTTONS (unchanged)
============================================================ */
const ButtonGreen = ({ text, link, full, onClick }) => (
  <Link
    href={link}
    onClick={onClick}
    className={`bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl text-white font-semibold text-center ${
      full && "w-full"
    } focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-[#0f2a5f]`}
  >
    {text}
  </Link>
);

const ButtonOrange = ({ text, link, full, onClick }) => (
  <Link
    href={link}
    onClick={onClick}
    className={`bg-orange-500 hover:bg-orange-600 px-5 py-2 rounded-xl text-white font-semibold text-center ${
      full && "w-full"
    } focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-[#0f2a5f]`}
  >
    {text}
  </Link>
);
