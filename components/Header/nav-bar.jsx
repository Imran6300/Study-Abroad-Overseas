"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { FaAngleDown, FaBars, FaTimes } from "react-icons/fa";

/* ============================================================
                    MAIN NAVBAR COMPONENT
============================================================ */
const NavBar = () => {
  const navRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide Navbar on Scroll
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      if (!navRef.current) return;

      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        navRef.current.style.transform = "translateY(-100px)";
      } else {
        navRef.current.style.transform = "translateY(0)";
      }

      lastScrollY = window.scrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className="
        fixed top-0 left-0 w-full h-[85px] z-[1000]
        bg-[linear-gradient(135deg,#4169e1_0%,#1e3a8a_100%)]
        shadow-[0_4px_15px_rgba(0,0,0,0.15)]
        flex items-center justify-between
        px-6 md:px-10 transition-all duration-300
      "
    >
      {/* LOGO */}
      <Link href="/" className="flex items-center">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-[55px] h-[55px] object-cover"
        />
      </Link>

      {/* DESKTOP NAV */}
      <DesktopNav />

      {/* DESKTOP BUTTONS */}
      <div className="hidden md:flex items-center gap-4">
        <ButtonGreen text="Sign-up" link="/signup" />
        <ButtonOrange text="Login" link="/login" />
      </div>

      {/* MOBILE BURGER */}
      <button
        className="md:hidden text-white text-3xl"
        onClick={() => setMobileOpen(true)}
      >
        <FaBars />
      </button>

      {/* MOBILE MENU */}
      <MobileMenu open={mobileOpen} setOpen={setMobileOpen} />
    </header>
  );
};

export default NavBar;

/* ============================================================
                    DESKTOP NAVIGATION
============================================================ */

const DesktopNav = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (menu) =>
    setActiveDropdown(activeDropdown === menu ? null : menu);

  return (
    <ul className="hidden md:flex items-center gap-7 cursor-pointer">
      <NavItem label="Home" link="/" />

      <DesktopDropdown
        label="Countries"
        active={activeDropdown === "Countries"}
        onToggle={() => toggleDropdown("Countries")}
        items={[
          "USA",
          "UK",
          "Canada",
          "Australia",
          "Germany",
          "New Zealand",
          "Other Countries",
        ]}
      />

      <DesktopDropdown
        label="Courses"
        active={activeDropdown === "Courses"}
        onToggle={() => toggleDropdown("Courses")}
        items={[
          "Engineering & Technology",
          "Business & Management",
          "Medicine & Healthcare",
          "Arts & Humanities",
          "Computer Science & IT",
          "Law",
          "Hospitality & Tourism",
        ]}
      />

      <DesktopDropdown
        label="Programs"
        active={activeDropdown === "Programs"}
        onToggle={() => toggleDropdown("Programs")}
        items={["Scholarships", "Universities"]}
      />

      <NavItem label="Contact Us" link="/contact" />
    </ul>
  );
};

const NavItem = ({ label, link }) => (
  <Link
    href={link}
    className="
      text-white font-semibold px-3 py-2 rounded-lg 
      transition-all hover:bg-orange-500 hover:shadow-md hover:-translate-y-[2px]
    "
  >
    {label}
  </Link>
);

const DesktopDropdown = ({ label, active, onToggle, items }) => (
  <li className="relative">
    <button
      onClick={onToggle}
      className="
        flex items-center gap-2 px-3 py-2 rounded-lg text-white font-semibold 
        transition-all hover:bg-orange-500 hover:-translate-y-[2px]
      "
    >
      {label}
      <FaAngleDown
        className={`transition-transform duration-200 ${
          active ? "rotate-180" : ""
        }`}
      />
    </button>

    <ul
      className={`
        absolute top-full left-0 min-w-[220px] bg-white rounded-xl shadow-xl
        py-2 z-[999] transition-all duration-200 overflow-hidden
        ${active ? "opacity-100 visible" : "opacity-0 invisible"}
      `}
    >
      {items.map((item, i) => (
        <span
          key={i}
          className="
            block px-4 py-3 text-gray-700 font-medium 
            hover:bg-blue-600 hover:text-white transition-all cursor-pointer
          "
        >
          {item}
        </span>
      ))}
    </ul>
  </li>
);

/* ============================================================
                    MOBILE MENU (SOLID BLUE)
============================================================ */

const MobileMenu = ({ open, setOpen }) => (
  <div
    className={`
      fixed top-0 right-0 h-full w-[78%]
      bg-[#1e3a8a]
      shadow-2xl p-6 z-[2000]
      transform transition-all duration-300
      ${open ? "translate-x-0" : "translate-x-full"}
    `}
  >
    {/* CLOSE BUTTON */}
    <button
      className="text-white text-3xl absolute top-5 right-5"
      onClick={() => setOpen(false)}
    >
      <FaTimes />
    </button>

    {/* LINKS */}
    <div className="mt-16 flex flex-col gap-6 text-white font-medium">
      <MobileNavItem label="Home" link="/" />

      <MobileDropdown
        label="Countries"
        items={[
          "USA",
          "UK",
          "Canada",
          "Australia",
          "Germany",
          "New Zealand",
          "Other Countries",
        ]}
      />

      <MobileDropdown
        label="Courses"
        items={[
          "Engineering & Technology",
          "Business & Management",
          "Medicine & Healthcare",
          "Arts & Humanities",
          "Computer Science & IT",
          "Law",
          "Hospitality & Tourism",
        ]}
      />

      <MobileDropdown
        label="Programs"
        items={["Scholarships", "Universities"]}
      />

      <MobileNavItem label="Contact Us" link="/contact" />
    </div>

    {/* BUTTONS */}
    <div className="mt-10 flex flex-col gap-4">
      <ButtonGreen text="Sign-up" link="/signup" full />
      <ButtonOrange text="Login" link="/login" full />
    </div>
  </div>
);

const MobileNavItem = ({ label, link }) => (
  <Link
    href={link}
    className="text-white text-lg border-b border-white/10 pb-2"
  >
    {label}
  </Link>
);

const MobileDropdown = ({ label, items }) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center text-white text-lg border-b border-white/10 pb-2 w-full"
      >
        {label}
        <FaAngleDown
          className={`${open ? "rotate-180" : ""} transition duration-300`}
        />
      </button>

      <div
        className={`
          mt-3 overflow-hidden transition-all duration-300
          ${open ? "max-h-64" : "max-h-0"}
        `}
      >
        <div className="flex flex-col gap-2">
          {items.map((item, i) => (
            <span
              key={i}
              className="
                text-white text-[15px] px-4 py-3 
                rounded-xl bg-[#243b77]
                border border-white/10
                hover:bg-[#3355aa]
                transition-all duration-200 cursor-pointer ml-2
              "
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ============================================================
                          BUTTONS
============================================================ */

const ButtonGreen = ({ text, link, full }) => (
  <Link
    href={link}
    className={`
      bg-green-500 text-white font-semibold px-5 py-2 rounded-lg 
      shadow-md hover:shadow-lg hover:-translate-y-[2px] transition 
      text-center ${full ? "w-full" : ""}
    `}
  >
    {text}
  </Link>
);

const ButtonOrange = ({ text, link, full }) => (
  <Link
    href={link}
    className={`
      bg-orange-500 text-white font-semibold px-5 py-2 rounded-lg 
      shadow-md hover:shadow-lg hover:-translate-y-[2px] transition 
      text-center ${full ? "w-full" : ""}
    `}
  >
    {text}
  </Link>
);
