export const categoryData = {
  engineering: {
    title: "Engineering & Technology",
    subtitle: "Innovate the future with world-class tech programs",
    heroImage:
      "https://www.ciee.org/sites/default/files/styles/530x324/public/images/2024-05/study-abroad-engineering-student-group.jpg?h=3f4d8c7e&itok=p0tTilNW",
    gradient: "from-indigo-600 to-blue-700",
    tabs: {
      bachelor: [
        {
          name: "Computer Science",
          unis: "MIT, Stanford, ETH Zurich",
          duration: "4 years",
          fee: "$45K–$65K/year",
          slug: "computer-science"
        },
        {
          name: "Mechanical Engineering",
          unis: "Imperial College, UC Berkeley",
          duration: "4 years",
          fee: "$40K–$60K/year",
          slug: "mechanical-engineering"
        },
        {
          name: "Electrical Engineering",
          unis: "Caltech, Cambridge",
          duration: "4 years",
          fee: "$50K–$70K/year",
          slug: "electrical-engineering"
        },
      ],
      master: [
        {
          name: "Data Science & AI",
          unis: "Carnegie Mellon, Oxford, Toronto",
          duration: "1–2 years",
          fee: "$35K–$75K/year",
          popular: true,
          slug: "msc-data-science-ai"
        },
        {
          name: "Cybersecurity",
          slug: "msc-cybersecurity",  // kept your existing one
          unis: "Georgia Tech, NYU, Sydney",
          duration: "1–2 years",
          fee: "$30K–$55K/year",
          popular: true
        },
        {
          name: "Software Engineering",
          unis: "Waterloo, TU Munich",
          duration: "1.5 years",
          fee: "$25K–$50K/year",
          slug: "msc-software-engineering"
        },
      ],
      phd: [
        {
          name: "Artificial Intelligence",
          unis: "Stanford, MIT, DeepMind partners",
          funding: "Fully funded + stipend",
          slug: "phd-artificial-intelligence"
        },
        {
          name: "Robotics",
          unis: "CMU, EPFL Switzerland",
          funding: "Research assistantships",
          slug: "phd-robotics"
        },
      ],
    },
  },

  business: {
    title: "Business & Management",
    subtitle: "Lead tomorrow's global enterprises",
    heroImage:
      "https://www.chicagobooth.edu/-/media/project/chicago-booth/mba/academic-experience/the-classroom-experience/chicago-booth-classroom.jpg?cx=0.6&cy=0.33&cw=940&ch=749&hash=974E0B9E5ECFA2783B220A35204F8C70",
    gradient: "from-amber-600 to-orange-700",
    tabs: {
      bachelor: [
        {
          name: "Business Administration",
          unis: "Wharton, LSE, Singapore",
          duration: "3–4 years",
          fee: "$50K–$70K/year",
          slug: "business-administration"
        },
        {
          name: "International Business",
          unis: "NYU Stern, Bocconi",
          duration: "4 years",
          fee: "$55K–$75K/year",
          slug: "international-business"
        },
      ],
      master: [
        {
          name: "MBA",
          unis: "Harvard, INSEAD, London Business School",
          duration: "1–2 years",
          fee: "$80K–$150K total",
          popular: true,
          slug: "mba"  // special short slug for MBA (very common)
        },
        {
          name: "Finance & FinTech",
          unis: "Columbia, Chicago Booth",
          duration: "1 year",
          fee: "$70K–$100K/year",
          popular: true,
          slug: "msc-finance-fintech"
        },
        {
          name: "Entrepreneurship",
          unis: "Babson, Stanford GSB",
          duration: "1 year",
          fee: "$60K–$90K/year",
          slug: "msc-entrepreneurship"
        },
      ],
    },
  },

  healthcare: {
    title: "Healthcare & Medicine",
    subtitle: "Transform lives with advanced medical education",
    heroImage:
      "https://cdn-clmkg.nitrocdn.com/jZJIONKWXmglJtuZWYfLRXrdMKSdTsmW/assets/images/optimized/rev-1adbbe8/www.eaglegatecollege.edu/wp-content/uploads/2023/07/shutterstock_1991555321-scaled-1.jpg",
    gradient: "from-emerald-600 to-teal-700",
    tabs: {
      bachelor: [
        {
          name: "Nursing (BSN)",
          unis: "Johns Hopkins, Melbourne, King's College",
          duration: "4 years",
          fee: "$40K–$60K/year",
          slug: "nursing-bsn"
        },
        {
          name: "Public Health",
          unis: "Harvard, Imperial, Toronto",
          duration: "4 years",
          fee: "$45K–$65K/year",
          slug: "public-health"
        },
      ],
      master: [
        {
          name: "Master of Public Health (MPH)",
          unis: "Johns Hopkins, LSHTM, Emory",
          duration: "1–2 years",
          fee: "$50K–$80K/year",
          popular: true,
          slug: "mph-public-health"
        },
        {
          name: "Healthcare Management (MHA)",
          unis: "Cornell, Michigan",
          duration: "2 years",
          fee: "$55K–$75K/year",
          popular: true,
          slug: "mha-healthcare-management"
        },
        {
          name: "Nursing (MSN)",
          unis: "Yale, Penn",
          duration: "2 years",
          fee: "$45K–$70K/year",
          slug: "msn-nursing"
        },
      ],
    },
  },
};