import React, { useCallback, useEffect, useMemo, useState } from "react";

import Admin from "./Admin";
import ArticlePage from "./ArticlePage";
import InfoPage from "./InfoPage";

import { data } from "./data";
import type { Category, LinkItem } from "./data";

/* =========================================================
   TYPES
========================================================= */

type InfoPageType = "about" | "contact" | "privacy" | "disclaimer";

type View = "home" | "admin" | "article" | InfoPageType;

type CategoryFilter = "All Categories" | Category;

/* =========================================================
   CONSTANTS
========================================================= */

/*
  IMPORTANT:
  Admin.tsx also uses this exact key.
*/
const STORAGE_KEY = "exam-yojana-posts";

const categories: Category[] = [
  "Latest Jobs",
  "Admit Card",
  "Results",
  "Admission",
  "Answer Key",
  "Scholarship",
];

const states = ["All States", "All India", "Bihar", "Uttar Pradesh", "Delhi"];

const categoryIcons: Record<Category, string> = {
  "Latest Jobs": "💼",
  "Admit Card": "🎫",
  Results: "📊",
  Admission: "🎓",
  "Answer Key": "🔑",
  Scholarship: "🏆",
};

/* =========================================================
   LOCAL STORAGE
========================================================= */

function readPostsFromStorage(): LinkItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return data;
    }

    const parsed: unknown = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return data;
    }

    return parsed as LinkItem[];
  } catch (error) {
    console.error("Storage read error:", error);

    return data;
  }
}

function getPosts(): LinkItem[] {
  const stored = readPostsFromStorage();

  return stored.length > 0 ? stored : data;
}

/* =========================================================
   APP
========================================================= */

