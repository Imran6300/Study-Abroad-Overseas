"use client";

import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  FaAngleDown,
  FaBars,
  FaTimes,
  FaUserCircle,
  FaSignOutAlt,
  FaUser,
} from "react-icons/fa";
import Link from "next/link";

//redux

import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import { useRouter } from "next/navigation";

// FIXED COURSE CATEGORY ROUTES (DO NOT CHANGE TEXT IN UI)
const COURSE_CATEGORY_MAP = {
  "Engineering & Technology": "engineering",
  "Computer Science & IT": "engineering",
  "Business & Management": "business",
  "Medicine & Healthcare": "healthcare",
};

const toSlug = (text) => text.toLowerCase().trim().replace(/\s+/g, "-");

export default function NavBar() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isLoggedIn, user, authChecked } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    await fetch(
      "https://overseas-backend-production.up.railway.app/auth/logout",
      {
        method: "POST",
        credentials: "include",
      }
    );

    dispatch(logout());
    router.push("/login");
  };

  const navRef = useRef(null);
  const burgerRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => (document.body.style.overflow = "");
  }, [mobileOpen]);

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

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    };
    if (mobileOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen && burgerRef.current) burgerRef.current.focus();
  }, [mobileOpen]);

  const closeMobileMenu = useCallback(() => setMobileOpen(false), []);
  if (!authChecked) return null;

  return (
    <>
      <div
        className="fixed top-0 left-0 w-full z-[1000] pointer-events-none"
        style={{
          transform: "scale(0.9)",
          transformOrigin: "top left",
          width: "111.111%",
        }}
      >
        <header
          ref={navRef}
          className="
            pointer-events-auto
            fixed top-0 left-0 w-full h-[85px]
            bg-[#0f2a5f]
            border-b border-white/10
            shadow-[0_10px_30px_rgba(0,0,0,0.15)]
            flex items-center justify-between
            px-6 md:px-12
            transition-all duration-300
          "
        >
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

          <MemoizedDesktopNav />

          <div className="hidden md:flex items-center gap-4">
            {!isLoggedIn ? (
              <>
                <ButtonGreen text="Sign Up" link="/signup" />
                <ButtonOrange text="Login" link="/login" />
              </>
            ) : (
              <UserMenu user={user} onLogout={handleLogout} />
            )}
          </div>

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

      <MobileMenu
        open={mobileOpen}
        onClose={closeMobileMenu}
        isLoggedIn={isLoggedIn}
        handleLogout={handleLogout}
        user={user}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────────────────
// DESKTOP NAV (UNCHANGED)
// ────────────────────────────────────────────────────────────────────────

const MemoizedDesktopNav = memo(() => {
  const [active, setActive] = useState(null);

  return (
    <ul className="hidden md:flex items-center gap-8">
      <NavItem label="Home" link="/" />
      <DesktopDropdown
        type="countries"
        label="Countries"
        active={active === "Countries"}
        onToggle={() => setActive(active === "Countries" ? null : "Countries")}
        items={[
          "USA",
          "UK",
          "Canada",
          "Australia",
          "Germany",
          "China",
          "All Countries",
        ]}
      />
      <DesktopDropdown
        type="courses"
        label="Courses"
        active={active === "Courses"}
        onToggle={() => setActive(active === "Courses" ? null : "Courses")}
        items={[
          "Engineering & Technology",
          "Business & Management",
          "Medicine & Healthcare",
          "Computer Science & IT",
          "All Courses",
        ]}
      />
      <DesktopDropdown
        type="programs"
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
const UserMenu = ({ user, onLogout }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="
          flex items-center gap-2
          text-white font-medium
          px-3 py-2 rounded-xl
          hover:bg-white/10 transition
        "
      >
        <FaUserCircle size={26} />
        <span className="hidden lg:block">{user?.name || "User"}</span>
        <FaAngleDown
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-3 w-48
              bg-white rounded-xl
              shadow-[0_20px_40px_rgba(0,0,0,0.2)]
              overflow-hidden z-50
            "
          >
            <Link
              href="/profile"
              className="block px-5 py-3 text-gray-700 hover:bg-blue-600 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Profile
            </Link>

            <Link
              href="/dashboard"
              className="block px-5 py-3 text-gray-700 hover:bg-blue-600 hover:text-white"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>

            <button
              onClick={onLogout}
              className="
                w-full text-left px-5 py-3
                text-red-600 hover:bg-red-50
                font-medium
              "
            >
              Logout
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

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

const DesktopDropdown = ({ type, label, active, onToggle, items }) => {
  const getHref = (item) => {
    const slug = item.toLowerCase().replace(/\s+/g, "-");
    const isAllItem = item.toLowerCase().includes("all");
    switch (type) {
      case "countries":
        return isAllItem ? "/all-countries" : `/all-countries/${slug}`;
      case "courses":
        return isAllItem ? "/courses" : `/courses/${COURSE_CATEGORY_MAP[item]}`;
      case "programs":
        return `/programs/${slug}`;
      default:
        return `/${slug}`;
    }
  };

  return (
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
              href={getHref(item)}
              onClick={onToggle}
              className="block px-5 py-3 mx-2 rounded-lg text-gray-700 hover:bg-blue-600 hover:text-white"
            >
              {item}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
};

// ────────────────────────────────────────────────────────────────────────
// IMPROVED MODERN MOBILE MENU (with the 3 requested upgrades)
// ────────────────────────────────────────────────────────────────────────

const MobileMenu = ({ open, onClose, isLoggedIn, handleLogout, user }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[1999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-y-0 right-0 w-[85%] max-w-[380px] bg-gradient-to-b from-[#0f2a5f] to-[#091d42] shadow-2xl z-[2000] overflow-y-auto"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 22, stiffness: 160 }}
          >
            {/* Sticky Header with logo */}
            <div className="sticky top-0 z-10 bg-[#0f2a5f]/95 backdrop-blur-lg border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="StudyAbroad Logo"
                  className="w-10 h-10 rounded-full ring-2 ring-white/20"
                />
                <span className="text-white font-semibold text-lg">
                  StudyAbroad
                </span>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/90"
                aria-label="Close menu"
              >
                <FaTimes size={22} />
              </button>
            </div>

            {/* Navigation */}
            <nav className="px-6 pt-8 pb-10 flex flex-col gap-5 text-white">
              <MobileNavItem label="Home" link="/" onClose={onClose} />

              <MobileDropdown
                label="Countries"
                isOpen={activeDropdown === "countries"}
                onToggle={() => toggleDropdown("countries")}
                items={[
                  "USA",
                  "UK",
                  "Canada",
                  "Australia",
                  "Germany",
                  "China",
                  "All Countries",
                ]}
                getHref={(item) =>
                  item.includes("All")
                    ? "/all-countries"
                    : `/all-countries/${toSlug(item)}`
                }
                onClose={onClose}
              />

              <MobileDropdown
                label="Courses"
                isOpen={activeDropdown === "courses"}
                onToggle={() => toggleDropdown("courses")}
                items={[
                  "Engineering & Technology",
                  "Business & Management",
                  "Medicine & Healthcare",
                  "Computer Science & IT",
                  "All Courses",
                ]}
                getHref={(item) =>
                  item.includes("All")
                    ? "/courses"
                    : `/courses/${COURSE_CATEGORY_MAP[item] || "other"}`
                }
                onClose={onClose}
              />

              <MobileDropdown
                label="Programs"
                isOpen={activeDropdown === "programs"}
                onToggle={() => toggleDropdown("programs")}
                items={["Scholarships", "Universities", "Visa Guidance"]}
                getHref={(item) =>
                  `/programs/${item.toLowerCase().replace(/\s+/g, "-")}`
                }
                onClose={onClose}
              />

              <MobileNavItem label="Why Us" link="/why-us" onClose={onClose} />
              <MobileNavItem
                label="Success Stories"
                link="/success-stories"
                onClose={onClose}
              />
              <MobileNavItem
                label="Contact"
                link="/contact"
                onClose={onClose}
              />
            </nav>

            {/* Prominent CTA Section */}
            <div className="px-6 pb-12 pt-4 border-t border-white/10">
              <p className="text-center text-white/80 text-sm mb-6">
                Join 50,000+ students already succeeding
              </p>
              <div className="grid gap-4">
                {!isLoggedIn ? (
                  <>
                    <Link
                      href="/signup"
                      onClick={onClose}
                      className="bg-green-600 hover:bg-green-500 text-white font-semibold py-4 px-8 rounded-xl text-center shadow-xl shadow-green-900/30 transition-all text-lg transform hover:scale-[1.02] active:scale-95"
                    >
                      Join 50,000+ Students – Free
                    </Link>

                    <Link
                      href="/login"
                      onClick={onClose}
                      className="bg-orange-600/30 hover:bg-orange-600/40 border border-orange-500/40 text-orange-200 font-medium py-4 px-8 rounded-xl text-center transition-all"
                    >
                      Already have account? Login
                    </Link>
                  </>
                ) : (
                  <MobileUserCard
                    user={user}
                    onClose={onClose}
                    onLogout={() => {
                      handleLogout();
                      onClose();
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// ─── Mobile Helper Components ───────────────────────────────────────────

const MobileUserCard = ({ user, onLogout, onClose }) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-4">
      {/* User Info */}
      <div className="flex items-center gap-3">
        <FaUserCircle size={40} className="text-white/90" />
        <div>
          <p className="text-white font-semibold text-lg">
            {user?.name || "User"}
          </p>
          <p className="text-white/60 text-sm">
            {user?.email || "Welcome back"}
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="grid gap-2">
        <Link
          href="/profile"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white"
        >
          <FaUser />
          Profile
        </Link>

        <Link
          href="/dashboard"
          onClick={onClose}
          className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/10 transition text-white"
        >
          <FaUser />
          Dashboard
        </Link>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl
          text-red-400 hover:bg-red-500/10 transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </div>
  );
};

const MobileNavItem = ({ label, link, onClose }) => (
  <Link
    href={link}
    onClick={onClose}
    className="block py-4 px-5 text-lg font-medium rounded-xl hover:bg-white/10 active:bg-white/15 transition-colors"
  >
    {label}
  </Link>
);

const MobileDropdown = ({
  label,
  items,
  isOpen,
  onToggle,
  getHref,
  onClose,
}) => (
  <div className="rounded-xl overflow-hidden bg-white/5 border border-white/10">
    <button
      onClick={onToggle}
      className={`
        w-full flex justify-between items-center py-4 px-5 text-lg font-medium
        hover:bg-white/8 transition-colors
        ${isOpen ? "bg-white/10" : ""}
      `}
    >
      <span>{label}</span>
      <FaAngleDown
        className={`transition-transform duration-300 ${
          isOpen ? "rotate-180" : ""
        }`}
      />
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.28 }}
        >
          <div className="py-3 px-3 bg-black/20 flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item}
                href={getHref(item)}
                onClick={() => {
                  onToggle();
                  onClose();
                }}
                className="block px-5 py-3 rounded-lg hover:bg-white/10 active:bg-white/15 transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// Reuse your existing desktop buttons (optional - you can style them too if you want)
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
