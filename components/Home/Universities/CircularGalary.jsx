// CircularGalary.jsx
"use client";
import React, { useState, useRef, useEffect } from "react";
import Card from "./Card";

export default function CircularGallery({
  items,
  cardWidth = 400,
  gap = 30,
  autoSpeed = 1,
  scrollEase = 0.8,
}) {
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const offsetRef = useRef(0);

  const [, triggerRerender] = useState(false);

  const [responsiveCardWidth, setResponsiveCardWidth] = useState(cardWidth);

  // Make cardWidth responsive based on viewport (Tailwind breakpoints)
  useEffect(() => {
    const updateCardWidth = () => {
      if (window.innerWidth < 640) {
        // sm
        setResponsiveCardWidth(280);
      } else if (window.innerWidth < 768) {
        // md
        setResponsiveCardWidth(320);
      } else if (window.innerWidth < 1024) {
        // lg
        setResponsiveCardWidth(360);
      } else {
        setResponsiveCardWidth(cardWidth);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, [cardWidth]);

  const itemCount = items.length;
  const galleryWidth = itemCount * (responsiveCardWidth + gap);

  /** UPDATE POSITIONS */
  const updatePositions = () => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll(".gallery-card");

    cards.forEach((card, i) => {
      let baseX = i * (responsiveCardWidth + gap);
      let x = baseX - offsetRef.current;

      if (x < -responsiveCardWidth) x += galleryWidth;
      if (x > galleryWidth - responsiveCardWidth) x -= galleryWidth;

      card.style.transform = `translateX(${x}px) translateY(0%)`;
    });
  };

  /** ANIMATION LOOP */
  useEffect(() => {
    let lastTime = performance.now();

    const animate = (now) => {
      const delta = now - lastTime;
      lastTime = now;

      if (!isDragging.current) {
        if (Math.abs(velocity.current) > 0.1) {
          offsetRef.current += velocity.current * scrollEase;
          velocity.current *= 0.95;
        } else {
          offsetRef.current += autoSpeed;
        }
      }

      if (offsetRef.current >= galleryWidth) offsetRef.current -= galleryWidth;
      if (offsetRef.current < 0) offsetRef.current += galleryWidth;

      updatePositions();
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
    triggerRerender(true);
  }, [autoSpeed, galleryWidth, scrollEase, responsiveCardWidth]);

  /** WHEEL SCROLL */
  const wheelVelocity = useRef(0);
  const wheelAnimating = useRef(false);

  const wheelAnimate = () => {
    if (!wheelAnimating.current) return;

    offsetRef.current += wheelVelocity.current * scrollEase;
    wheelVelocity.current *= 0.93;

    updatePositions();

    if (Math.abs(wheelVelocity.current) < 0.001) {
      wheelAnimating.current = false;
      return;
    }

    requestAnimationFrame(wheelAnimate);
  };

  const onWheel = (e) => {
    e.preventDefault(); // Prevent page scroll on wheel
    wheelVelocity.current += e.deltaY * 0.02;

    if (!wheelAnimating.current) {
      wheelAnimating.current = true;
      requestAnimationFrame(wheelAnimate);
    }
  };

  /** DRAGGING */
  const onPointerDown = (e) => {
    // ✅ DO NOT start drag if clicking link or button
    if (e.target.closest("a, button")) return;

    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartOffset.current = offsetRef.current;
    lastX.current = e.clientX;
    velocity.current = 0;

    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;

    const delta = dragStartX.current - e.clientX;
    offsetRef.current = dragStartOffset.current + delta;

    if (offsetRef.current >= galleryWidth) offsetRef.current -= galleryWidth;
    if (offsetRef.current < 0) offsetRef.current += galleryWidth;

    velocity.current = lastX.current - e.clientX;
    lastX.current = e.clientX;

    updatePositions();
  };

  const onPointerUp = () => {
    isDragging.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  return (
    <div
      ref={containerRef}
      className="
        relative w-full h-[400px] sm:h-[460px] md:h-[500px] lg:h-[600px]
 overflow-hidden select-none
        flex items-center justify-center
        will-change-transform translate-z-0
        cursor-grab
      "
      onWheel={onWheel}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerUp}
    >
      {items.map((item, i) => (
        <div
          key={i}
          className="
            gallery-card
            absolute left-0
            user-select-none
            [backface-visibility:hidden]
            [perspective:1000px]
            [transform-style:preserve-3d]
            
          "
          style={{
            width: `${responsiveCardWidth}px`,
            transition: isDragging.current ? "none" : "scale 0.2s ease-out",
            scale: isDragging.current ? 1.05 : 1,
            pointerEvents: isDragging.current ? "none" : "auto",
          }}
        >
          <Card {...item} />
        </div>
      ))}
    </div>
  );
}
