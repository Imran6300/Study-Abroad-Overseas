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
    const text = normalize(`${c.name} ${c.region || ""} ${c.desc || ""}`);
    return text.includes(q);
  });
};

/* ================= COURSES ================= */
export const buildCourseIndex = ({ popularCourses = [], categoryData }) => {
  const set = new Set();

  popularCourses.forEach((c) => {
    if (c) set.add(c);
  });

  Object.values(categoryData || {}).forEach((cat) => {
    Object.values(cat.tabs || {}).forEach((level) => {
      (level || []).forEach((item) => {
        if (item?.name) {
          set.add(item.name);
        }
      });
    });
  });

  return [...set];
};

export const matchCourse = (query, courseIndex) => {
  const q = normalize(query);

  return courseIndex.find((courseName) => {
    if (typeof courseName !== "string") return false;
    return normalize(courseName).includes(q);
  });
};

export { normalize };
