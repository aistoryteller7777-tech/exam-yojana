export type Category =
  | "Latest Jobs"
  | "Admit Card"
  | "Results"
  | "Admission"
  | "Answer Key"
  | "Scholarship";

export type LinkItem = {
  id: number;

  title: string;
  category: Category;
  state: string;
  date: string;

  description: string;

  organization?: string;
  postName?: string;
  totalVacancy?: string;

  applicationStart?: string;
  applicationLastDate?: string;
  examDate?: string;

  fee?: string;
  ageLimit?: string;
  qualification?: string;
  eligibility?: string;

  documents?: string[];

  howToApply?: string[];

  vacancyDetails?: {
    post: string;
    vacancy: string;
  }[];

  officialUrl?: string;

  links?: {
    label: string;
    url: string;
  }[];
};

/* =========================================================
   EXAM YOJANA
   DEFAULT WEBSITE DATA
   ========================================================= */

export const data: LinkItem[] = [
  /* =======================================================
     1. LATEST JOBS
     ======================================================= */

  {
    id: 1,

    title: "SSC CGL Recruitment 2026",

    category: "Latest Jobs",

    state: "All India",

    date: "09 Aug 2026",

    description:
      "SSC CGL भर्ती से संबंधित महत्वपूर्ण जानकारी, योग्यता, आयु सीमा, आवेदन प्रक्रिया और जरूरी official links यहाँ देखें।",

    organization: "Staff Selection Commission",

    postName: "Combined Graduate Level",

    totalVacancy: "Official Notification के अनुसार",

    applicationStart: "Coming Soon",

    applicationLastDate: "Coming Soon",

    examDate: "To Be Announced",

    fee: "Official Notification देखें",

    ageLimit: "Official Notification के अनुसार",

    qualification: "Graduation / संबंधित योग्यता",

    eligibility: "Official notification में दी गई eligibility लागू होगी।",

    documents: [
      "Aadhaar Card / पहचान पत्र",
      "Educational Qualification Certificate",
      "Passport Size Photograph",
      "Signature",
      "Valid Mobile Number",
      "Valid Email ID",
    ],

    howToApply: [
      "SSC की official website खोलें।",
      "SSC CGL Recruitment section पर जाएँ।",
      "Official notification ध्यान से पढ़ें।",
      "Apply Online पर क्लिक करें।",
      "Registration पूरा करें।",
      "Application Form में सही जानकारी भरें।",
      "Documents upload करें।",
      "Application Fee लागू होने पर जमा करें।",
      "Final form submit करके print/save रखें।",
    ],

    vacancyDetails: [
      {
        post: "Various Posts",
        vacancy: "Official Notification देखें",
      },
    ],

    officialUrl: "https://ssc.gov.in/",

    links: [
      {
        label: "Official Website",
        url: "https://ssc.gov.in/",
      },
      {
        label: "Official Notification",
        url: "https://ssc.gov.in/",
      },
      {
        label: "Apply Online",
        url: "https://ssc.gov.in/",
      },
    ],
  },

  /* =======================================================
     2. ADMIT CARD
     ======================================================= */

  {
    id: 2,

    title: "Railway Admit Card 2026",

    category: "Admit Card",

    state: "All India",

    date: "09 Aug 2026",

    description:
      "Railway examination के admit card से संबंधित जानकारी और official download link यहाँ मिलेगा।",

    organization: "Railway Recruitment Board",

    postName: "Various Railway Exams",

    examDate: "Official Schedule देखें",

    qualification: "संबंधित भर्ती notification के अनुसार",

    eligibility:
      "जिस भर्ती के लिए आवेदन किया है उसी के अनुसार eligibility लागू होगी।",

    howToApply: [
      "अपने संबंधित RRB की official website खोलें।",
      "Admit Card / E-Call Letter section खोलें।",
      "Registration Number और Date of Birth दर्ज करें।",
      "Admit Card डाउनलोड करें।",
      "Exam से पहले admit card का print निकालें।",
    ],

    officialUrl: "https://www.rrbapply.gov.in/",

    links: [
      {
        label: "Railway Official Website",
        url: "https://www.rrbapply.gov.in/",
      },
      {
        label: "Admit Card",
        url: "https://www.rrbapply.gov.in/",
      },
    ],
  },

  /* =======================================================
     3. RESULTS
     ======================================================= */

  {
    id: 3,

    title: "SSC Examination Result 2026",

    category: "Results",

    state: "All India",

    date: "09 Aug 2026",

    description:
      "SSC परीक्षा के result से संबंधित latest update और official result link यहाँ उपलब्ध कराया जाएगा।",

    organization: "Staff Selection Commission",

    postName: "Various SSC Examinations",

    howToApply: [
      "SSC की official website खोलें।",
      "Result section पर जाएँ।",
      "अपने examination का result link चुनें।",
      "Login details दर्ज करें।",
      "Result देखें और download करें।",
    ],

    officialUrl: "https://ssc.gov.in/",

    links: [
      {
        label: "SSC Official Website",
        url: "https://ssc.gov.in/",
      },
      {
        label: "Check Result",
        url: "https://ssc.gov.in/",
      },
    ],
  },

  /* =======================================================
     4. ADMISSION
     ======================================================= */

  {
    id: 4,

    title: "Bihar College Admission 2026",

    category: "Admission",

    state: "Bihar",

    date: "09 Aug 2026",

    description:
      "बिहार कॉलेज admission से संबंधित आवेदन प्रक्रिया, जरूरी documents और official admission portal की जानकारी।",

    organization: "Bihar Education / University",

    postName: "UG / College Admission",

    qualification: "संबंधित course की eligibility के अनुसार",

    eligibility: "University / College द्वारा निर्धारित eligibility लागू होगी।",

    documents: [
      "Aadhaar Card",
      "10th Marksheet",
      "12th Marksheet",
      "Passport Size Photograph",
      "Signature",
      "Mobile Number",
      "Email ID",
    ],

    howToApply: [
      "संबंधित university की official website खोलें।",
      "Admission portal पर जाएँ।",
      "Registration करें।",
      "Application form भरें।",
      "Documents upload करें।",
      "Application fee लागू होने पर जमा करें।",
      "Final application submit करें।",
    ],

    links: [
      {
        label: "Official Website",
        url: "https://www.bihar.gov.in/",
      },
      {
        label: "Admission Portal",
        url: "https://www.bihar.gov.in/",
      },
    ],
  },

  /* =======================================================
     5. ANSWER KEY
     ======================================================= */

  {
    id: 5,

    title: "Bihar Competitive Exam Answer Key 2026",

    category: "Answer Key",

    state: "Bihar",

    date: "09 Aug 2026",

    description:
      "बिहार प्रतियोगी परीक्षा की answer key से संबंधित latest information और official link।",

    organization: "Concerned Examination Authority",

    postName: "Competitive Examination",

    examDate: "Official Schedule देखें",

    howToApply: [
      "संबंधित परीक्षा की official website खोलें।",
      "Answer Key section पर जाएँ।",
      "अपने examination की answer key चुनें।",
      "PDF download करें।",
      "Official instructions के अनुसार objection करें।",
    ],

    links: [
      {
        label: "Official Website",
        url: "https://www.bihar.gov.in/",
      },
      {
        label: "Download Answer Key",
        url: "https://www.bihar.gov.in/",
      },
    ],
  },

  /* =======================================================
     6. SCHOLARSHIP
     ======================================================= */

  {
    id: 6,

    title: "Bihar Scholarship 2026",

    category: "Scholarship",

    state: "Bihar",

    date: "09 Aug 2026",

    description:
      "बिहार scholarship से संबंधित eligibility, documents, application process और official portal की जानकारी।",

    organization: "Bihar Government",

    postName: "Student Scholarship",

    qualification: "संबंधित scholarship scheme के अनुसार",

    eligibility: "Scheme की official eligibility conditions लागू होंगी।",

    documents: [
      "Aadhaar Card",
      "Educational Certificate",
      "Bank Account Details",
      "Income Certificate",
      "Caste Certificate यदि लागू हो",
      "Residence Certificate यदि लागू हो",
      "Passport Size Photograph",
      "Mobile Number",
    ],

    howToApply: [
      "Scholarship की official website खोलें।",
      "Student Registration करें।",
      "Application form में सही जानकारी भरें।",
      "Required documents upload करें।",
      "Application submit करें।",
      "Application number सुरक्षित रखें।",
      "Application status समय-समय पर check करें।",
    ],

    links: [
      {
        label: "Official Website",
        url: "https://www.bihar.gov.in/",
      },
      {
        label: "Apply Online",
        url: "https://www.bihar.gov.in/",
      },
    ],
  },
];

