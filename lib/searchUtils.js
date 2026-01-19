// lib/searchUtils.js

export const normalize = (str = "") =>
  str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
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

  return courseIndex.find((course) =>
    normalize(course).includes(q)
  );
};

/* ================= UNIVERSITY ================= */
export const matchUniversity = (query, universityItems) => {
  const q = normalize(query);

  return universityItems.find((u) => {
    const text = normalize(
      `${u.name} ${u.country} ${u.location} ${u.slug}`
    );
    return text.includes(q);
  });
};
