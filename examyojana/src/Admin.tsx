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

const states = ["All India", "Bihar", "Uttar Pradesh", "Delhi"];

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

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? (parsed as LinkItem[]) : [];
  } catch {
    return [];
  }
}

/* =========================================================
   ADMIN
========================================================= */

function Admin({ onBack }: AdminProps) {
  const [form, setForm] = useState<FormState>(emptyForm);

  const [managedPosts, setManagedPosts] = useState<LinkItem[]>(getStoredPosts);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [saved, setSaved] = useState(false);

  const [generatedData, setGeneratedData] = useState<LinkItem | null>(null);

  /* =======================================================
     FORM UPDATE
  ======================================================= */

  const updateField = (field: keyof FormState, value: string) => {
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
    const documents = (form.documents || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const howToApply = (form.howToApply || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);

    const vacancyDetails = (form.vacancyDetails || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
      .map((item) => {
        const parts = item.split("|");

        return {
          post: parts[0]?.trim() || "",
          vacancy: parts.slice(1).join("|").trim() || "",
        };
      })
      .filter((item) => item.post && item.vacancy);

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

      organization: form.organization.trim() || undefined,

      postName: form.postName.trim() || undefined,

      totalVacancy: form.totalVacancy.trim() || undefined,

      applicationStart: form.applicationStart.trim() || undefined,

      applicationLastDate: form.applicationLastDate.trim() || undefined,

      examDate: form.examDate.trim() || undefined,

      fee: form.fee.trim() || undefined,

      ageLimit: form.ageLimit.trim() || undefined,

      qualification: form.qualification.trim() || undefined,

      eligibility: form.eligibility.trim() || undefined,

      documents: documents.length > 0 ? documents : undefined,

      howToApply: howToApply.length > 0 ? howToApply : undefined,

      vacancyDetails: vacancyDetails.length > 0 ? vacancyDetails : undefined,

      officialUrl: form.officialUrl.trim() || undefined,

      links: buildLinks(),
    };
  };

  /* =======================================================
     SAVE TO STORAGE
  ======================================================= */

  const savePosts = (posts: LinkItem[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));

    setManagedPosts(posts);

    window.dispatchEvent(new CustomEvent("exam-yojana-post-created"));
  };

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

      // ==========================================
      // EDIT MODE
      // ==========================================
      if (editingId !== null) {
        const newPost = buildPost(editingId);

        const postExists = oldPosts.some((post) => post.id === editingId);

        if (!postExists) {
          alert("जिस post को edit किया गया था वह नहीं मिली।");
          return;
        }

        // पुरानी post को उसी ID पर replace करो
        const updatedPosts = oldPosts.map((post) =>
          post.id === editingId ? newPost : post
        );

        savePosts(updatedPosts);

        setGeneratedData(newPost);
        setSaved(true);

        alert("Post successfully updated!");

        // IMPORTANT:
        // Edit mode अभी तुरंत बंद नहीं करेंगे
        // ताकि success message सही रहे।
        return;
      }

      // ==========================================
      // CREATE MODE
      // ==========================================

      const newPost = buildPost(Date.now());

      const updatedPosts = [newPost, ...oldPosts];

      savePosts(updatedPosts);

      setGeneratedData(newPost);
      setSaved(true);

      alert("Post successfully created!");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Post save error:", error);

      alert("Post save नहीं हो सकी। Browser storage check करें।");
    }
  };

  /* =======================================================
     EDIT
  ======================================================= */

  const editPost = (post: LinkItem) => {
    const links = post.links ?? [];

    const findLink = (keywords: string[]) => {
      const found = links.find((link) =>
        keywords.some((keyword) => link.label.toLowerCase().includes(keyword))
      );

      return found?.url || "";
    };

    const vacancyText =
      post.vacancyDetails
        ?.map((item) => `${item.post} | ${item.vacancy}`)
        .join("\n") || "";

    setForm({
      title: post.title || "",

      category: post.category,

      state: post.state || "Bihar",

      organization: post.organization || "",

      postName: post.postName || "",

      totalVacancy: post.totalVacancy || "",

      applicationStart: post.applicationStart || "",

      applicationLastDate: post.applicationLastDate || "",

      examDate: post.examDate || "",

      fee: post.fee || "",

      ageLimit: post.ageLimit || "",

      qualification: post.qualification || "",

      eligibility: post.eligibility || "",

      description: post.description || "",

      applyUrl: findLink(["apply", "online"]),

      notificationUrl: findLink(["notification", "notice"]),

      admitCardUrl: findLink(["admit"]),

      resultUrl: findLink(["result"]),

      answerKeyUrl: findLink(["answer key"]),

      officialUrl: post.officialUrl || findLink(["official", "website"]),

      documents: post.documents?.join("\n") || "",

      howToApply: post.howToApply?.join("\n") || "",

      vacancyDetails: vacancyText,
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
    const post = managedPosts.find((item) => item.id === id);

    if (!post) {
      return;
    }

    const confirmed = window.confirm(
      `क्या आप "${post.title}" को delete करना चाहते हैं?`
    );

    if (!confirmed) {
      return;
    }

    const updatedPosts = managedPosts.filter((item) => item.id !== id);

    try {
      savePosts(updatedPosts);

      if (editingId === id) {
        setEditingId(null);
        setForm(emptyForm);
      }

      if (generatedData?.id === id) {
        setGeneratedData(null);
      }

      setSaved(false);
    } catch (error) {
      console.error("Delete error:", error);

      alert("Post delete नहीं हो सकी।");
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
     DELETE ALL ADMIN POSTS
  ======================================================= */

  const deleteAllPosts = () => {
    if (managedPosts.length === 0) {
      alert("Delete करने के लिए कोई Admin post नहीं है।");
      return;
    }

    const confirmed = window.confirm(
      "क्या आप Admin द्वारा बनाई गई सभी posts delete करना चाहते हैं? यह action वापस नहीं किया जा सकता।"
    );

    if (!confirmed) {
      return;
    }

    try {
      localStorage.removeItem(STORAGE_KEY);

      setManagedPosts([]);

      setGeneratedData(null);

      setEditingId(null);

      setForm(emptyForm);

      setSaved(false);

      window.dispatchEvent(new CustomEvent("exam-yojana-post-created"));
    } catch (error) {
      console.error("Delete all error:", error);

      alert("Posts delete नहीं हो सकीं।");
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
            <span className="admin-badge">EXAM YOJANA ADMIN</span>

            <h1>{editingId !== null ? "Edit Post" : "Create New Post"}</h1>

            <p>
              नई Job, Admit Card, Result, Admission या Scholarship पोस्ट तैयार
              करें।
            </p>
          </div>

          {onBack && (
            <button type="button" className="admin-back" onClick={onBack}>
              ← Back to Website
            </button>
          )}
        </div>

        {/* =================================================
            SUCCESS
        ================================================= */}

        {saved && generatedData && (
          <section className="admin-success">
            <div className="success-icon">✓</div>

            <div>
              <strong>Post Successfully Saved / Updated</strong>

              <p>Post browser में save हो चुकी है।</p>
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

              <small>पोस्ट की मुख्य जानकारी</small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Post Title *"
              value={form.title}
              onChange={(value) => updateField("title", value)}
              placeholder="SSC CGL Recruitment 2026"
              full
            />

            <AdminSelect
              label="Category"
              value={form.category}
              options={categories}
              onChange={(value) => updateField("category", value)}
            />

            <AdminSelect
              label="State"
              value={form.state}
              options={states}
              onChange={(value) => updateField("state", value)}
            />

            <AdminInput
              label="Organization"
              value={form.organization}
              onChange={(value) => updateField("organization", value)}
              placeholder="Staff Selection Commission"
            />

            <AdminInput
              label="Post / Exam Name"
              value={form.postName}
              onChange={(value) => updateField("postName", value)}
              placeholder="Combined Graduate Level"
            />

            <AdminInput
              label="Total Vacancy"
              value={form.totalVacancy}
              onChange={(value) => updateField("totalVacancy", value)}
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
              <h2>Important Dates</h2>

              <small>Application और examination dates</small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Application Start"
              value={form.applicationStart}
              onChange={(value) => updateField("applicationStart", value)}
              placeholder="01 Aug 2026"
            />

            <AdminInput
              label="Last Date"
              value={form.applicationLastDate}
              onChange={(value) => updateField("applicationLastDate", value)}
              placeholder="31 Aug 2026"
            />

            <AdminInput
              label="Exam Date"
              value={form.examDate}
              onChange={(value) => updateField("examDate", value)}
              placeholder="To Be Announced"
            />

            <AdminInput
              label="Application Fee"
              value={form.fee}
              onChange={(value) => updateField("fee", value)}
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

              <small>Age, qualification और eligibility</small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Age Limit"
              value={form.ageLimit}
              onChange={(value) => updateField("ageLimit", value)}
              placeholder="18-27 Years"
            />

            <AdminInput
              label="Qualification"
              value={form.qualification}
              onChange={(value) => updateField("qualification", value)}
              placeholder="Graduation"
            />

            <AdminTextarea
              label="Eligibility"
              value={form.eligibility}
              onChange={(value) => updateField("eligibility", value)}
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

              <small>User को दिखाई देने वाली जानकारी</small>
            </div>
          </div>

          <AdminTextarea
            label="Description *"
            value={form.description}
            onChange={(value) => updateField("description", value)}
            placeholder="इस पोस्ट के बारे में short और useful जानकारी लिखें..."
            full
          />

          <AdminTextarea
            label="Required Documents"
            value={form.documents}
            onChange={(value) => updateField("documents", value)}
            placeholder={`Aadhaar Card
Educational Certificate
Passport Size Photograph
Signature`}
            help="हर document को नई line में लिखें।"
            full
          />

          <AdminTextarea
            label="How To Apply"
            value={form.howToApply}
            onChange={(value) => updateField("howToApply", value)}
            placeholder={`Official website खोलें।
Registration करें।
Application form भरें।
Documents upload करें।
Final form submit करें।`}
            help="हर step को नई line में लिखें।"
            full
          />
        </section>

        {/* =================================================
            OFFICIAL LINKS
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>5</span>

            <div>
              <h2>Official Links</h2>

              <small>केवल official website के verified links डालें।</small>
            </div>
          </div>

          <div className="admin-grid">
            <AdminInput
              label="Apply Online URL"
              value={form.applyUrl}
              onChange={(value) => updateField("applyUrl", value)}
              placeholder="https://example.gov.in/apply"
              full
            />

            <AdminInput
              label="Official Notification URL"
              value={form.notificationUrl}
              onChange={(value) => updateField("notificationUrl", value)}
              placeholder="https://example.gov.in/notification.pdf"
              full
            />

            <AdminInput
              label="Admit Card URL"
              value={form.admitCardUrl}
              onChange={(value) => updateField("admitCardUrl", value)}
              placeholder="https://example.gov.in/admit-card"
              full
            />

            <AdminInput
              label="Result URL"
              value={form.resultUrl}
              onChange={(value) => updateField("resultUrl", value)}
              placeholder="https://example.gov.in/result"
              full
            />

            <AdminInput
              label="Answer Key URL"
              value={form.answerKeyUrl}
              onChange={(value) => updateField("answerKeyUrl", value)}
              placeholder="https://example.gov.in/answer-key"
              full
            />

            <AdminInput
              label="Official Website"
              value={form.officialUrl}
              onChange={(value) => updateField("officialUrl", value)}
              placeholder="https://example.gov.in"
              full
            />
          </div>
        </section>

        {/* =================================================
            ACTIONS
        ================================================= */}

        <div className="admin-actions">
          <button type="button" className="admin-reset" onClick={resetForm}>
            Reset
          </button>

          <button type="button" className="admin-submit" onClick={createPost}>
            ✓ Generate & Save Post
          </button>
        </div>

        {/* =================================================
            GENERATED DATA
        ================================================= */}

        {generatedData && (
          <section className="admin-card generated-card">
            <div className="admin-section-title">
              <span>✓</span>

              <div>
                <h2>Generated Data</h2>

                <small>Post successfully saved.</small>
              </div>
            </div>

            <pre className="generated-code">
              {JSON.stringify(generatedData, null, 2)}
            </pre>

            <div className="generated-actions">
              {onBack && (
                <button type="button" className="admin-submit" onClick={onBack}>
                  ← Go To Home
                </button>
              )}
            </div>
          </section>
        )}

        {/* =================================================
            POST MANAGEMENT
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>6</span>

            <div>
              <h2>Post Management</h2>

              <small>Admin से बनाई गई posts को Edit या Delete करें।</small>
            </div>
          </div>

          <AdminPostManagement
            onEdit={(post) => {
              setForm({
                title: post.title,
                category: post.category,
                state: post.state,

                organization: post.organization || "",
                postName: post.postName || "",
                totalVacancy: post.totalVacancy || "",

                applicationStart: post.applicationStart || "",
                applicationLastDate: post.applicationLastDate || "",
                examDate: post.examDate || "",

                fee: post.fee || "",
                ageLimit: post.ageLimit || "",
                qualification: post.qualification || "",
                eligibility: post.eligibility || "",

                description: post.description || "",

                applyUrl:
                  post.links?.find((link) =>
                    link.label.toLowerCase().includes("apply")
                  )?.url || "",

                notificationUrl:
                  post.links?.find((link) =>
                    link.label.toLowerCase().includes("notification")
                  )?.url || "",

                admitCardUrl:
                  post.links?.find((link) =>
                    link.label.toLowerCase().includes("admit")
                  )?.url || "",

                resultUrl:
                  post.links?.find((link) =>
                    link.label.toLowerCase().includes("result")
                  )?.url || "",

                answerKeyUrl:
                  post.links?.find((link) =>
                    link.label.toLowerCase().includes("answer")
                  )?.url || "",

                officialUrl: post.officialUrl || "",

                documents: post.documents?.join("\n") || "",

                howToApply: post.howToApply?.join("\n") || "",
              });

              setGeneratedData(null);
              setSaved(false);

              window.scrollTo({
                top: 0,
                behavior: "smooth",
              });
            }}
          />
        </section>

        {/* =================================================
            STORAGE CONTROL
        ================================================= */}

        <section className="admin-card">
          <div className="admin-section-title">
            <span>⚙</span>

            <div>
              <h2>Admin Storage</h2>

              <small>Browser में बनाई गई सभी posts का control</small>
            </div>
          </div>

          <button
            type="button"
            className="admin-reset"
            onClick={deleteAllPosts}
          >
            Delete All Admin Created Posts
          </button>
        </section>
      </div>
    </main>
  );
}

/* =========================================================
   INPUT COMPONENT
========================================================= */

type InputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  full?: boolean;
};

function AdminInput({ label, value, onChange, placeholder, full }: InputProps) {
  return (
    <div className={full ? "admin-field full" : "admin-field"}>
      <label>{label}</label>

      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

/* =========================================================
   SELECT COMPONENT
========================================================= */

type SelectProps = {
  label: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
};

function AdminSelect({ label, value, options, onChange }: SelectProps) {
  return (
    <div className="admin-field">
      <label>{label}</label>

      <select value={value} onChange={(event) => onChange(event.target.value)}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================================================
   TEXTAREA COMPONENT
========================================================= */

type TextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  help?: string;
  full?: boolean;
};

function AdminTextarea({
  label,
  value,
  onChange,
  placeholder,
  help,
  full,
}: TextareaProps) {
  return (
    <div className={full ? "admin-field full" : "admin-field"}>
      <label>{label}</label>

      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={6}
      />

      {help && <small className="field-help">{help}</small>}
    </div>
  );
}

/* =========================================================
   POST MANAGEMENT COMPONENT
========================================================= */

type PostManagementProps = {
  onEdit: (post: LinkItem) => void;
};

function AdminPostManagement({ onEdit }: PostManagementProps) {
  const [posts, setPosts] = useState<LinkItem[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  });

  const deletePost = (id: number) => {
    const confirmed = window.confirm(
      "क्या आप इस post को delete करना चाहते हैं?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const updatedPosts = posts.filter((post) => post.id !== id);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedPosts));

      setPosts(updatedPosts);

      window.dispatchEvent(new Event("exam-yojana-post-created"));
    } catch (error) {
      console.error("Delete post error:", error);

      alert("Post delete नहीं हो सकी।");
    }
  };

  if (posts.length === 0) {
    return (
      <div className="empty-state">
        <div>📭</div>

        <h3>No Admin Posts</h3>

        <p>अभी तक Admin Panel से कोई post create नहीं की गई है।</p>
      </div>
    );
  }

  return (
    <div className="admin-post-management">
      {posts.map((post) => (
        <div className="admin-post-item" key={post.id}>
          <div className="admin-post-info">
            <strong>{post.title}</strong>

            <small>
              {post.category} • {post.state}
            </small>

            <small>Updated: {post.date}</small>
          </div>

          <div className="admin-post-actions">
            <button
              type="button"
              className="admin-edit-button"
              onClick={() => onEdit(post)}
            >
              ✏️ Edit
            </button>

            <button
              type="button"
              className="admin-delete-button"
              onClick={() => deletePost(post.id)}
            >
              🗑 Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Admin;
