// app/blog/page.tsx
import Link from "next/link";
import {
  FaCalendarAlt,
  FaUser,
  FaClock,
  FaArrowRight,
  FaBookOpen,
  FaEnvelope,
  FaGlobeAsia,
} from "react-icons/fa";

export default function Blog() {
  // Sample data — later fetch from DB / MDX / API
  const featuredPost = {
    id: 1,
    title: "Top 10 Universities in Canada for International Students in 2025",
    excerpt:
      "High acceptance rates, generous scholarships, and excellent post-study work options — discover why Canada remains a top choice for Indian students.",
    date: "January 10, 2025",
    author: "Khizar Team",
    readTime: "8 min read",
    image: "/blog/canada-universities.jpg",
    slug: "top-10-universities-canada-2025",
    category: "Country Guides",
  };

  const posts = [
    {
      id: 2,
      title: "How to Write a Winning Statement of Purpose (SOP) – 2025 Guide",
      excerpt:
        "Structure, powerful examples, common pitfalls & insider tips from admission officers.",
      date: "December 28, 2024",
      author: "Khizar Team",
      readTime: "12 min read",
      image: "/blog/sop-guide.jpg",
      slug: "sop-guide-2025",
      category: "Application Tips",
    },
    {
      id: 3,
      title: "Germany Free Education: 2025 Visa Rules & Blocked Account Update",
      excerpt:
        "Tuition-free universities, latest financial proof changes, APS certificate & more.",
      date: "November 15, 2024",
      author: "Visa Expert",
      readTime: "10 min read",
      image: "/blog/germany-visa.jpg",
      slug: "germany-free-education-visa-2025",
      category: "Visa Guidance",
    },
    // Add 2–3 more real posts when ready
  ];

  const categories = [
    "Country Guides",
    "Visa Guidance",
    "Application Tips",
    "Scholarships",
    "Success Stories",
    "Student Life",
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-[#0f2a5f] text-white overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0f2a5f] via-[#0f2a5f] to-[#091d42] opacity-90" />

        <div className="relative container mx-auto px-6 md:px-12 py-20 md:py-28 max-w-6xl">
          <div className="max-w-3xl">
            <span className="inline-block bg-orange-500 text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
              Study Abroad Insights
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Journey to Global Education Starts Here
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-10">
              Expert advice, real student stories, visa secrets & latest updates
              — all in one place.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="#latest"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-4 rounded-xl shadow-lg transition transform hover:scale-[1.03]"
              >
                Explore Latest Articles
              </Link>
              <Link
                href="/contact"
                className="bg-transparent border-2 border-white/40 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl transition"
              >
                Talk to an Expert
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-10 border-b bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl overflow-x-auto">
          <div className="flex gap-3 pb-2">
            {categories.map((cat) => (
              <button
                key={cat}
                className="px-5 py-2.5 bg-gray-100 hover:bg-[#0f2a5f] hover:text-white rounded-full text-sm font-medium whitespace-nowrap transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 md:px-12 py-16 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16" id="latest">
            {/* Featured Post */}
            <article className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 group">
              <div className="relative h-64 md:h-96 overflow-hidden">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <span className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-4">
                    {featuredPost.category}
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                    {featuredPost.title}
                  </h2>
                  <div className="flex items-center gap-6 text-white/90 text-sm">
                    <span className="flex items-center gap-2">
                      <FaCalendarAlt /> {featuredPost.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <FaClock /> {featuredPost.readTime}
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-10">
                <p className="text-gray-700 text-lg mb-6 line-clamp-3">
                  {featuredPost.excerpt}
                </p>
                <Link
                  href={`/blog/${featuredPost.slug}`}
                  className="inline-flex items-center gap-3 text-[#0f2a5f] font-semibold hover:text-orange-600 transition-colors text-lg"
                >
                  Read Full Article <FaArrowRight />
                </Link>
              </div>
            </article>

            {/* Regular Posts Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group flex flex-col"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <span className="absolute top-4 left-4 bg-[#0f2a5f] text-white text-xs font-bold px-3 py-1.5 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1.5">
                        <FaCalendarAlt className="text-orange-500" />{" "}
                        {post.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <FaClock className="text-orange-500" /> {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-[#0f2a5f] mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3 flex-grow">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500 flex items-center gap-1.5">
                        <FaUser className="text-orange-500" /> {post.author}
                      </span>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="text-orange-600 hover:text-orange-700 font-medium flex items-center gap-2"
                      >
                        Read <FaArrowRight className="text-sm" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-12">
              <button className="bg-[#0f2a5f] hover:bg-[#091d42] text-white font-semibold px-12 py-5 rounded-xl shadow-lg transition transform hover:scale-[1.03]">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-10 lg:sticky lg:top-24 lg:h-fit">
            {/* Newsletter */}
            <div className="bg-gradient-to-br from-[#0f2a5f] to-[#091d42] text-white rounded-2xl p-8 shadow-xl">
              <FaEnvelope className="text-4xl text-orange-400 mb-4" />
              <h4 className="text-2xl font-bold mb-3">Stay Updated</h4>
              <p className="text-white/80 mb-6">
                Get the latest visa rules, scholarships & success stories
                directly in your inbox.
              </p>
              <form className="space-y-3">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-5 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/60 focus:outline-none focus:border-orange-400"
                />
                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Subscribe Now
                </button>
              </form>
            </div>

            {/* Quick Links / Popular Countries */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              <h4 className="text-xl font-bold text-[#0f2a5f] mb-6 flex items-center gap-3">
                <FaGlobeAsia className="text-orange-500" /> Popular Destinations
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {["Canada", "Germany", "Australia", "UK", "USA", "Ireland"].map(
                  (country) => (
                    <Link
                      key={country}
                      href={`/all-countries/${country.toLowerCase()}`}
                      className="text-center py-3 bg-gray-50 hover:bg-orange-50 rounded-xl text-[#0f2a5f] font-medium hover:text-orange-600 transition"
                    >
                      {country}
                    </Link>
                  ),
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Final CTA */}
      <section className="bg-gradient-to-r from-[#0f2a5f] via-[#0a2550] to-[#091d42] text-white py-20">
        <div className="container mx-auto px-6 md:px-12 text-center max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Your Dream University is Waiting
          </h2>
          <p className="text-xl md:text-2xl mb-10 opacity-90 max-w-3xl mx-auto">
            Thousands of students have transformed their future with our
            guidance. Your turn starts now.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-12 py-6 rounded-xl shadow-2xl transition transform hover:scale-[1.05]"
          >
            <FaBookOpen className="text-2xl" /> Book Free Consultation Today
          </Link>
        </div>
      </section>
    </div>
  );
}
