import React, { useState } from "react";
import type { Category, LinkItem } from "./data";

type AdminProps = {
  onBack?: () => void;
};

const STORAGE_KEY = "exam-yojana-posts";

const categories: Category[] = [
  "Latest Jobs",
  "Admit Card",
  "Results",
  "Admission",
  "Answer Key",
  "Scholarship",
];

const states = [
  "All India",
  "Bihar",
  "Uttar Pradesh",
  "Delhi",
];

type FormState = {
  title: string;
  category: Category;
  state: string;

  organization: string;
  postName: string;
  totalVacancy: string;

  applicationStart: string;
  applicationLastDate: string;
  examDate: string;

  fee: string;
  ageLimit: string;
  qualification: string;
  eligibility: string;

  description: string;

  applyUrl: string;
  notificationUrl: string;
  admitCardUrl: string;
  resultUrl: string;
  answerKeyUrl: string;
  officialUrl: string;

  documents: string;
  howToApply: string;

  vacancyDetails: string;
};

const emptyForm: FormState = {
  title: "",
  category: "Latest Jobs",
  state: "Bihar",

  organization: "",
  postName: "",
  totalVacancy: "",

  applicationStart: "",
  applicationLastDate: "",
  examDate: "",

  fee: "",
  ageLimit: "",
  qualification: "",
  eligibility: "",

  description: "",

  applyUrl: "",
  notificationUrl: "",
  admitCardUrl: "",
  resultUrl: "",
  answerKeyUrl: "",
  officialUrl: "",

  documents: "",
  howToApply: "",

  vacancyDetails: "",
};

/* =========================================================
   STORAGE
========================================================= */

function getStoredPosts(): LinkItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed as LinkItem[];
  } catch (error) {
    console.error("Storage read error:", error);
    return [];
  }
}

/* =========================================================
   ADMIN
========================================================= */

