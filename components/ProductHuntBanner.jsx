"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function ProductHuntBanner() {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    // Don't show if user already dismissed it this session
    const dismissed = sessionStorage.getItem("ph_banner_dismissed");
    if (!dismissed) {
      // Slight delay so it slides in after page load
      const t = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    setClosing(true);
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem("ph_banner_dismissed", "1");
    }, 350);
  };

  if (!visible) return null;

  return (
    <>
      <style>{`
        @keyframes ph-slide-down {
          from { transform: translateY(-110%); opacity: 0; }
          to   { transform: translateY(0);     opacity: 1; }
        }
        @keyframes ph-slide-up {
          from { transform: translateY(0);     opacity: 1; }
          to   { transform: translateY(-110%); opacity: 0; }
        }
        @keyframes ph-pulse-dot {
          0%, 100% { opacity: 1;   transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.4); }
        }
        @keyframes ph-shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }

        .ph-banner {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          animation: ph-slide-down 0.45s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .ph-banner.closing {
          animation: ph-slide-up 0.35s cubic-bezier(0.55, 0, 0.45, 1) forwards;
        }

        .ph-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 14px;
          padding: 10px 20px;
          background: #0B0F1A;
          border-bottom: 1px solid rgba(34, 211, 238, 0.18);
          position: relative;
          overflow: hidden;
        }

        /* Top cyan hairline glow */
        .ph-inner::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, #22d3ee, #38bdf8, #22d3ee, transparent);
          background-size: 200% auto;
          animation: ph-shimmer 3s linear infinite;
        }

        /* Subtle radial glow behind content */
        .ph-inner::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse 60% 120% at 50% 50%, rgba(34,211,238,0.06) 0%, transparent 70%);
          pointer-events: none;
        }

        .ph-live-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #f97316;
          flex-shrink: 0;
          animation: ph-pulse-dot 1.4s ease-in-out infinite;
        }

        .ph-label {
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          font-size: 13px;
          font-weight: 500;
          color: rgba(255,255,255,0.72);
          white-space: nowrap;
          letter-spacing: 0.01em;
        }

        .ph-label strong {
          color: #ffffff;
          font-weight: 700;
        }

        .ph-badge-wrap {
          display: flex;
          align-items: center;
          transition: transform 0.2s ease, filter 0.2s ease;
          flex-shrink: 0;
        }
        .ph-badge-wrap:hover {
          transform: translateY(-1px) scale(1.03);
          filter: brightness(1.08);
        }
        .ph-badge-wrap:active {
          transform: scale(0.97);
        }

        .ph-divider {
          width: 1px;
          height: 20px;
          background: rgba(255,255,255,0.12);
          flex-shrink: 0;
        }

        .ph-support-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 14px;
          border-radius: 20px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.3);
          color: #22d3ee;
          font-family: -apple-system, BlinkMacSystemFont, 'Inter', 'Segoe UI', sans-serif;
          font-size: 12px;
          font-weight: 600;
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: background 0.2s, border-color 0.2s, transform 0.2s;
          white-space: nowrap;
          cursor: pointer;
        }
        .ph-support-btn:hover {
          background: rgba(34, 211, 238, 0.18);
          border-color: rgba(34, 211, 238, 0.55);
          transform: translateY(-1px);
        }
        .ph-support-btn:active {
          transform: translateY(0) scale(0.97);
        }

        /* Orange upvote arrow icon */
        .ph-arrow {
          font-size: 14px;
          line-height: 1;
        }

        .ph-close {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.2s, background 0.2s;
          z-index: 1;
        }
        .ph-close:hover {
          color: rgba(255,255,255,0.8);
          background: rgba(255,255,255,0.08);
        }

        /* Hide the support button text on very small screens */
        @media (max-width: 480px) {
          .ph-label { display: none; }
          .ph-divider { display: none; }
        }
        @media (max-width: 360px) {
          .ph-support-btn span { display: none; }
          .ph-support-btn { padding: 5px 10px; }
        }
      `}</style>

      <div
        className={`ph-banner${closing ? " closing" : ""}`}
        role="banner"
        aria-label="Product Hunt Launch"
      >
        <div className="ph-inner">
          {/* Live dot */}
          <div className="ph-live-dot" title="Live on Product Hunt today!" />

          {/* Label */}
          <span className="ph-label">
            <strong>Khizar Overseas</strong> is live on Product Hunt today!
          </span>

          <div className="ph-divider" />

          {/* Official PH badge */}
          <a
            href="https://www.producthunt.com/products/khizar-overseas?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-khizar-overseas"
            target="_blank"
            rel="noopener noreferrer"
            className="ph-badge-wrap"
            aria-label="View Khizar Overseas on Product Hunt"
          >
            <img
              alt="Khizar Overseas - The CRM platform built for study abroad consultants in India | Product Hunt"
              width="200"
              height="44"
              src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1180785&theme=neutral&t=1782562773607"
              style={{ display: "block" }}
            />
          </a>

          <div className="ph-divider" />

          {/* Upvote CTA */}
          <a
            href="https://www.producthunt.com/products/khizar-overseas?utm_source=site_banner&utm_medium=banner&utm_campaign=launch_day"
            target="_blank"
            rel="noopener noreferrer"
            className="ph-support-btn"
          >
            <span className="ph-arrow">▲</span>
            <span>Support us</span>
          </a>

          {/* Dismiss */}
          <button
            className="ph-close"
            onClick={dismiss}
            aria-label="Dismiss banner"
          >
            <X size={14} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </>
  );
}