function App() {
  /* =======================================================
     POSTS
  ======================================================= */

  const [posts, setPosts] = useState<LinkItem[]>(getPosts);

  /* =======================================================
     VIEW
  ======================================================= */

  const [view, setView] = useState<View>("home");

  const [selectedArticle, setSelectedArticle] = useState<LinkItem | null>(null);

  /* =======================================================
     FILTERS
  ======================================================= */

  const [search, setSearch] = useState("");

  const [category, setCategory] = useState<CategoryFilter>("All Categories");

  const [state, setState] = useState("All States");

  /* =======================================================
     RELOAD POSTS
  ======================================================= */

  const reloadPosts = useCallback(() => {
    const latest = getPosts();

    setPosts(latest);

    setSelectedArticle((current) => {
      if (!current) {
        return null;
      }

      const updated = latest.find((item) => item.id === current.id);

      return updated ?? current;
    });
  }, []);

  /* =======================================================
     ADMIN / STORAGE SYNC
  ======================================================= */

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        reloadPosts();
      }
    };

    const handleCustomPostEvent = () => {
      reloadPosts();
    };

    const handleFocus = () => {
      reloadPosts();
    };

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        reloadPosts();
      }
    };

    window.addEventListener("storage", handleStorage);

    window.addEventListener("exam-yojana-post-created", handleCustomPostEvent);

    window.addEventListener("focus", handleFocus);

    document.addEventListener("visibilitychange", handleVisibility);

    /*
      Extra check for same-tab Admin navigation.
    */

    const timer = window.setInterval(() => {
      const latest = getPosts();

      setPosts((current) => {
        const oldValue = JSON.stringify(current);
        const newValue = JSON.stringify(latest);

        if (oldValue === newValue) {
          return current;
        }

        return latest;
      });
    }, 1000);

    return () => {
      window.removeEventListener("storage", handleStorage);

      window.removeEventListener(
        "exam-yojana-post-created",
        handleCustomPostEvent
      );

      window.removeEventListener("focus", handleFocus);

      document.removeEventListener("visibilitychange", handleVisibility);

      window.clearInterval(timer);
    };
  }, [reloadPosts]);

  /* =======================================================
     BROWSER HISTORY
  ======================================================= */

  useEffect(() => {
    const initialState = {
      examYojana: true,
      view: "home" as View,
      articleId: null as number | null,
    };

    const currentState = window.history.state;

    if (!currentState || !currentState.examYojana) {
      window.history.replaceState(initialState, "", window.location.href);
    }

    const handlePopState = (event: PopStateEvent) => {
      const historyState = event.state;

      if (historyState && historyState.examYojana) {
        const nextView: View = historyState.view || "home";

        setView(nextView);

        if (
          historyState.articleId !== null &&
          historyState.articleId !== undefined
        ) {
          const latest = getPosts();

          const article = latest.find(
            (item) => item.id === historyState.articleId
          );

          setSelectedArticle(article ?? null);
        } else {
          setSelectedArticle(null);
        }

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });

        return;
      }

      setView("home");
      setSelectedArticle(null);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  /* =======================================================
     NAVIGATION
  ======================================================= */

  const navigate = useCallback(
    (nextView: View, articleId: number | null = null) => {
      const nextState = {
        examYojana: true,
        view: nextView,
        articleId,
      };

      window.history.pushState(nextState, "", window.location.href);

      setView(nextView);

      if (articleId !== null) {
        const latest = getPosts();

        const article = latest.find((item) => item.id === articleId);

        setSelectedArticle(article ?? null);
      } else {
        setSelectedArticle(null);
      }

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    },
    []
  );

  /* =======================================================
     HOME
  ======================================================= */

  const goHome = useCallback(() => {
    navigate("home");
  }, [navigate]);

  /* =======================================================
     ADMIN
  ======================================================= */

  const goAdmin = useCallback(() => {
    reloadPosts();

    navigate("admin");
  }, [navigate, reloadPosts]);

  /* =======================================================
     ARTICLE
  ======================================================= */

  const openArticle = useCallback(
    (item: LinkItem) => {
      const latest = getPosts();

      const actual = latest.find((post) => post.id === item.id) ?? item;

      setSelectedArticle(actual);

      navigate("article", actual.id);
    },
    [navigate]
  );

  /* =======================================================
     INFO PAGE
  ======================================================= */

  const openInfoPage = useCallback(
    (type: InfoPageType) => {
      navigate(type);
    },
    [navigate]
  );

  /* =======================================================
     BACK FROM ARTICLE
  ======================================================= */

  const backFromArticle = useCallback(() => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      navigate("home");
    }
  }, [navigate]);

  /* =======================================================
     FILTERED DATA
  ======================================================= */

  const filteredData = useMemo(() => {
    const query = search.trim().toLowerCase();

    return posts.filter((item) => {
      const matchesSearch =
        !query ||
        item.title.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        item.organization?.toLowerCase().includes(query) ||
        item.postName?.toLowerCase().includes(query) ||
        item.state.toLowerCase().includes(query);

      const matchesCategory =
        category === "All Categories" || item.category === category;

      const matchesState = state === "All States" || item.state === state;

      return matchesSearch && matchesCategory && matchesState;
    });
  }, [posts, search, category, state]);

  /* =======================================================
     CATEGORY HANDLER
  ======================================================= */

  const handleCategory = (value: Category) => {
    setCategory(value);

    if (view !== "home") {
      navigate("home");
    }

    window.setTimeout(() => {
      document.getElementById("updates")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 100);
  };

  /* =======================================================
     RESET FILTERS
  ======================================================= */

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setState("All States");
  };

  /* =======================================================
     ADMIN PAGE
  ======================================================= */

  if (view === "admin") {
    return (
      <Admin
        onBack={() => {
          reloadPosts();
          navigate("home");
        }}
      />
    );
  }

  /* =======================================================
     INFO PAGES
  ======================================================= */

  if (
    view === "about" ||
    view === "contact" ||
    view === "privacy" ||
    view === "disclaimer"
  ) {
    return (
      <InfoPage
        type={view}
        onBack={() => {
          if (window.history.length > 1) {
            window.history.back();
          } else {
            navigate("home");
          }
        }}
      />
    );
  }

  /* =======================================================
     ARTICLE PAGE
     
     IMPORTANT:
     Your ArticlePage.tsx accepts ONLY:
     
     type ArticlePageProps = {
       item: LinkItem;
     }
     
     Therefore NO extra props are passed.
  ======================================================= */

  if (view === "article" && selectedArticle) {
    return (
      <div className="app">
        <header className="top-header">
          <div className="header-inner">
            <button type="button" className="brand" onClick={goHome}>
              <span className="brand-mark">E</span>

              <span>
                <strong>Exam Yojana</strong>

                <small>सरकारी नौकरी और परीक्षा अपडेट</small>
              </span>
            </button>

            <nav className="main-nav">
              <button type="button" onClick={goHome}>
                Home
              </button>

              <button type="button" onClick={goAdmin}>
                Admin
              </button>
            </nav>

            <button
              type="button"
              className="mobile-menu"
              onClick={goHome}
              aria-label="Home"
            >
              ⌂
            </button>
          </div>
        </header>

        <div
          style={{
            width: "min(900px, calc(100% - 32px))",
            margin: "18px auto 0",
          }}
        >
          <button
            type="button"
            className="clear-button"
            onClick={backFromArticle}
          >
            ← Back
          </button>
        </div>

        <ArticlePage item={selectedArticle} />

        <Footer onHome={goHome} onInfoPage={openInfoPage} onAdmin={goAdmin} />
      </div>
    );
  }

  /* =======================================================
     HOME PAGE
  ======================================================= */

  return (
    <div className="app">
      {/* =================================================
          HEADER
      ================================================= */}

      <Header onHome={goHome} onAdmin={goAdmin} onCategory={handleCategory} />

      {/* =================================================
          HERO
      ================================================= */}

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-badge">
            सरकारी नौकरी • परीक्षा • एडमिशन • स्कॉलरशिप
          </div>

          <h1>Exam Yojana</h1>

          <p>
            Latest Jobs, Admit Card, Results, Admission, Answer Key और
            Scholarship की जानकारी एक ही जगह।
          </p>

          <div className="search-box">
            <span>⌕</span>

            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search Job, SSC, Railway, Bihar, Result..."
            />

            <button
              type="button"
              onClick={() =>
                document.getElementById("updates")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              Search
            </button>
          </div>

          <div className="popular">
            <span>Popular:</span>

            {["SSC", "Railway", "Bihar", "Police", "Scholarship"].map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSearch(item)}
                >
                  {item}
                </button>
              )
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="container">
        {/* =================================================
            IMPORTANT LINKS
        ================================================= */}

        <section className="important-bar">
          <div className="important-label">
            <span>🔥</span>

            <strong>Important Links</strong>
          </div>

          <div className="important-links">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => handleCategory(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* =================================================
            FILTER PANEL
        ================================================= */}

        <section className="filters-panel">
          <div className="filter-heading">
            <div>
              <strong>Find Information</strong>

              <small>Category और State के अनुसार खोजें</small>
            </div>

            {(category !== "All Categories" ||
              state !== "All States" ||
              search) && (
              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>

          <div className="filter-controls">
            <div className="filter-group">
              <label>Category</label>

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value as CategoryFilter)
                }
              >
                <option>All Categories</option>

                {categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label>State</label>

              <select
                value={state}
                onChange={(event) => setState(event.target.value)}
              >
                {states.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* =================================================
            CATEGORY CARDS
        ================================================= */}

        <section className="portal-grid">
          {categories.map((categoryName) => {
            if (category !== "All Categories" && categoryName !== category) {
              return null;
            }

            const categoryItems = posts.filter(
              (item) => item.category === categoryName
            );

            const query = search.trim().toLowerCase();

            const visibleItems = categoryItems.filter((item) => {
              if (!query) {
                return true;
              }

              return (
                item.title.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                item.organization?.toLowerCase().includes(query) ||
                item.postName?.toLowerCase().includes(query) ||
                item.state.toLowerCase().includes(query)
              );
            });

            return (
              <div className="portal-box" key={categoryName}>
                {/* CATEGORY HEADER */}

                <div className="portal-box-header">
                  <div className="portal-title">
                    <div className="portal-icon">
                      {categoryIcons[categoryName]}
                    </div>

                    <div>
                      <h2>{categoryName}</h2>

                      <small>{visibleItems.length} Updates</small>
                    </div>
                  </div>
                </div>

                {/* CATEGORY POSTS */}

                <div className="portal-links">
                  {visibleItems.slice(0, 5).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => openArticle(item)}
                    >
                      <span className="link-arrow">›</span>

                      <span className="link-title">{item.title}</span>

                      <span className="link-date">{item.date}</span>
                    </button>
                  ))}

                  {visibleItems.length === 0 && (
                    <div
                      style={{
                        padding: "15px",
                        textAlign: "center",
                        color: "#667085",
                        fontSize: "11px",
                      }}
                    >
                      No updates available
                    </div>
                  )}
                </div>

                {/* VIEW ALL */}

                {visibleItems.length > 5 && (
                  <button
                    type="button"
                    className="portal-view-all"
                    onClick={() => handleCategory(categoryName)}
                  >
                    View All →
                  </button>
                )}
              </div>
            );
          })}
        </section>

        {/* =================================================
  ALL / LATEST POSTS
================================================= */}

        <section className="all-posts" id="updates">
          <div className="all-header">
            <div>
              <h2>Latest Updates</h2>

              <p>
                {filteredData.length} result
                {filteredData.length !== 1 ? "s" : ""} found
              </p>
            </div>

            {(category !== "All Categories" ||
              state !== "All States" ||
              search) && (
              <button
                type="button"
                className="clear-button"
                onClick={clearFilters}
              >
                Reset
              </button>
            )}
          </div>

          <div className="post-list">
            {filteredData.length === 0 ? (
              <div className="empty-state">
                <div>🔎</div>

                <h3>कोई result नहीं मिला</h3>

                <p>Search या filter बदलकर फिर कोशिश करें।</p>
              </div>
            ) : (
              filteredData.map((item) => (
                <button
                  className="post-row"
                  key={item.id}
                  type="button"
                  onClick={() => openArticle(item)}
                >
                  <span className="post-arrow">›</span>

                  <span className="post-main">
                    <strong>{item.title}</strong>

                    <small>
                      {item.category}
                      {" • "}
                      {item.state}

                      {item.organization ? ` • ${item.organization}` : ""}
                    </small>
                  </span>

                  <span className="post-date">{item.date}</span>
                </button>
              ))
            )}
          </div>
        </section>
      </main>

      {/* =================================================
FOOTER
================================================= */}

      <Footer onHome={goHome} onInfoPage={openInfoPage} onAdmin={goAdmin} />
    </div>
  );
}

