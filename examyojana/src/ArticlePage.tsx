import React from "react";
import type { LinkItem } from "./data";

type ArticlePageProps = {
  item: LinkItem;
};

function ArticlePage({ item }: ArticlePageProps) {
  const links = item.links ?? [];

  const getLink = (keywords: string[]) => {
    const found = links.find((link) =>
      keywords.some((keyword) => link.label.toLowerCase().includes(keyword))
    );

    return found?.url;
  };

  const applyUrl = getLink(["apply", "online"]) || item.officialUrl;

  const notificationUrl = getLink(["notification", "notice"]);

  const admitCardUrl = getLink(["admit card", "admit"]);

  const resultUrl = getLink(["result"]);

  const answerKeyUrl = getLink(["answer key"]);

  const officialUrl = item.officialUrl || getLink(["official", "website"]);

  const openOfficialLink = (url?: string) => {
    if (!url) return;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <main className="article-page">
      <div className="article-container">
        {/* BREADCRUMB */}

        <div className="article-breadcrumb">
          Home &nbsp;›&nbsp; {item.category} &nbsp;›&nbsp; {item.title}
        </div>

        {/* ARTICLE CARD */}

        <article className="article-card">
          {/* CATEGORY */}

          <span className="modal-tag">{item.category}</span>

          {/* TITLE */}

          <h1>{item.title}</h1>

          {/* META */}

          <div className="article-meta">
            <span>📅 Updated: {item.date}</span>

            <span>📍 {item.state}</span>

            {item.organization && <span>🏢 {item.organization}</span>}
          </div>

          {/* INTRO */}

          {item.description && (
            <div className="article-intro">{item.description}</div>
          )}

          {/* QUICK INFORMATION */}

          {(item.totalVacancy ||
            item.applicationStart ||
            item.applicationLastDate ||
            item.examDate) && (
            <div className="article-highlight">
              <div>
                <strong>Important Information</strong>
              </div>

              <div>
                {item.totalVacancy && <span>Vacancy: {item.totalVacancy}</span>}

                {item.applicationLastDate && (
                  <span>
                    &nbsp; • &nbsp; Last Date: {item.applicationLastDate}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* BASIC DETAILS */}

          {(item.organization ||
            item.postName ||
            item.totalVacancy ||
            item.applicationStart ||
            item.applicationLastDate ||
            item.examDate ||
            item.fee ||
            item.ageLimit ||
            item.qualification) && (
            <section className="article-section">
              <h2>📋 Important Details</h2>

              <div className="info-table">
                {item.organization && (
                  <div>
                    <strong>Organization</strong>

                    <span>{item.organization}</span>
                  </div>
                )}

                {item.postName && (
                  <div>
                    <strong>Post / Exam</strong>

                    <span>{item.postName}</span>
                  </div>
                )}

                {item.totalVacancy && (
                  <div>
                    <strong>Total Vacancy</strong>

                    <span>{item.totalVacancy}</span>
                  </div>
                )}

                {item.applicationStart && (
                  <div>
                    <strong>Application Start</strong>

                    <span>{item.applicationStart}</span>
                  </div>
                )}

                {item.applicationLastDate && (
                  <div>
                    <strong>Last Date</strong>

                    <span>{item.applicationLastDate}</span>
                  </div>
                )}

                {item.examDate && (
                  <div>
                    <strong>Exam Date</strong>

                    <span>{item.examDate}</span>
                  </div>
                )}

                {item.fee && (
                  <div>
                    <strong>Application Fee</strong>

                    <span>{item.fee}</span>
                  </div>
                )}

                {item.ageLimit && (
                  <div>
                    <strong>Age Limit</strong>

                    <span>{item.ageLimit}</span>
                  </div>
                )}

                {item.qualification && (
                  <div>
                    <strong>Qualification</strong>

                    <span>{item.qualification}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* ELIGIBILITY */}

          {item.eligibility && (
            <section className="article-section">
              <h2>🎯 Eligibility</h2>

              <p>{item.eligibility}</p>
            </section>
          )}

          {/* VACANCY TABLE */}

          {item.vacancyDetails && item.vacancyDetails.length > 0 && (
            <section className="article-section">
              <h2>📊 Vacancy Details</h2>

              <div className="vacancy-table">
                <div className="vacancy-head">
                  <span>Post</span>

                  <span>Vacancy</span>
                </div>

                {item.vacancyDetails.map((row, index) => (
                  <div className="vacancy-row" key={index}>
                    <span>{row.post}</span>

                    <span>{row.vacancy}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* DOCUMENTS */}

          {item.documents && item.documents.length > 0 && (
            <section className="article-section">
              <h2>📁 Required Documents</h2>

              <ul className="article-list">
                {item.documents.map((document, index) => (
                  <li key={index}>{document}</li>
                ))}
              </ul>
            </section>
          )}

          {/* HOW TO APPLY */}

          {item.howToApply && item.howToApply.length > 0 && (
            <section className="article-section">
              <h2>📝 How to Apply</h2>

              <ol className="steps-list">
                {item.howToApply.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </section>
          )}

          {/* IMPORTANT LINKS */}

          <section className="article-section">
            <h2>🔗 Important Links</h2>

            <div className="article-links">
              {applyUrl && (
                <button
                  type="button"
                  className="article-link-button"
                  onClick={() => openOfficialLink(applyUrl)}
                >
                  <span>Apply Online</span>

                  <span>↗</span>
                </button>
              )}

              {notificationUrl && (
                <button
                  type="button"
                  className="article-link-button"
                  onClick={() => openOfficialLink(notificationUrl)}
                >
                  <span>Official Notification</span>

                  <span>↗</span>
                </button>
              )}

              {admitCardUrl && (
                <button
                  type="button"
                  className="article-link-button"
                  onClick={() => openOfficialLink(admitCardUrl)}
                >
                  <span>Admit Card</span>

                  <span>↗</span>
                </button>
              )}

              {resultUrl && (
                <button
                  type="button"
                  className="article-link-button"
                  onClick={() => openOfficialLink(resultUrl)}
                >
                  <span>Check Result</span>

                  <span>↗</span>
                </button>
              )}

              {answerKeyUrl && (
                <button
                  type="button"
                  className="article-link-button"
                  onClick={() => openOfficialLink(answerKeyUrl)}
                >
                  <span>Answer Key</span>

                  <span>↗</span>
                </button>
              )}
            </div>

            {/* OFFICIAL WEBSITE */}

            {officialUrl && (
              <button
                type="button"
                className="article-official-button"
                onClick={() => openOfficialLink(officialUrl)}
              >
                🌐 Visit Official Website
              </button>
            )}
          </section>

          {/* DISCLAIMER */}

          <div className="disclaimer">
            <strong>⚠️ Important Notice</strong>

            <p>
              Exam Yojana केवल जानकारी उपलब्ध कराने का माध्यम है। किसी भी आवेदन,
              परीक्षा, result या admission से पहले संबंधित official website पर
              जारी notification और instructions जरूर पढ़ें।
            </p>
          </div>
        </article>
      </div>
    </main>
  );
}

export default ArticlePage;