function Admin({ onBack }: AdminProps) {
  const [form, setForm] = useState<FormState>({
    ...emptyForm,
  });

  const [managedPosts, setManagedPosts] = useState<LinkItem[]>(
    getStoredPosts
  );

  const [editingId, setEditingId] = useState<number | null>(null);

  const [saved, setSaved] = useState(false);

  const [generatedData, setGeneratedData] =
    useState<LinkItem | null>(null);

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateField = (
    field: keyof FormState,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setSaved(false);
  };

  /* =======================================================
     BUILD LINKS
  ======================================================= */

  const buildLinks = (): LinkItem["links"] => {
    const links: NonNullable<LinkItem["links"]> = [];

    if (form.applyUrl.trim()) {
      links.push({
        label: "Apply Online",
        url: form.applyUrl.trim(),
      });
    }

    if (form.notificationUrl.trim()) {
      links.push({
        label: "Official Notification",
        url: form.notificationUrl.trim(),
      });
    }

    if (form.admitCardUrl.trim()) {
      links.push({
        label: "Admit Card",
        url: form.admitCardUrl.trim(),
      });
    }

    if (form.resultUrl.trim()) {
      links.push({
        label: "Check Result",
        url: form.resultUrl.trim(),
      });
    }

    if (form.answerKeyUrl.trim()) {
      links.push({
        label: "Answer Key",
        url: form.answerKeyUrl.trim(),
      });
    }

    if (form.officialUrl.trim()) {
      links.push({
        label: "Official Website",
        url: form.officialUrl.trim(),
      });
    }

    return links.length > 0 ? links : undefined;
  };

  /* =======================================================
     BUILD POST
  ======================================================= */

  const buildPost = (id: number): LinkItem => {
    const documents = form.documents
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const howToApply = form.howToApply
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const vacancyDetails = form.vacancyDetails
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split("|");

        return {
          post: parts[0]?.trim() || "",
          vacancy:
            parts.slice(1).join("|").trim() || "",
        };
      })
      .filter(
        (item) =>
          item.post.length > 0 &&
          item.vacancy.length > 0
      );

    return {
      id,

      title: form.title.trim(),

      category: form.category,

      state: form.state,

      date: new Date().toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),

      description: form.description.trim(),

      organization:
        form.organization.trim() || undefined,

      postName:
        form.postName.trim() || undefined,

      totalVacancy:
        form.totalVacancy.trim() || undefined,

      applicationStart:
        form.applicationStart.trim() || undefined,

      applicationLastDate:
        form.applicationLastDate.trim() || undefined,

      examDate:
        form.examDate.trim() || undefined,

      fee:
        form.fee.trim() || undefined,

      ageLimit:
        form.ageLimit.trim() || undefined,

      qualification:
        form.qualification.trim() || undefined,

      eligibility:
        form.eligibility.trim() || undefined,

      documents:
        documents.length > 0
          ? documents
          : undefined,

      howToApply:
        howToApply.length > 0
          ? howToApply
          : undefined,

      vacancyDetails:
        vacancyDetails.length > 0
          ? vacancyDetails
          : undefined,

      officialUrl:
        form.officialUrl.trim() || undefined,

      links: buildLinks(),
    };
  };

  /* =======================================================
     SAVE POSTS
  ======================================================= */

  const savePosts = (posts: LinkItem[]) => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(posts)
      );

      setManagedPosts(posts);

      window.dispatchEvent(
        new CustomEvent(
          "exam-yojana-post-created"
        )
      );
    } catch (error) {
      console.error(
        "Post storage error:",
        error
      );

      throw error;
    }
  };

  /* =======================================================
     CREATE / UPDATE POST
  ======================================================= */

  const createPost = () => {
    if (!form.title.trim()) {
      alert("Post Title भरना जरूरी है।");
      return;
    }

    if (!form.description.trim()) {
      alert("Description भरना जरूरी है।");
      return;
    }

    try {
      const oldPosts = getStoredPosts();

      /* =================================================
         EDIT MODE
      ================================================= */

      if (editingId !== null) {
        const postExists = oldPosts.some(
          (post) => post.id === editingId
        );

        if (!postExists) {
          alert(
            "जिस post को edit किया गया था वह नहीं मिली।"
          );
          return;
        }

        const updatedPost = buildPost(editingId);

        const updatedPosts = oldPosts.map(
          (post) =>
            post.id === editingId
              ? updatedPost
              : post
        );

        savePosts(updatedPosts);

        setGeneratedData(updatedPost);

        setSaved(true);

        alert(
          "Post successfully updated!"
        );

        return;
      }

      /* =================================================
         CREATE MODE
      ================================================= */

      const newPost = buildPost(Date.now());

      const updatedPosts = [
        newPost,
        ...oldPosts,
      ];

      savePosts(updatedPosts);

      setGeneratedData(newPost);

      setSaved(true);

      alert(
        "Post successfully created!"
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error(
        "Post save error:",
        error
      );

      alert(
        "Post save नहीं हो सकी। Browser storage check करें।"
      );
    }
  };

  /* =======================================================
     FIND LINK
  ======================================================= */

  const findLink = (
    post: LinkItem,
    keywords: string[]
  ) => {
    const links = post.links ?? [];

    const found = links.find((link) =>
      keywords.some((keyword) =>
        link.label
          .toLowerCase()
          .includes(keyword.toLowerCase())
      )
    );

    return found?.url || "";
  };

  /* =======================================================
     EDIT POST
  ======================================================= */

  const editPost = (post: LinkItem) => {
    const vacancyText =
      post.vacancyDetails
        ?.map(
          (item) =>
            `${item.post} | ${item.vacancy}`
        )
        .join("\n") || "";

    setForm({
      title: post.title || "",

      category: post.category,

      state: post.state || "Bihar",

      organization:
        post.organization || "",

      postName:
        post.postName || "",

      totalVacancy:
        post.totalVacancy || "",

      applicationStart:
        post.applicationStart || "",

      applicationLastDate:
        post.applicationLastDate || "",

      examDate:
        post.examDate || "",

      fee:
        post.fee || "",

      ageLimit:
        post.ageLimit || "",

      qualification:
        post.qualification || "",

      eligibility:
        post.eligibility || "",

      description:
        post.description || "",

      applyUrl:
        findLink(post, ["apply"]),

      notificationUrl:
        findLink(post, [
          "notification",
          "notice",
        ]),

      admitCardUrl:
        findLink(post, ["admit"]),

      resultUrl:
        findLink(post, ["result"]),

      answerKeyUrl:
        findLink(post, [
          "answer key",
        ]),

      officialUrl:
        post.officialUrl ||
        findLink(post, [
          "official",
          "website",
        ]),

      documents:
        post.documents?.join("\n") || "",

      howToApply:
        post.howToApply?.join("\n") || "",

      vacancyDetails:
        vacancyText,
    });

    setEditingId(post.id);

    setGeneratedData(null);

    setSaved(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     DELETE SINGLE POST
  ======================================================= */

  const deletePost = (id: number) => {
    const post = managedPosts.find(
      (item) => item.id === id
    );

    if (!post) {
      return;
    }

    const confirmed = window.confirm(
      `क्या आप "${post.title}" को delete करना चाहते हैं?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedPosts =
        managedPosts.filter(
          (item) => item.id !== id
        );

      savePosts(updatedPosts);

      if (editingId === id) {
        setEditingId(null);

        setForm({
          ...emptyForm,
        });
      }

      if (generatedData?.id === id) {
        setGeneratedData(null);
      }

      setSaved(false);
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Post delete नहीं हो सकी।"
      );
    }
  };

  /* =======================================================
     CANCEL EDIT
  ======================================================= */

  const cancelEdit = () => {
    setEditingId(null);

    setForm({
      ...emptyForm,
    });

    setGeneratedData(null);

    setSaved(false);
  };

  /* =======================================================
     RESET FORM
  ======================================================= */

  const resetForm = () => {
    setForm({
      ...emptyForm,
    });

    setEditingId(null);

    setGeneratedData(null);

    setSaved(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =======================================================
     DELETE ALL
  ======================================================= */

  const deleteAllPosts = () => {
    if (managedPosts.length === 0) {
      alert(
        "Delete करने के लिए कोई Admin post नहीं है।"
      );
      return;
    }

    const confirmed = window.confirm(
      "क्या आप Admin द्वारा बनाई गई सभी posts delete करना चाहते हैं? यह action वापस नहीं किया जा सकता।"
    );

    if (!confirmed) {
      return;
    }

    try {
      localStorage.removeItem(
        STORAGE_KEY
      );

      setManagedPosts([]);

      setGeneratedData(null);

      setEditingId(null);

      setForm({
        ...emptyForm,
      });

      setSaved(false);

      window.dispatchEvent(
        new CustomEvent(
          "exam-yojana-post-created"
        )
      );
    } catch (error) {
      console.error(
        "Delete all error:",
        error
      );

      alert(
        "Posts delete नहीं हो सकीं।"
      );
    }
  };

  /* =======================================================
     UI
  ======================================================= */

  return (
    <main className="admin-page">
      <div className="admin-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="admin-header">
          <div>
            <span className="admin-badge">
              EXAM YOJANA ADMIN
            </span>

            <h1>
              {editingId !== null
                ? "Edit Post"
                : "Create New Post"}
            </h1>

            <p>
              नई Job, Admit Card, Result,
              Admission या Scholarship पोस्ट तैयार करें।
            </p>
          </div>

          {onBack && (
            <button
              type="button"
              className="admin-back"
              onClick={onBack}
            >
              ← Back to Website
            </button>
          )}
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {saved && generatedData && (
          <section className="admin-success">
            <div className="success-icon">
              ✓
            </div>

            <div>
              <strong>
                Post Successfully Saved / Updated
              </strong>

              <p>
                Post browser में save हो चुकी है।
              </p>
            </div>
          </section>
        )}

        {/* =================================================
            BASIC INFORMATION
        ================================================= */}

        <section className="admin-card">
          <SectionTitle
            number="1"
            title="Basic Information"
            subtitle="पोस्ट की मुख्य जानकारी"
          />

          <div className="admin-grid">
            <AdminInput
              label="Post Title *"
              value={form.title}
              onChange={(value) =>
                updateField(
                  "title",
                  value
                )
              }
              placeholder="SSC CGL Recruitment 2026"
              full
            />

            <AdminSelect
              label="Category"
              value={form.category}
              options={categories}
              onChange={(value) =>
                updateField(
                  "category",
                  value as Category
                )
              }
            />

            <AdminSelect
              label="State"
              value={form.state}
              options={states}
              onChange={(value) =>
                updateField(
                  "state",
                  value
                )
              }
            />

            <AdminInput
              label="Organization"
              value={form.organization}
              onChange={(value) =>
                updateField(
                  "organization",
                  value
                )
              }
              placeholder="Staff Selection Commission"
            />

            <AdminInput
              label="Post / Exam Name"
              value={form.postName}
              onChange={(value) =>
                updateField(
                  "postName",
                  value
                )
              }
              placeholder="Combined Graduate Level"
            />

            <AdminInput
              label="Total Vacancy"
              value={form.totalVacancy}
              onChange={(value) =>
                updateField(
                  "totalVacancy",
                  value
                )
              }
              placeholder="5000 Posts"
            />
          </div>
        </section>

        {/* =================================================
            IMPORTANT DATES
        ================================================= */}

        <section className="admin-card">
          <SectionTitle
            number="2"
            title="Important Dates"
            subtitle="Application और examination dates"
          />

          <div className="admin-grid">
            <AdminInput
              label="Application Start"
              value={form.applicationStart}
              onChange={(value) =>
                updateField(
                  "applicationStart",
                  value
                )
              }
              placeholder="01 Aug 2026"
            />

            <AdminInput
              label="Last Date"
              value={
                form.applicationLastDate
              }
              onChange={(value) =>
                updateField(
                  "applicationLastDate",
                  value
                )
              }
              placeholder="31 Aug 2026"
            />

            <AdminInput
              label="Exam Date"
              value={form.examDate}
              onChange={(value) =>
                updateField(
                  "examDate",
                  value
                )
              }
              placeholder="To Be Announced"
            />

            <AdminInput
              label="Application Fee"
              value={form.fee}
              onChange={(value) =>
                updateField(
                  "fee",
                  value
                )
              }
              placeholder="₹100"
            />
          </div>
        </section>
        {/* =================================================
            ELIGIBILITY
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>3</span>

            <div>
              <h2>Eligibility Details</h2>

              <small>
                Age, qualification और eligibility
              </small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Age Limit"
              value={form.ageLimit}
              onChange={(value) =>
                updateField("ageLimit", value)
              }
              placeholder="18-27 Years"
            />

            <AdminInput
              label="Qualification"
              value={form.qualification}
              onChange={(value) =>
                updateField("qualification", value)
              }
              placeholder="Graduation"
            />

            <AdminTextarea
              label="Eligibility"
              value={form.eligibility}
              onChange={(value) =>
                updateField("eligibility", value)
              }
              placeholder="Candidate must fulfill the official eligibility criteria."
              full
            />
          </div>
        </section>

        {/* =================================================
            ARTICLE CONTENT
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>4</span>

            <div>
              <h2>Article Content</h2>

              <small>
                पोस्ट का पूरा विवरण
              </small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminTextarea
              label="Description *"
              value={form.description}
              onChange={(value) =>
                updateField("description", value)
              }
              placeholder="इस पोस्ट के बारे में पूरी जानकारी लिखें..."
              full
              rows={7}
            />
          </div>
        </section>

        {/* =================================================
            DOCUMENTS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>5</span>

            <div>
              <h2>Required Documents</h2>

              <small>
                हर document को नई line में लिखें
              </small>
            </div>
          </div>

          <AdminTextarea
            label="Documents"
            value={form.documents}
            onChange={(value) =>
              updateField("documents", value)
            }
            placeholder={`Aadhaar Card
Educational Certificate
Passport Size Photograph
Signature
Mobile Number
Email ID`}
            full
            rows={7}
          />
        </section>

        {/* =================================================
            HOW TO APPLY
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>6</span>

            <div>
              <h2>How To Apply</h2>

              <small>
                आवेदन प्रक्रिया — हर step नई line में
              </small>
            </div>
          </div>

          <AdminTextarea
            label="Application Steps"
            value={form.howToApply}
            onChange={(value) =>
              updateField("howToApply", value)
            }
            placeholder={`Official website खोलें।
Registration करें।
Application form भरें।
Documents upload करें।
Fee जमा करें।
Final form submit करें।`}
            full
            rows={9}
          />
        </section>

        {/* =================================================
            VACANCY DETAILS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>7</span>

            <div>
              <h2>Vacancy Details</h2>

              <small>
                Post और vacancy को | से अलग करें
              </small>
            </div>
          </div>

          <AdminTextarea
            label="Post Wise Vacancy"
            value={form.vacancyDetails}
            onChange={(value) =>
              updateField("vacancyDetails", value)
            }
            placeholder={`SSC CGL | 2500
Junior Assistant | 500
Clerk | 300`}
            full
            rows={8}
          />

          <div className="admin-help">
            <strong>Format:</strong> Post Name | Vacancy
          </div>
        </section>

        {/* =================================================
            IMPORTANT LINKS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>8</span>

            <div>
              <h2>Important Links</h2>

              <small>
                केवल official और valid URLs डालें
              </small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Apply Online URL"
              value={form.applyUrl}
              onChange={(value) =>
                updateField("applyUrl", value)
              }
              placeholder="https://example.com/apply"
              type="url"
            />

            <AdminInput
              label="Official Notification URL"
              value={form.notificationUrl}
              onChange={(value) =>
                updateField(
                  "notificationUrl",
                  value
                )
              }
              placeholder="https://example.com/notification"
              type="url"
            />

            <AdminInput
              label="Admit Card URL"
              value={form.admitCardUrl}
              onChange={(value) =>
                updateField(
                  "admitCardUrl",
                  value
                )
              }
              placeholder="https://example.com/admit-card"
              type="url"
            />

            <AdminInput
              label="Result URL"
              value={form.resultUrl}
              onChange={(value) =>
                updateField("resultUrl", value)
              }
              placeholder="https://example.com/result"
              type="url"
            />

            <AdminInput
              label="Answer Key URL"
              value={form.answerKeyUrl}
              onChange={(value) =>
                updateField(
                  "answerKeyUrl",
                  value
                )
              }
              placeholder="https://example.com/answer-key"
              type="url"
            />

            <AdminInput
              label="Official Website URL"
              value={form.officialUrl}
              onChange={(value) =>
                updateField(
                  "officialUrl",
                  value
                )
              }
              placeholder="https://example.com/"
              type="url"
            />
          </div>
        </section>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <section className="admin-actions">
          {editingId !== null && (
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}

          <button
            type="button"
            className="admin-btn admin-btn-light"
            onClick={resetForm}
          >
            Reset Form
          </button>

          <button
            type="button"
            className="admin-btn admin-btn-primary"
            onClick={createPost}
          >
            {editingId !== null
              ? "Update Post"
              : "Create Post"}
          </button>
        </section>

        {/* =================================================
            GENERATED / SAVED POST
        ================================================= */}

        {generatedData && (
          <section className="admin-card admin-preview-card">
            <div className="admin-section-title">
              <span>✓</span>

              <div>
                <h2>
                  {editingId !== null
                    ? "Updated Post"
                    : "Created Post"}
                </h2>

                <small>
                  Saved post preview
                </small>
              </div>
            </div>

            <div className="admin-generated">
              <h3>
                {generatedData.title}
              </h3>

              <p>
                {generatedData.description}
              </p>

              <div className="admin-generated-meta">
                <span>
                  Category: {generatedData.category}
                </span>

                <span>
                  State: {generatedData.state}
                </span>

                {generatedData.totalVacancy && (
                  <span>
                    Vacancy:{" "}
                    {generatedData.totalVacancy}
                  </span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* =================================================
            POST MANAGEMENT
        ================================================= */}

        <section className="admin-card admin-management">
          <div className="admin-section-title">
            <span>9</span>

            <div>
              <h2>Post Management</h2>

              <small>
                Admin द्वारा बनाई गई posts
              </small>
            </div>
          </div>

          <div className="admin-management-header">
            <strong>
              Total Admin Posts:{" "}
              {managedPosts.length}
            </strong>

            {managedPosts.length > 0 && (
              <button
                type="button"
                className="admin-delete-all"
                onClick={deleteAllPosts}
              >
                Delete All Posts
              </button>
            )}
          </div>

          {managedPosts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">
                📭
              </div>

              <h3>
                अभी कोई Admin post नहीं है
              </h3>

              <p>
                ऊपर से नई post create करने पर
                वह यहाँ दिखाई देगी।
              </p>
            </div>
          ) : (
            <div className="admin-post-list">
              {managedPosts.map((post) => (
                <AdminPostManagement
                  key={post.id}
                  post={post}
                  onEdit={editPost}
                  onDelete={deletePost}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   ADMIN INPUT
========================================================= */

type AdminInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  full?: boolean;
};

function AdminInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  full = false,
}: AdminInputProps) {
  return (
    <div
      className={
        full
          ? "admin-field admin-field-full"
          : "admin-field"
      }
    >
      <label>{label}</label>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
}

/* =========================================================
   ADMIN TEXTAREA
========================================================= */

type AdminTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  full?: boolean;
  rows?: number;
};

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  full = false,
  rows = 5,
}: AdminTextareaProps) {
  return (
    <div
      className={
        full
          ? "admin-field admin-field-full"
          : "admin-field"
      }
    >
      <label>{label}</label>

      <textarea
        value={value}
        rows={rows}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </div>
  );
}

/* =========================================================
   ADMIN SELECT
========================================================= */

type AdminSelectProps = {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
};

function AdminSelect({
  label,
  value,
  options,
  onChange,
}: AdminSelectProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   POST MANAGEMENT ITEM
========================================================= */

type AdminPostManagementProps = {
  post: LinkItem;
  onEdit: (post: LinkItem) => void;
  onDelete: (id: number) => void;
};

function AdminPostManagement({
  post,
  onEdit,
  onDelete,
}: AdminPostManagementProps) {
  return (
    <article className="admin-post-item">
      <div className="admin-post-info">
        <div className="admin-post-category">
          {post.category}
        </div>

        <h3>{post.title}</h3>

        <p>
          {post.description}
        </p>

        <div className="admin-post-meta">
          <span>
            State: {post.state}
          </span>

          <span>
            Date: {post.date}
          </span>

          {post.organization && (
            <span>
              Organization:{" "}
              {post.organization}
            </span>
          )}
        </div>
      </div>

      <div className="admin-post-actions">
        <button
          type="button"
          className="admin-edit-btn"
          onClick={() => onEdit(post)}
        >
          Edit
        </button>

        <button
          type="button"
          className="admin-delete-btn"
          onClick={() =>
            onDelete(post.id)
          }
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default Admin;
        