/* =========================================================
HEADER
========================================================= */

type HeaderProps = {
  onHome: () => void;
  onCategory: (category: Category) => void;
  onAdmin: () => void;
};

function Header({ onHome, onCategory, onAdmin }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleHome = () => {
    setMenuOpen(false);
    onHome();
  };

  const handleAdmin = () => {
    setMenuOpen(false);
    onAdmin();
  };

  return (
    <header className="top-header">
      <div className="header-inner">
        {/* BRAND */}

        <button type="button" className="brand" onClick={handleHome}>
          <span className="brand-mark">E</span>

          <span>
            <strong>Exam Yojana</strong>

            <small>सरकारी नौकरी और परीक्षा अपडेट</small>
          </span>
        </button>

        {/* NAVIGATION */}

        <nav className={menuOpen ? "main-nav open" : "main-nav"}>
          <button type="button" onClick={handleHome}>
            Home
          </button>

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => {
                setMenuOpen(false);
                onCategory(item);
              }}
            >
              {item}
            </button>
          ))}

          <button type="button" onClick={handleAdmin}>
            Admin
          </button>
        </nav>

        {/* MOBILE MENU */}

        <button
          type="button"
          className="mobile-menu"
          aria-label="Open menu"
          onClick={() => setMenuOpen((current) => !current)}
        >
          ☰
        </button>
      </div>
    </header>
  );
}

