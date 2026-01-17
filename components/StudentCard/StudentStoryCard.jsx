"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export default function StudentStoryCard({ story, delay = 0 }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay }}
      className="relative h-[420px] perspective"
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full h-full preserve-3d"
      >
        {/* FRONT */}
        <div className="absolute inset-0 backface-hidden rounded-2xl bg-white/5 border border-white/10 p-6 flex flex-col">
          <img
            src={story.image}
            alt={story.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-indigo-500 mb-4"
          />

          <h3 className="text-xl font-semibold">{story.name}</h3>
          <p className="text-sm text-gray-400 mb-4">{story.course}</p>

          <div className="space-y-2 text-sm text-gray-300">
            <p>
              <strong>University:</strong> {story.university}
            </p>
            <p>
              <strong>Country:</strong> {story.country}
            </p>
            <p>
              <strong>Visa:</strong> {story.visa}
            </p>
            <p>
              <strong>Scholarship:</strong> {story.scholarship}
            </p>
          </div>

          <button
            onClick={() => setFlipped(true)}
            className="mt-auto text-indigo-400 font-medium hover:underline"
          >
            Read Full Story →
          </button>
        </div>

        {/* BACK */}
        <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-2xl bg-[#0B0F19] border border-indigo-500/40 p-6 flex flex-col">
          <h3 className="text-xl font-semibold mb-4">
            {story.name}'s Experience
          </h3>

          <p className="text-gray-300 text-sm leading-relaxed">
            “{story.review}”
          </p>

          <button
            onClick={() => setFlipped(false)}
            className="mt-auto text-indigo-400 font-medium hover:underline"
          >
            ← Back
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
