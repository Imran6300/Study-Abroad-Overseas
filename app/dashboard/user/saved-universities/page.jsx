"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Trash2, ExternalLink, Loader2 } from "lucide-react";

export default function SavedUniversitiesPage() {
  const router = useRouter();

  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);

  const fetchShortlist = async () => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/shortlist`,
        {
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        setUniversities(data.shortlist);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShortlist();
  }, []);

  const handleRemove = async (id) => {
    try {
      setRemovingId(id);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/university/shortlist/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (res.ok) {
        setUniversities((prev) => prev.filter((u) => u._id !== id));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[300px] text-white">
        <Loader2 className="animate-spin mr-2" />
        Loading shortlisted universities...
      </div>
    );
  }

  return (
    <div className="space-y-10 pt-16 sm:pt-5">
      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-white/6 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex items-center justify-between"
        >
          <div>
            <h3 className="text-gray-400 text-sm">Saved Universities</h3>
            <p className="text-3xl font-bold text-white mt-1">
              {universities.length}
            </p>
          </div>

          <Heart className="text-pink-400" size={26} />
        </motion.div>
      </div>

      {/* UNIVERSITY LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {universities.length === 0 && (
          <div className="text-gray-400 space-y-3">
            <p>You haven't shortlisted any universities yet.</p>

            <a
              href="https://www.khizaroverseas.in/services/university-shortlisting"
              className="
        inline-flex items-center gap-2
        text-emerald-400 hover:text-emerald-300
        font-medium transition-colors duration-200
      "
            >
              Shortlist Universities →
            </a>
          </div>
        )}

        <AnimatePresence>
          {universities.map((uni) => (
            <motion.div
              key={uni._id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
              className="
        bg-white/6
        backdrop-blur-xl
        border border-white/10
        rounded-2xl
        p-6
        space-y-4
      "
            >
              {/* LOGO + TITLE */}
              <div className="flex items-center gap-4">
                <img
                  src={uni.logo}
                  alt={uni.university}
                  className="
            w-12 h-12
            rounded-lg
            object-contain
            bg-white
            p-1
          "
                />

                <div>
                  <h3 className="text-white font-semibold">{uni.university}</h3>

                  <p className="text-xs text-gray-400">
                    QS Ranking: {uni.qsRanking || "N/A"}
                  </p>

                  <p className="text-xs text-gray-500">
                    {uni.city}
                    {uni.country ? `, ${uni.country}` : ""}
                  </p>
                </div>
              </div>

              {/* INFO */}
              <div className="text-sm text-gray-300 space-y-2">
                <p>💰 Tuition: {uni.tuitionFee || "Not Available"}</p>

                <div>
                  🎓 Degrees:
                  <div className="flex flex-wrap gap-2 mt-1">
                    {uni.programs?.length ? (
                      uni.programs.slice(0, 3).map((program, index) => (
                        <span
                          key={index}
                          className="
                      bg-white/10
                      px-2 py-1
                      rounded
                      text-xs
                    "
                        >
                          {typeof program === "string"
                            ? program
                            : program?.name || "Program"}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 text-xs">
                        No programs available
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() =>
                    router.push(`/programs/universities/${uni.slug}`)
                  }
                  className="
            flex-1
            bg-[#4169E1]
            hover:bg-[#365ad3]
            text-white
            text-sm
            py-2
            rounded-lg
            flex items-center justify-center gap-2
          "
                >
                  <ExternalLink size={16} />
                  View
                </button>

                <button
                  disabled={removingId === uni._id}
                  onClick={() => handleRemove(uni._id)}
                  className="
            flex-1
            bg-red-500/20
            hover:bg-red-500/30
            text-red-400
            text-sm
            py-2
            rounded-lg
            flex items-center justify-center gap-2
            disabled:opacity-50
          "
                >
                  {removingId === uni._id ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Removing...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} />
                      Remove
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