/* =========================================================
   DATA HELPERS
   ========================================================= */

/*
  ये functions आगे Admin Panel और website के बीच
  data management में काम आएंगे।
*/

/**
 * सभी default posts की copy देता है।
 */
export function getDefaultData(): LinkItem[] {
  return [...data];
}

/**
 * किसी post को ID से खोजता है।
 */
export function getPostById(id: number): LinkItem | undefined {
  return data.find((item) => item.id === id);
}

/**
 * Category के अनुसार posts निकालता है।
 */
export function getPostsByCategory(category: Category): LinkItem[] {
  return data.filter((item) => item.category === category);
}

/**
 * State के अनुसार posts निकालता है।
 */
export function getPostsByState(state: string): LinkItem[] {
  return data.filter((item) => item.state === state);
}

/**
 * Search के लिए helper.
 */
export function searchPosts(query: string): LinkItem[] {
  const search = query.trim().toLowerCase();

  if (!search) {
    return data;
  }

  return data.filter((item) => {
    return (
      item.title.toLowerCase().includes(search) ||
      item.description.toLowerCase().includes(search) ||
      item.category.toLowerCase().includes(search) ||
      item.state.toLowerCase().includes(search) ||
      item.organization?.toLowerCase().includes(search) ||
      item.postName?.toLowerCase().includes(search)
    );
  });
}
