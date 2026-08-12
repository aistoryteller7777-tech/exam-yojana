import React, { useState } from "react";
import { data } from "./data";
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
  } catch {
    return [];
  }
}

/* =========================================================
   ADMIN
========================================================= */

function Admin({ onBack }: AdminProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const [managedPosts, setManagedPosts] =
    useState<LinkItem[]>(getStoredPosts);

  const [editingId, setEditingId] =
    useState<number | null>(null);

  const [saved, setSaved] = useState(false);

  const [generatedData, setGeneratedData] =
    useState<LinkItem | null>(null);

  /* =======================================================
     UPDATE FIELD
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
        (item) => item.post && item.vacancy
      );

    return {
      id,

      title: form.title.trim(),

      category: form.category,

      state: form.state,

      date: new Date().toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      ),

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
        form.applicationLastDate.trim() ||
        undefined,

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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(posts)
    );

    setManagedPosts(posts);

    window.dispatchEvent(
      new Event("exam-yojana-post-created")
    );
  };

  /* =======================================================
     CREATE / UPDATE
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

      /* EDIT */

      if (editingId !== null) {
        const newPost =
          buildPost(editingId);

        const exists = oldPosts.some(
          (post) => post.id === editingId
        );

        if (!exists) {
          alert(
            "जिस post को edit किया गया था वह नहीं मिली।"
          );
          return;
        }

        const updatedPosts = oldPosts.map(
          (post) =>
            post.id === editingId
              ? newPost
              : post
        );

        savePosts(updatedPosts);

        setGeneratedData(newPost);

        setSaved(true);

        alert(
          "Post successfully updated!"
        );

        return;
      }

      /* CREATE */

      const newPost = buildPost(
        Date.now()
      );

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
     EDIT POST
  ======================================================= */

  const editPost = (post: LinkItem) => {
    const links = post.links ?? [];

    const findLink = (
      keywords: string[]
    ): string => {
      const found = links.find(
        (link) =>
          keywords.some((keyword) =>
            link.label
              .toLowerCase()
              .includes(keyword)
          )
      );

      return found?.url || "";
    };

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

      state:
        post.state || "Bihar",

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
        findLink(["apply"]),

      notificationUrl:
        findLink([
          "notification",
          "notice",
        ]),

      admitCardUrl:
        findLink(["admit"]),

      resultUrl:
        findLink(["result"]),

      answerKeyUrl:
        findLink(["answer key"]),

      officialUrl:
        post.officialUrl ||
        findLink([
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
     DELETE SINGLE
  ======================================================= */

  const deletePost = (id: number) => {
    const post =
      managedPosts.find(
        (item) => item.id === id
      );

    if (!post) {
      return;
    }

    const confirmed =
      window.confirm(
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
        setForm(emptyForm);
      }

      if (
        generatedData?.id === id
      ) {
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

    setForm(emptyForm);

    setGeneratedData(null);

    setSaved(false);
  };

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    setForm(emptyForm);

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

    const confirmed =
      window.confirm(
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

      setForm(emptyForm);

      setSaved(false);

      window.dispatchEvent(
        new Event(
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

        {/* HEADER */}

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
              नई Job, Admit Card,
              Result, Admission या
              Scholarship पोस्ट तैयार करें।
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

        {/* SUCCESS */}

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
          <div className="admin-section-title">
            <span>1</span>

            <div>
              <h2>Basic Information</h2>

              <small>
                पोस्ट की मुख्य जानकारी
              </small>
            </div>
          </div>

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
                  value
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
          <div className="admin-section-title">
            <span>2</span>

            <div>
              <h2>
                Important Dates
              </h2>

              <small>
                Application और examination dates
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminInput
              label="Application Start"
              value={
                form.applicationStart
              }
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
              <h2>
                Eligibility Details
              </h2>

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
                updateField(
                  "ageLimit",
                  value
                )
              }
              placeholder="18-27 Years"
            />

            <AdminInput
              label="Qualification"
              value={
                form.qualification
              }
              onChange={(value) =>
                updateField(
                  "qualification",
                  value
                )
              }
              placeholder="Graduation"
            />

            <AdminTextarea
              label="Eligibility"
              value={form.eligibility}
              onChange={(value) =>
                updateField(
                  "eligibility",
                  value
                )
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
              <h2>
                Article Content
              </h2>

              <small>
                पोस्ट का पूरा article description
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminTextarea
              label="Description *"
              value={form.description}
              onChange={(value) =>
                updateField(
                  "description",
                  value
                )
              }
              placeholder="यहाँ पोस्ट की पूरी जानकारी लिखें..."
              full
              rows={8}
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
              <h2>
                Required Documents
              </h2>

              <small>
                हर document को अलग line में लिखें
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminTextarea
              label="Documents"
              value={form.documents}
              onChange={(value) =>
                updateField(
                  "documents",
                  value
                )
              }
              placeholder={
                "Aadhaar Card\n" +
                "10th Marksheet\n" +
                "12th Marksheet\n" +
                "Passport Size Photograph"
              }
              full
              rows={7}
            />

          </div>
        </section>

        {/* =================================================
            HOW TO APPLY
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>6</span>

            <div>
              <h2>
                How To Apply
              </h2>

              <small>
                आवेदन करने की पूरी प्रक्रिया
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminTextarea
              label="Application Steps"
              value={form.howToApply}
              onChange={(value) =>
                updateField(
                  "howToApply",
                  value
                )
              }
              placeholder={
                "Official website खोलें।\n" +
                "Registration करें।\n" +
                "Application form भरें।\n" +
                "Documents upload करें।\n" +
                "Final submit करें।"
              }
              full
              rows={8}
            />

          </div>
        </section>

        {/* =================================================
            VACANCY DETAILS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>7</span>

            <div>
              <h2>
                Vacancy Details
              </h2>

              <small>
                Post और vacancy को | से अलग करें
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminTextarea
              label="Post Wise Vacancy"
              value={
                form.vacancyDetails
              }
              onChange={(value) =>
                updateField(
                  "vacancyDetails",
                  value
                )
              }
              placeholder={
                "SSC CGL | 1500 Posts\n" +
                "Assistant Section Officer | 500 Posts"
              }
              full
              rows={7}
            />

          </div>
        </section>

        {/* =================================================
            IMPORTANT LINKS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>8</span>

            <div>
              <h2>
                Important Links
              </h2>

              <small>
                Official और application links
              </small>
            </div>
          </div>

          <div className="admin-grid">

            <AdminInput
              label="Apply Online URL"
              value={form.applyUrl}
              onChange={(value) =>
                updateField(
                  "applyUrl",
                  value
                )
              }
              placeholder="https://example.com/apply"
              full
            />

            <AdminInput
              label="Official Notification URL"
              value={
                form.notificationUrl
              }
              onChange={(value) =>
                updateField(
                  "notificationUrl",
                  value
                )
              }
              placeholder="https://example.com/notification"
              full
            />

            <AdminInput
              label="Admit Card URL"
              value={
                form.admitCardUrl
              }
              onChange={(value) =>
                updateField(
                  "admitCardUrl",
                  value
                )
              }
              placeholder="https://example.com/admit-card"
              full
            />

            <AdminInput
              label="Result URL"
              value={form.resultUrl}
              onChange={(value) =>
                updateField(
                  "resultUrl",
                  value
                )
              }
              placeholder="https://example.com/result"
              full
            />

            <AdminInput
              label="Answer Key URL"
              value={
                form.answerKeyUrl
              }
              onChange={(value) =>
                updateField(
                  "answerKeyUrl",
                  value
                )
              }
              placeholder="https://example.com/answer-key"
              full
            />

            <AdminInput
              label="Official Website URL"
              value={
                form.officialUrl
              }
              onChange={(value) =>
                updateField(
                  "officialUrl",
                  value
                )
              }
              placeholder="https://official-website.com"
              full
            />

          </div>
        </section>

        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <section className="admin-actions">

          <button
            type="button"
            className="admin-submit"
            onClick={createPost}
          >
            {editingId !== null
              ? "✓ Update Post"
              : "✓ Create Post"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              className="admin-cancel"
              onClick={cancelEdit}
            >
              Cancel Edit
            </button>
          )}

          <button
            type="button"
            className="admin-reset"
            onClick={resetForm}
          >
            Reset Form
          </button>

        </section>

        {/* =================================================
            GENERATED DATA PREVIEW
        ================================================= */}

        {generatedData && (
          <section className="admin-card">

            <div className="admin-section-title">
              <span>✓</span>

              <div>
                <h2>
                  Saved Post Preview
                </h2>

                <small>
                  अभी save हुई post
                </small>
              </div>
            </div>

            <div className="admin-preview">

              <h3>
                {generatedData.title}
              </h3>

              <p>
                {generatedData.description}
              </p>

              <div className="preview-meta">

                <span>
                  Category:{" "}
                  {generatedData.category}
                </span>

                <span>
                  State:{" "}
                  {generatedData.state}
                </span>

                {generatedData.organization && (
                  <span>
                    Organization:{" "}
                    {generatedData.organization}
                  </span>
                )}

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

        <section className="admin-card">

          <div className="admin-section-title">
            <span>9</span>

            <div>
              <h2>
                Post Management
              </h2>

              <small>
                Admin द्वारा बनाई गई posts
              </small>
            </div>
          </div>

          <div className="management-top">

            <strong>
              Total Admin Posts:{" "}
              {managedPosts.length}
            </strong>

            {managedPosts.length > 0 && (
              <button
                type="button"
                className="delete-all-btn"
                onClick={
                  deleteAllPosts
                }
              >
                Delete All Posts
              </button>
            )}

          </div>

          {managedPosts.length === 0 ? (
            <div className="empty-management">
              <p>
                अभी कोई Admin post नहीं है।
              </p>
            </div>
          ) : (
            <div className="admin-post-list">

              {managedPosts.map(
                (post) => (
                  <article
                    key={post.id}
                    className="admin-post-item"
                  >

                    <div className="admin-post-info">

                      <span className="post-category">
                        {post.category}
                      </span>

                      <h3>
                        {post.title}
                      </h3>

                      <p>
                        {post.description}
                      </p>

                      <small>
                        {post.state}
                        {" • "}
                        {post.date}
                      </small>

                    </div>

                    <div className="admin-post-actions">

                      <button
                        type="button"
                        className="edit-btn"
                        onClick={() =>
                          editPost(post)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="delete-btn"
                        onClick={() =>
                          deletePost(
                            post.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </article>
                )
              )}

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
  full?: boolean;
};

function AdminInput({
  label,
  value,
  onChange,
  placeholder,
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
      <label>
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
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
  rows = 6,
}: AdminTextareaProps) {
  return (
    <div
      className={
        full
          ? "admin-field admin-field-full"
          : "admin-field"
      }
    >
      <label>
        {label}
      </label>

      <textarea
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
        }
        placeholder={placeholder}
        rows={rows}
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
  options: readonly string[];
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
      <label>
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value
          )
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

export default Admin;
