import React from "react";

type InfoPageType = "about" | "contact" | "privacy" | "disclaimer";

type InfoPageProps = {
  type: InfoPageType;
  onBack: () => void;
};

const pageData = {
  about: {
    title: "About Us",
    subtitle: "Exam Yojana के बारे में",
  },

  contact: {
    title: "Contact Us",
    subtitle: "हमसे संपर्क करें",
  },

  privacy: {
    title: "Privacy Policy",
    subtitle: "आपकी privacy हमारे लिए महत्वपूर्ण है",
  },

  disclaimer: {
    title: "Disclaimer",
    subtitle: "महत्वपूर्ण सूचना और अस्वीकरण",
  },
};

function InfoPage({ type, onBack }: InfoPageProps) {
  const page = pageData[type];

  return (
    <div className="app">
      {/* =================================================
          HEADER
      ================================================= */}

      <header className="top-header">
        <div className="header-inner">
          <button type="button" className="brand" onClick={onBack}>
            <span className="brand-mark">E</span>

            <span>
              <strong>Exam Yojana</strong>

              <small>Jobs • Exams • Results</small>
            </span>
          </button>

          <button type="button" className="info-back-button" onClick={onBack}>
            ← Back
          </button>
        </div>
      </header>

      {/* =================================================
          INFORMATION PAGE
      ================================================= */}

      <main className="info-page">
        <div className="info-container">
          {/* PAGE HEADER */}

          <div className="info-header">
            <span className="info-badge">EXAM YOJANA</span>

            <h1>{page.title}</h1>

            <p>{page.subtitle}</p>
          </div>

          {/* =================================================
              ABOUT US
          ================================================= */}

          {type === "about" && (
            <section className="info-card">
              <h2>Exam Yojana क्या है?</h2>

              <p>
                Exam Yojana एक information platform है, जहाँ सरकारी नौकरी,
                प्रतियोगी परीक्षाओं, Admit Card, Results, Admission, Answer Key
                और Scholarship से संबंधित जानकारी आसान भाषा में उपलब्ध कराने का
                प्रयास किया जाता है।
              </p>

              <p>
                हमारा उद्देश्य विद्यार्थियों और job seekers को महत्वपूर्ण
                information एक जगह आसानी से उपलब्ध कराना है, ताकि उन्हें अलग-अलग
                websites पर बार-बार खोजने की आवश्यकता कम हो।
              </p>

              <h2>हमारी जानकारी</h2>

              <p>
                Exam Yojana पर उपलब्ध जानकारी विभिन्न official sources और public
                information के आधार पर प्रकाशित की जाती है।
              </p>

              <p>
                किसी भी application, examination, admission, result या
                scholarship से संबंधित अंतिम निर्णय लेने से पहले संबंधित
                official website और official notification को जरूर देखें।
              </p>

              <h2>हमारा उद्देश्य</h2>

              <ul>
                <li>सरकारी नौकरी की जानकारी आसान भाषा में देना।</li>

                <li>Admit Card और Result updates उपलब्ध कराना।</li>

                <li>Admission और Scholarship information साझा करना।</li>

                <li>महत्वपूर्ण official links एक जगह उपलब्ध कराना।</li>
              </ul>
            </section>
          )}

          {/* =================================================
              CONTACT US
          ================================================= */}

          {type === "contact" && (
            <section className="info-card">
              <h2>हमसे संपर्क करें</h2>

              <p>
                यदि आपको Exam Yojana website से संबंधित कोई सवाल, सुझाव,
                correction या feedback देना है, तो आप हमसे संपर्क कर सकते हैं।
              </p>

              <div className="contact-box">
                <div className="contact-item">
                  <strong>📧 Email</strong>

                  <p>support@examyojana.com</p>
                </div>

                <div className="contact-item">
                  <strong>📝 General Query</strong>

                  <p>
                    Website से संबंधित किसी भी सामान्य समस्या या सुझाव के लिए
                    message करें।
                  </p>
                </div>

                <div className="contact-item">
                  <strong>⚠️ Correction Request</strong>

                  <p>
                    यदि किसी post में कोई गलत या outdated information दिखाई दे,
                    तो कृपया हमें जानकारी दें ताकि उसे review किया जा सके।
                  </p>
                </div>
              </div>

              <h2>महत्वपूर्ण</h2>

              <p>
                किसी भर्ती, परीक्षा, admission या scholarship के संबंध में अंतिम
                और कानूनी रूप से मान्य जानकारी के लिए संबंधित official authority
                की website और notification को प्राथमिकता दें।
              </p>
            </section>
          )}

          {/* =================================================
              PRIVACY POLICY
          ================================================= */}

          {type === "privacy" && (
            <section className="info-card">
              <h2>Privacy Policy</h2>

              <p>
                Exam Yojana अपने visitors की privacy का सम्मान करता है। यह
                Privacy Policy बताती है कि website का उपयोग करते समय सामान्य रूप
                से कौन-सी information collect या process हो सकती है।
              </p>

              <h2>Information Collection</h2>

              <p>
                Website का सामान्य उपयोग करने के लिए आपको personal information
                देना आवश्यक नहीं है, जब तक कि किसी specific feature के लिए इसकी
                आवश्यकता न हो।
              </p>

              <h2>Cookies</h2>

              <p>
                Website बेहतर user experience, analytics या advertising services
                के लिए cookies या similar technologies का उपयोग कर सकती है।
              </p>

              <h2>Third-Party Services</h2>

              <p>
                Website पर future में analytics, advertising, hosting या अन्य
                third-party services का उपयोग किया जा सकता है। इन services की
                अपनी privacy policies हो सकती हैं।
              </p>

              <h2>External Links</h2>

              <p>
                Exam Yojana पर अन्य websites के links दिए जा सकते हैं। उन
                external websites की privacy practices के लिए संबंधित website की
                अपनी privacy policy लागू होगी।
              </p>

              <h2>Policy Updates</h2>

              <p>
                आवश्यकता पड़ने पर इस Privacy Policy को update किया जा सकता है।
                किसी महत्वपूर्ण बदलाव के बाद updated version इसी page पर उपलब्ध
                कराया जाएगा।
              </p>
            </section>
          )}

          {/* =================================================
              DISCLAIMER
          ================================================= */}

          {type === "disclaimer" && (
            <section className="info-card">
              <h2>General Disclaimer</h2>

              <p>
                Exam Yojana एक independent information platform है। यह किसी
                government department, recruitment board, university या
                examination authority की official website नहीं है, जब तक किसी
                specific page पर स्पष्ट रूप से ऐसा न बताया गया हो।
              </p>

              <h2>Information Accuracy</h2>

              <p>
                हम information को सही और useful रखने का प्रयास करते हैं, लेकिन
                किसी भी information में बदलाव, delay या error की संभावना हो सकती
                है।
              </p>

              <p>
                इसलिए application submit करने, fee जमा करने, examination में
                शामिल होने या कोई महत्वपूर्ण निर्णय लेने से पहले संबंधित
                official notification और official website पर information verify
                करें।
              </p>

              <h2>Official Sources</h2>

              <p>
                जहाँ संभव हो, users को संबंधित government department,
                recruitment board, university या examination authority की
                official website पर उपलब्ध जानकारी को प्राथमिकता देनी चाहिए।
              </p>

              <h2>External Links</h2>

              <p>
                Website पर दिए गए external links third-party websites पर ले जा
                सकते हैं। उन websites की content, availability या policies के
                लिए Exam Yojana जिम्मेदार नहीं है।
              </p>

              <h2>No Guarantee</h2>

              <p>
                Exam Yojana किसी particular job, admission, result, selection या
                scholarship की guarantee नहीं देता।
              </p>

              <h2>User Responsibility</h2>

              <p>
                किसी भी form को submit करने से पहले candidate को अपनी
                eligibility, documents, dates, fee और अन्य आवश्यक conditions
                official notification से verify करनी चाहिए।
              </p>
            </section>
          )}

          {/* =================================================
              BACK BUTTON
          ================================================= */}

          <div className="info-bottom-action">
            <button type="button" onClick={onBack}>
              ← Back to Home
            </button>
          </div>
        </div>
      </main>

      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="footer">
        <div className="footer-inner">
          <div>
            <h2>Exam Yojana</h2>

            <p>
              Government Jobs, Exams, Results, Admit Card, Admission और
              Scholarship की जानकारी आसान भाषा में।
            </p>
          </div>

          <div className="footer-links">
            <button type="button" onClick={onBack}>
              Home
            </button>

            <button type="button" onClick={onBack}>
              Latest Jobs
            </button>

            <button type="button" onClick={onBack}>
              Results
            </button>
          </div>
        </div>

        <div className="copyright">
          © 2026 Exam Yojana. All Rights Reserved.
        </div>
      </footer>
    </div>
  );
}

export default InfoPage;
