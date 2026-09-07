import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BrainCircuit,
  CheckCircle2,
  Building2,
  Globe2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Landing.css";


function LandingPage() {
  const navigate = useNavigate();

  const [activePanel, setActivePanel] = useState(null);
  const [activeFeature, setActiveFeature] = useState("connect");
  const [heroPointer, setHeroPointer] = useState({ x: 0, y: 0 });

  const handleHeroPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
    setHeroPointer({ x, y });
  };


  /* ==========================================================
     HOME
  ========================================================== */

  const goHome = () => {
    setActivePanel(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  /* ==========================================================
     SECTION NAVIGATION
  ========================================================== */

  const goToSection = (sectionId) => {
    setActivePanel(null);

    setTimeout(() => {
      document
        .getElementById(sectionId)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 50);
  };


  /* ==========================================================
     OPEN INFORMATION PANEL
  ========================================================== */

  const openPanel = (panel) => {
    setActivePanel(panel);

    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  };


  /* ==========================================================
     CLOSE INFORMATION PANEL
  ========================================================== */

  const closePanel = () => {
    setActivePanel(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };


  return (
    <div className="landing-page">


      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <header className="landing-navbar">

        <div className="landing-navbar-inner">


          {/* BRAND */}

          <button
            type="button"
            className="landing-brand"
            onClick={goHome}
            aria-label="Go to home"
          >

            <span className="landing-brand-mark">
              M
            </span>

            <span className="landing-brand-name">
              micron
            </span>

          </button>


          {/* NAVIGATION */}

          <nav className="landing-nav">

            <button
              type="button"
              onClick={goHome}
            >
              Home
            </button>


            <button
              type="button"
              onClick={() => goToSection("about")}
            >
              About Us
            </button>


            <button
              type="button"
              onClick={() => goToSection("contact")}
            >
              Contact
            </button>

          </nav>


          {/* LOGIN */}

          <button
            type="button"
            className="landing-login-button"
            onClick={() => navigate("/login")}
          >

            Login

            <ArrowRight size={15} />

          </button>

        </div>

      </header>


      {/* ======================================================
          INFORMATION PANEL
      ====================================================== */}

      {activePanel && (

        <div className="information-panel">


          {/* PANEL TOP BAR */}

          <div className="information-panel-navbar">

            <div className="information-panel-navbar-inner">


              <button
                type="button"
                className="information-panel-brand"
                onClick={closePanel}
              >

                <span>
                  M
                </span>

                micron

              </button>


              <button
                type="button"
                className="information-back-button"
                onClick={closePanel}
              >

                <ArrowLeft size={15} />

                Back to Home

              </button>

            </div>

          </div>


          {/* ==================================================
              COMPANY PROFILE
          ================================================== */}

          {activePanel === "company" && (

            <main className="information-content">


              <section className="information-hero">

                <div className="information-hero-background" />

                <div className="information-hero-overlay" />


                <div className="information-hero-content">

                  <span>
                    COMPANY
                  </span>

                  <h1>
                    Micron Technology.
                  </h1>

                  <p>
                    Discover the company behind the technology
                    helping shape the world's data-driven future.
                  </p>

                </div>

              </section>


              <section className="information-body">

                <div className="information-container">


                  <div className="information-heading">

                    <span>
                      ABOUT MICRON
                    </span>

                    <h2>
                      Building technology.
                      <br />
                      Enabling possibilities.
                    </h2>

                  </div>


                  <div className="information-two-column">


                    <div className="information-copy">

                      <p className="information-lead">

                        Micron is a global leader in memory
                        and storage solutions, helping transform
                        how information is created, accessed
                        and used.

                      </p>


                      <p>

                        Micron's technology supports a broad
                        range of applications across data
                        centers, intelligent computing,
                        mobile devices, automotive systems
                        and emerging technologies.

                      </p>


                      <p>

                        Behind that technology are teams of
                        engineers, researchers and professionals
                        working together to solve complex
                        challenges and build what comes next.

                      </p>

                    </div>


                    <div className="information-side">


                      <div className="information-card">

                        <Building2 size={19} />

                        <span>
                          COMPANY
                        </span>

                        <strong>
                          Micron Technology, Inc.
                        </strong>

                      </div>


                      <div className="information-card">

                        <Globe2 size={19} />

                        <span>
                          GLOBAL PRESENCE
                        </span>

                        <strong>
                          Technology and teams
                          around the world
                        </strong>

                      </div>


                      <div className="information-card">

                        <Users size={19} />

                        <span>
                          PEOPLE
                        </span>

                        <strong>
                          Innovation driven by
                          exceptional teams
                        </strong>

                      </div>

                    </div>

                  </div>


                  {/* OFFICIAL WEBSITE */}

                  <div className="official-information-link">

                    <div>

                      <span>
                        OFFICIAL MICRON RESOURCE
                      </span>

                      <strong>
                        Want to explore the complete company profile?
                      </strong>

                    </div>


                    <a
                      href="https://www.micron.com/about/company/corporate-profile"
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      Open official profile

                      <ArrowUpRight size={14} />

                    </a>

                  </div>


                  <button
                    type="button"
                    className="large-back-button"
                    onClick={closePanel}
                  >

                    <ArrowLeft size={15} />

                    Back to Home

                  </button>

                </div>

              </section>

            </main>

          )}


          {/* ==================================================
              LOCATIONS
          ================================================== */}

          {activePanel === "locations" && (

            <main className="information-content">


              <section className="information-hero">

                <div className="information-hero-background" />

                <div className="information-hero-overlay" />


                <div className="information-hero-content">

                  <span>
                    LOCATIONS
                  </span>

                  <h1>
                    Around the world.
                  </h1>

                  <p>
                    Explore the global presence behind
                    Micron's technology and innovation.
                  </p>

                </div>

              </section>


              <section className="information-body">

                <div className="information-container">


                  <div className="information-heading">

                    <span>
                      GLOBAL PRESENCE
                    </span>

                    <h2>
                      Where innovation
                      <br />
                      comes together.
                    </h2>

                  </div>


                  <div className="location-information-grid">


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <MapPin size={20} />
                      </div>

                      <span>
                        HEADQUARTERS
                      </span>

                      <h3>
                        Boise, Idaho
                      </h3>

                      <p>
                        Micron's corporate headquarters
                        in the United States.
                      </p>

                    </article>


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <Globe2 size={20} />
                      </div>

                      <span>
                        GLOBAL TEAMS
                      </span>

                      <h3>
                        Around the world
                      </h3>

                      <p>
                        Teams across multiple regions
                        contribute to Micron's global
                        technology ecosystem.
                      </p>

                    </article>


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <MapPin size={20} />
                      </div>

                      <span>
                        INDIA
                      </span>

                      <h3>
                        Micron India
                      </h3>

                      <p>
                        Explore Micron's presence and
                        opportunities in India.
                      </p>

                    </article>

                  </div>


                  <div className="official-information-link">

                    <div>

                      <span>
                        OFFICIAL MICRON RESOURCE
                      </span>

                      <strong>
                        Explore the complete list of locations.
                      </strong>

                    </div>


                    <a
                      href="https://www.micron.com/about/locations"
                      target="_blank"
                      rel="noopener noreferrer"
                    >

                      View official locations

                      <ArrowUpRight size={14} />

                    </a>

                  </div>


                  <button
                    type="button"
                    className="large-back-button"
                    onClick={closePanel}
                  >

                    <ArrowLeft size={15} />

                    Back to Home

                  </button>

                </div>

              </section>

            </main>

          )}


          {/* ==================================================
              CONTACT
          ================================================== */}

          {activePanel === "contact" && (

            <main className="information-content">


              <section className="information-hero">

                <div className="information-hero-background" />

                <div className="information-hero-overlay" />


                <div className="information-hero-content">

                  <span>
                    CONTACT
                  </span>

                  <h1>
                    Let's connect.
                  </h1>

                  <p>
                    Find the right official Micron resource
                    for your question or request.
                  </p>

                </div>

              </section>


              <section className="information-body">

                <div className="information-container">


                  <div className="information-heading">

                    <span>
                      GET IN TOUCH
                    </span>

                    <h2>
                      Find the right
                      <br />
                      connection.
                    </h2>

                  </div>


                  <div className="location-information-grid">


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <Mail size={20} />
                      </div>

                      <span>
                        GENERAL
                      </span>

                      <h3>
                        Contact Micron
                      </h3>

                      <p>
                        Access official contact resources
                        for general enquiries.
                      </p>

                      <a
                        href="https://www.micron.com/sales-support"
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        Contact resources

                        <ArrowUpRight size={14} />

                      </a>

                    </article>


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <MessageSquare size={20} />
                      </div>

                      <span>
                        SUPPORT
                      </span>

                      <h3>
                        Sales & Support
                      </h3>

                      <p>
                        Find official Micron sales and
                        support resources.
                      </p>

                      <a
                        href="https://www.micron.com/sales-support"
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        Sales & Support

                        <ArrowUpRight size={14} />

                      </a>

                    </article>


                    <article className="location-information-card">

                      <div className="location-information-icon">
                        <Phone size={20} />
                      </div>

                      <span>
                        OFFICIAL WEBSITE
                      </span>

                      <h3>
                        Micron.com
                      </h3>

                      <p>
                        Visit the official Micron website
                        for company-wide information.
                      </p>

                      <a
                        href="https://www.micron.com"
                        target="_blank"
                        rel="noopener noreferrer"
                      >

                        Visit Micron

                        <ArrowUpRight size={14} />

                      </a>

                    </article>

                  </div>


                  <button
                    type="button"
                    className="large-back-button"
                    onClick={closePanel}
                  >

                    <ArrowLeft size={15} />

                    Back to Home

                  </button>

                </div>

              </section>

            </main>

          )}


          {/* PANEL FOOTER */}

          <footer className="information-footer">

            <span>
              © 2026 Micron Technology, Inc.
            </span>

            <button
              type="button"
              onClick={closePanel}
            >
              Back to Home ↑
            </button>

          </footer>

        </div>

      )}


      {/* ======================================================
          NORMAL LANDING PAGE
      ====================================================== */}

      {!activePanel && (

        <>

          <main>


            {/* =================================================
                HERO
            ================================================= */}

            <section
              id="home"
              className="landing-hero"
              onMouseMove={handleHeroPointer}
              onMouseLeave={() => setHeroPointer({ x: 0, y: 0 })}
            >

              <div
                className="landing-hero-background"
                style={{
                  "--hero-x": `${heroPointer.x * 10}px`,
                  "--hero-y": `${heroPointer.y * 8}px`,
                }}
              />

              <div className="landing-hero-overlay" />


              <div className="landing-hero-content">

                <div className="landing-eyebrow">

                  <span />

                  EMPLOYEE REFERRAL PROGRAM

                </div>


                <h1>

                  Great people.
                  <br />

                  <span>Great teams.</span>

                </h1>


                <p className="landing-hero-description">

                  Know someone who could make a difference?
                  Connect exceptional talent with opportunities
                  where they can make an impact.

                </p>


                <div className="landing-hero-actions">

                  <button
                    type="button"
                    className="landing-primary-button"
                    onClick={() => navigate("/login")}
                  >

                    Login

                    <ArrowRight size={17} />

                  </button>


                  <button
                    type="button"
                    className="landing-discover-link"
                    onClick={() => goToSection("about")}
                  >

                    Discover more

                    <ArrowRight size={14} />

                  </button>

                </div>

              </div>


              <div className="landing-hero-orbit" aria-hidden="true">
                <div className="hero-orbit-ring hero-orbit-ring-one" />
                <div className="hero-orbit-ring hero-orbit-ring-two" />
                <div className="hero-orbit-core">
                  <span>REFERRAL</span>
                  <strong>LIVE</strong>
                </div>
                <div className="hero-float-card hero-float-card-one">
                  <UserRound size={15} />
                  <div><span>NEW REFERRAL</span><strong>Candidate added</strong></div>
                  <CheckCircle2 size={15} />
                </div>
                <div className="hero-float-card hero-float-card-two">
                  <BrainCircuit size={15} />
                  <div><span>AI MATCH</span><strong>94% relevant</strong></div>
                </div>
              </div>


              <div className="landing-hero-meta">

                <span>
                  MICRON
                </span>

                <span>
                  EMPLOYEE REFERRAL PLATFORM
                </span>

                <span>
                  01
                </span>

              </div>

            </section>


            {/* =================================================
                PLATFORM PULSE
            ================================================= */}

            <section className="landing-pulse">
              <div className="landing-container">
                <div className="landing-pulse-track">
                  <span><Sparkles size={14} /> SMART REFERRALS</span>
                  <i />
                  <span><Zap size={14} /> FASTER CONNECTIONS</span>
                  <i />
                  <span><ShieldCheck size={14} /> TRUSTED WORKFLOW</span>
                  <i />
                  <span><BarChart3 size={14} /> BETTER VISIBILITY</span>
                </div>
              </div>
            </section>


            {/* =================================================
                HOW IT WORKS
            ================================================= */}

            <section className="landing-how-it-works">
              <div className="landing-container">
                <div className="landing-section-top landing-section-top-dark">
                  <div>
                    <span className="landing-section-label">HOW IT WORKS</span>
                    <h2>One connection.
                      <br />Three simple steps.</h2>
                  </div>
                  <span className="landing-section-number">01</span>
                </div>

                <div className="landing-feature-layout">
                  <div className="landing-feature-list">
                    {[
                      { id: "connect", number: "01", icon: UserRound, title: "Connect", text: "Recommend someone from your network with a few simple details." },
                      { id: "match", number: "02", icon: BrainCircuit, title: "Match", text: "Relevant roles and intelligent analysis help recruiters focus faster." },
                      { id: "track", number: "03", icon: BarChart3, title: "Track", text: "Follow every referral from submission through the hiring journey." },
                    ].map((item) => {
                      const Icon = item.icon;
                      const active = activeFeature === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`landing-feature-item ${active ? "is-active" : ""}`}
                          onClick={() => setActiveFeature(item.id)}
                        >
                          <span className="landing-feature-number">{item.number}</span>
                          <span className="landing-feature-icon"><Icon size={18} /></span>
                          <span className="landing-feature-copy"><strong>{item.title}</strong><small>{item.text}</small></span>
                          <ArrowRight size={17} className="landing-feature-arrow" />
                        </button>
                      );
                    })}
                  </div>

                  <div className="landing-feature-stage">
                    <div className="feature-stage-grid" />
                    <div className="feature-stage-glow" />
                    <div className="feature-stage-label">EMPLOYEE REFERRAL PLATFORM</div>
                    <div className="feature-stage-window">
                      <div className="feature-stage-window-top">
                        <span /> <span /> <span />
                        <small>REFERRAL / {activeFeature.toUpperCase()}</small>
                      </div>
                      <div className="feature-stage-window-body">
                        <div className="feature-stage-avatar"><UserRound size={24} /></div>
                        <div>
                          <span className="feature-stage-kicker">{activeFeature === "connect" ? "NEW CONNECTION" : activeFeature === "match" ? "INTELLIGENT MATCH" : "REFERRAL STATUS"}</span>
                          <h3>{activeFeature === "connect" ? "Recommend great people." : activeFeature === "match" ? "Find the right opportunity." : "Know what happens next."}</h3>
                          <p>{activeFeature === "connect" ? "Start with a trusted introduction and let the platform handle the journey." : activeFeature === "match" ? "Give hiring teams clearer signals with structured candidate insights." : "Keep employees informed while HR moves candidates forward."}</p>
                        </div>
                      </div>
                      <div className="feature-stage-progress"><span /><span /><span /></div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


            {/* =================================================
                PORTAL CTA
            ================================================= */}

            <section className="landing-portal-cta">
              <div className="landing-container">
                <div className="landing-portal-copy">
                  <span className="landing-section-label">READY TO GET STARTED?</span>
                  <h2>Bring the right people
                    <br />into the conversation.</h2>
                  <p>Choose your portal and continue with the referral experience built for your role.</p>
                </div>
                <div className="landing-portal-actions">
                  <button type="button" className="landing-portal-card" onClick={() => navigate("/employee/login")}>
                    <span className="portal-card-icon"><UserRound size={20} /></span>
                    <span><small>FOR EMPLOYEES</small><strong>Refer a candidate</strong></span>
                    <ArrowUpRight size={19} />
                  </button>
                  <button type="button" className="landing-portal-card" onClick={() => navigate("/hr/login")}>
                    <span className="portal-card-icon"><Building2 size={20} /></span>
                    <span><small>FOR HR TEAMS</small><strong>Review candidates</strong></span>
                    <ArrowUpRight size={19} />
                  </button>
                </div>
              </div>
            </section>


            {/* =================================================
                ABOUT
            ================================================= */}

            <section
              id="about"
              className="landing-about"
            >

              <div className="landing-container">


                <div className="landing-section-top">

                  <div>

                    <span className="landing-section-label">
                      ABOUT US
                    </span>

                    <h2>

                      Connecting people
                      <br />

                      with possibilities.

                    </h2>

                  </div>


                  <span className="landing-section-number">
                    02
                  </span>

                </div>


                <div className="landing-about-grid">


                  <div className="landing-about-visual">

                    <div className="landing-about-image" />


                    <div className="landing-about-caption">

                      <span>
                        PEOPLE
                      </span>

                      <strong>

                        Innovation begins
                        <br />

                        with the right people.

                      </strong>

                    </div>

                  </div>


                  <div className="landing-about-copy">

                    <p className="landing-about-lead">

                      Strong teams are built by people who bring
                      different ideas, experiences and perspectives
                      together.

                    </p>


                    <p>

                      Our employee referral platform gives employees
                      a simple way to recommend talented people from
                      their professional network.

                    </p>


                    <p>

                      Once a referral is submitted, the candidate
                      continues through a dedicated application
                      experience. Intelligent analysis can then help
                      recruitment teams understand candidate
                      profiles and identify relevant opportunities.

                    </p>


                    <div className="landing-about-divider" />


                    <div className="landing-about-values">


                      <div>

                        <span>
                          01
                        </span>

                        <strong>
                          People first
                        </strong>

                      </div>


                      <div>

                        <span>
                          02
                        </span>

                        <strong>
                          Meaningful connections
                        </strong>

                      </div>


                      <div>

                        <span>
                          03
                        </span>

                        <strong>
                          Smarter possibilities
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                CONTACT
            ================================================= */}

            <section
              id="contact"
              className="landing-contact"
            >

              <div className="landing-container">


                <div className="landing-section-top">

                  <div>

                    <span className="landing-section-label">
                      CONTACT
                    </span>

                    <h2>
                      Explore Micron.
                    </h2>

                  </div>


                  <span className="landing-section-number">
                    03
                  </span>

                </div>


                <div className="landing-contact-intro">

                  <p>
                    Explore company information, locations
                    and official contact resources.
                  </p>


                  <button
                    type="button"
                    className="landing-back-home"
                    onClick={goHome}
                  >

                    <ArrowRight
                      size={14}
                      className="landing-back-home-icon"
                    />

                    Back to Home

                  </button>

                </div>


                <div className="landing-contact-grid">


                  {/* COMPANY */}

                  <article className="landing-contact-item">

                    <div className="landing-contact-top">

                      <div className="landing-contact-icon">
                        <Globe2 size={19} />
                      </div>

                      <span>
                        01
                      </span>

                    </div>


                    <div>

                      <span className="landing-contact-label">
                        COMPANY
                      </span>

                      <h3>
                        Micron Technology
                      </h3>

                      <p>

                        Discover Micron's technology,
                        people and global presence.

                      </p>

                    </div>


                    <button
                      type="button"
                      className="landing-contact-link"
                      onClick={() => openPanel("company")}
                    >

                      Company profile

                      <ArrowUpRight size={14} />

                    </button>

                  </article>


                  {/* LOCATIONS */}

                  <article className="landing-contact-item">

                    <div className="landing-contact-top">

                      <div className="landing-contact-icon">
                        <MapPin size={19} />
                      </div>

                      <span>
                        02
                      </span>

                    </div>


                    <div>

                      <span className="landing-contact-label">
                        LOCATIONS
                      </span>

                      <h3>
                        Around the world
                      </h3>

                      <p>

                        Explore Micron locations and
                        discover where our teams work.

                      </p>

                    </div>


                    <button
                      type="button"
                      className="landing-contact-link"
                      onClick={() => openPanel("locations")}
                    >

                      View locations

                      <ArrowUpRight size={14} />

                    </button>

                  </article>


                  {/* CONTACT */}

                  <article className="landing-contact-item">

                    <div className="landing-contact-top">

                      <div className="landing-contact-icon">
                        <Mail size={19} />
                      </div>

                      <span>
                        03
                      </span>

                    </div>


                    <div>

                      <span className="landing-contact-label">
                        CONTACT
                      </span>

                      <h3>
                        Get in touch
                      </h3>

                      <p>

                        Find official Micron contact and
                        support resources.

                      </p>

                    </div>


                    <button
                      type="button"
                      className="landing-contact-link"
                      onClick={() => openPanel("contact")}
                    >

                      Contact Micron

                      <ArrowUpRight size={14} />

                    </button>

                  </article>

                </div>

              </div>

            </section>

          </main>


          {/* ==================================================
              FOOTER
          ================================================== */}

          <footer className="landing-footer">

            <div className="landing-container">


              <div className="landing-footer-main">


                <div className="landing-footer-brand">

                  <button
                    type="button"
                    className="landing-footer-brand-button"
                    onClick={goHome}
                  >

                    <span className="landing-footer-brand-mark">
                      M
                    </span>

                    <strong>
                      micron
                    </strong>

                  </button>


                  <p>
                    Employee Referral Platform
                  </p>

                </div>


                <div className="landing-footer-column">

                  <span>
                    EXPLORE
                  </span>

                  <button onClick={goHome}>
                    Home
                  </button>

                  <button
                    onClick={() => goToSection("about")}
                  >
                    About Us
                  </button>

                  <button
                    onClick={() => goToSection("contact")}
                  >
                    Contact
                  </button>

                </div>


                <div className="landing-footer-column">

                  <span>
                    EMPLOYEE
                  </span>

                  <button
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>

                </div>


                <div className="landing-footer-column">

                  <span>
                    MICRON
                  </span>

                  <button
                    onClick={() => openPanel("company")}
                  >
                    Company
                  </button>

                  <button
                    onClick={() => openPanel("locations")}
                  >
                    Locations
                  </button>

                  <button
                    onClick={() => openPanel("contact")}
                  >
                    Contact
                  </button>

                </div>

              </div>


              <div className="landing-footer-info">


                <div>

                  <span>
                    CORPORATE ADDRESS
                  </span>

                  <strong>
                    Micron Technology, Inc.
                  </strong>

                  <p>

                    8000 S. Federal Way
                    <br />

                    Boise, Idaho 83716
                    <br />

                    United States

                  </p>

                </div>


                <div className="landing-footer-official">

                  <span>
                    OFFICIAL WEBSITE
                  </span>

                  <a
                    href="https://www.micron.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >

                    micron.com

                    <ArrowUpRight size={12} />

                  </a>

                </div>

              </div>


              <div className="landing-footer-bottom">

                <span>
                  © 2026 Micron Technology, Inc.
                </span>


                <div>

                  <a
                    href="https://www.micron.com/Privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Privacy
                  </a>

                  <button onClick={goHome}>
                    Back to top ↑
                  </button>

                </div>

              </div>

            </div>

          </footer>

        </>

      )}

    </div>
  );
}

export default LandingPage;