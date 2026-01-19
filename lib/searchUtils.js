// lib/searchUtils.js

const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/* ================= COUNTRY ================= */
export const matchCountry = (query, COUNTRIES) => {
  const q = normalize(query);

  return COUNTRIES.find((c) => {
    const text = normalize(
      `${c.name} ${c.region} ${c.desc}`
    );
    return text.includes(q);
  });
};

/* ================= COURSES ================= */
export const buildCourseIndex = ({
  coursesData,
  popularCourses,
  categoryData,
}) => {
  const set = new Set();

  coursesData.forEach((c) => set.add(c.title));
  popularCourses.forEach((c) => set.add(c));

  Object.values(categoryData).forEach((cat) => {
    Object.values(cat.tabs).forEach((level) => {
      level.forEach((item) => set.add(item.name));
    });
  });

  return [...set];
};

export const matchCourse = (query, courseIndex) => {
  const q = normalize(query);

  return courseIndex.find((course) => {
    if (!course?.title) return false;

    const text = normalize(
      `${course.title} ${course.category} ${course.desc || ""}`
    );

    return text.includes(q);
  });
};

/* ================= UNIVERSITY ================= */
export const matchUniversity = (
  query,
  universityItems = [],
  universitiesByCategory = null
) => {
  const q = normalize(query);

  let allUniversities = [...universityItems];

  if (universitiesByCategory) {
    const extra = flattenUniversitiesByCategory(universitiesByCategory);
    allUniversities = [...allUniversities, ...extra];
  }

  return allUniversities.find((u) => {
    const text = normalize(
      `${u.name} ${u.country || ""} ${u.slug || ""}`
    );
    return text.includes(q);
  });
};


export const flattenUniversitiesByCategory = (universitiesByCategory) => {
  const list = [];

  Object.values(universitiesByCategory).forEach((category) => {
    Object.values(category).forEach((level) => {
      level.forEach((uni) => {
        list.push({
          name: uni.name,
          slug: uni.slug,
          country: uni.country,
          countrySlug: uni.countrySlug,
        });
      });
    });
  });

  return list;
};