/* =========================================================
FOOTER
========================================================= */

type FooterProps = {
  onHome: () => void;

  onInfoPage: (type: InfoPageType) => void;

  onAdmin: () => void;
};

function Footer({ onHome, onInfoPage, onAdmin }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        {/* FOOTER BRAND */}

        <div>
          <h2>Exam Yojana</h2>

          <p>
            सरकारी नौकरी, परीक्षा, Admit Card, Result, Admission और Scholarship
            की जानकारी एक ही जगह।
          </p>
        </div>

        {/* FOOTER LINKS */}

        <div className="footer-links">
          <button type="button" onClick={onHome}>
            Home
          </button>

          <button type="button" onClick={() => onInfoPage("about")}>
            About Us
          </button>

          <button type="button" onClick={() => onInfoPage("contact")}>
            Contact Us
          </button>

          <button type="button" onClick={() => onInfoPage("privacy")}>
            Privacy Policy
          </button>

          <button type="button" onClick={() => onInfoPage("disclaimer")}>
            Disclaimer
          </button>

          <button type="button" onClick={onAdmin}>
            Admin
          </button>
        </div>
      </div>

      {/* COPYRIGHT */}

      <div className="copyright">
        © {new Date().getFullYear()} Exam Yojana. All Rights Reserved.
      </div>
    </footer>
  );
}

/* =========================================================
FINAL EXPORT
========================================================= */

export default App;
