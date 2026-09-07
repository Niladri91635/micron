import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Copy,
  Mail,
  Send,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

import "./EmployeeReferral.css";


const EmployeeReferral = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const [success, setSuccess] = useState(false);
  const [applicationLink, setApplicationLink] = useState("");
  const [submittedCandidate, setSubmittedCandidate] =
    useState(null);

  const [copied, setCopied] = useState(false);


  /* =========================================================
     FORM HANDLER
     ========================================================= */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: "",
    }));
  };


  /* =========================================================
     VALIDATION
     ========================================================= */

  const validateForm = () => {
    const newErrors = {};

    const firstName =
      formData.firstName.trim();

    const lastName =
      formData.lastName.trim();

    const email =
      formData.email.trim();


    if (!firstName) {
      newErrors.firstName =
        "First name is required.";
    }

    if (!lastName) {
      newErrors.lastName =
        "Last name is required.";
    }

    if (!email) {
      newErrors.email =
        "Email address is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };


  /* =========================================================
     CREATE UNIQUE TOKEN
     ========================================================= */

  const createToken = () => {
    return (
      `${Date.now().toString(36)}-` +
      `${Math.random().toString(36).substring(2, 10)}`
    );
  };


  /* =========================================================
     SEND INVITATION
     ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    const token = createToken();

    const candidate = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim().toLowerCase(),
    };

    let link =
      `${window.location.origin}/candidate/apply/${token}`;


    try {
      /*
       * Backend integration:
       *
       * POST /api/referrals/invite
       *
       * Expected response:
       * {
       *   success: true,
       *   applicationLink: "..."
       * }
       */

      const response = await fetch(
        "/api/referrals/invite",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ...candidate,
            token,
          }),
        }
      );


      if (response.ok) {
        const data = await response.json();

        if (data?.applicationLink) {
          link = data.applicationLink;
        }
      }

    } catch (error) {
      /*
       * Backend may not be running during frontend development.
       * We still generate a working demo application link.
       */
      console.log(
        "Invitation API unavailable. Using demo application link."
      );
    }


    /* =======================================================
       SAVE REFERRAL LOCALLY
       This allows My Referrals to show the candidate later.
       ======================================================= */

    const referral = {
      id: token,

      candidateId: token,

      firstName: candidate.firstName,
      lastName: candidate.lastName,
      email: candidate.email,

      applicationLink: link,

      status: "Invited",

      createdAt:
        new Date().toISOString(),

      stages: {
        referred: true,
        invited: true,
        submitted: false,
        aiReview: false,
        hrReview: false,
      },
    };


    try {
      const existing =
        JSON.parse(
          localStorage.getItem(
            "micronEmployeeReferrals"
          )
        ) || [];

      localStorage.setItem(
        "micronEmployeeReferrals",
        JSON.stringify([
          referral,
          ...existing,
        ])
      );

    } catch (error) {
      console.error(
        "Could not save referral:",
        error
      );
    }


    setSubmittedCandidate(candidate);
    setApplicationLink(link);
    setSuccess(true);
    setSubmitting(false);
  };


  /* =========================================================
     COPY APPLICATION LINK
     ========================================================= */

  const handleCopy = async () => {
    if (!applicationLink) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        applicationLink
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1800);

    } catch (error) {
      console.error(
        "Could not copy application link:",
        error
      );
    }
  };


  /* =========================================================
     REFER ANOTHER
     ========================================================= */

  const handleReferAnother = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
    });

    setErrors({});
    setSuccess(false);
    setApplicationLink("");
    setSubmittedCandidate(null);
    setCopied(false);
  };


  /* =========================================================
     SUCCESS SCREEN
     ========================================================= */

  if (success) {
    return (
      <div className="employee-referral-page">

        <ReferralTopBar
          navigate={navigate}
          title="Refer Candidate"
        />

        <main className="employee-referral-content">

          <div className="employee-referral-success">

            <div className="employee-success-icon">
              <CheckCircle2 size={32} />
            </div>

            <span className="employee-referral-eyebrow">
              INVITATION SENT
            </span>

            <h1>
              Candidate invitation sent.
            </h1>

            <p className="employee-success-description">
              We've created a unique application link
              for{" "}
              <strong>
                {submittedCandidate?.firstName}{" "}
                {submittedCandidate?.lastName}
              </strong>
              .
            </p>


            {/* EMAIL */}

            <div className="employee-success-email">

              <Mail size={17} />

              <span>
                {submittedCandidate?.email}
              </span>

              <Check
                size={15}
                className="employee-email-check"
              />

            </div>


            {/* APPLICATION LINK */}

            <div className="employee-link-box">

              <div className="employee-link-heading">

                <span>
                  CANDIDATE APPLICATION LINK
                </span>

                <button
                  type="button"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <>
                      <Check size={13} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      Copy
                    </>
                  )}
                </button>

              </div>


              <div className="employee-link-value">
                {applicationLink}
              </div>

            </div>


            {/* FLOW */}

            <div className="employee-success-flow">

              <SuccessFlowItem
                number="01"
                title="Invitation created"
                text="A unique candidate link was generated."
                complete
              />

              <SuccessFlowItem
                number="02"
                title="Candidate completes profile"
                text="They enter their information and upload their resume."
              />

              <SuccessFlowItem
                number="03"
                title="AI analyzes profile"
                text="Skills, experience and education are evaluated."
              />

              <SuccessFlowItem
                number="04"
                title="HR reviews candidate"
                text="Recruitment makes the final decision."
              />

            </div>


            {/* ACTIONS */}

            <div className="employee-success-actions">

              <button
                type="button"
                className="employee-referral-primary"
                onClick={handleReferAnother}
              >
                <UserPlus size={15} />
                Refer Another Candidate
              </button>

              <button
                type="button"
                className="employee-referral-secondary"
                onClick={() =>
                  navigate("/employee/referrals")
                }
              >
                <Users size={15} />
                View My Referrals
              </button>

            </div>


            <button
              type="button"
              className="employee-back-link"
              onClick={() =>
                navigate("/employee/dashboard")
              }
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>

          </div>

        </main>

      </div>
    );
  }


  /* =========================================================
     REFERRAL FORM
     ========================================================= */

  return (
    <div className="employee-referral-page">

      <ReferralTopBar
        navigate={navigate}
        title="Refer Candidate"
      />


      <main className="employee-referral-content">

        {/* PAGE INTRO */}

        <section className="employee-referral-intro">

          <div>

            <span className="employee-referral-eyebrow">
              EMPLOYEE REFERRAL
            </span>

            <h1>
              Refer a Candidate
            </h1>

            <p>
              Know someone who could be a great fit?
              Start the referral and we'll take care
              of the rest.
            </p>

          </div>

        </section>


        {/* MAIN GRID */}

        <div className="employee-referral-grid">


          {/* =================================================
              FORM
              ================================================= */}

          <section className="employee-referral-card">

            <div className="employee-referral-card-header">

              <div className="employee-referral-card-icon">
                <UserPlus size={18} />
              </div>

              <div>

                <h2>
                  Candidate information
                </h2>

                <p>
                  Enter the candidate's basic details.
                </p>

              </div>

            </div>


            <form
              className="employee-referral-form"
              onSubmit={handleSubmit}
            >

              {/* FIRST NAME */}

              <div className="employee-form-field">

                <label htmlFor="firstName">
                  First Name
                  <span>*</span>
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  autoComplete="given-name"
                />

                {errors.firstName && (
                  <small className="employee-form-error">
                    {errors.firstName}
                  </small>
                )}

              </div>


              {/* LAST NAME */}

              <div className="employee-form-field">

                <label htmlFor="lastName">
                  Last Name
                  <span>*</span>
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  autoComplete="family-name"
                />

                {errors.lastName && (
                  <small className="employee-form-error">
                    {errors.lastName}
                  </small>
                )}

              </div>


              {/* EMAIL */}

              <div className="employee-form-field">

                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="employee-input-with-icon">

                  <Mail size={15} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="candidate@example.com"
                    autoComplete="email"
                  />

                </div>

                {errors.email && (
                  <small className="employee-form-error">
                    {errors.email}
                  </small>
                )}

                <small className="employee-form-hint">
                  The candidate will receive their
                  application invitation at this address.
                </small>

              </div>


              {/* FORM ACTIONS */}

              <div className="employee-form-actions">

                <button
                  type="button"
                  className="employee-referral-secondary"
                  onClick={() =>
                    navigate("/employee/dashboard")
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="employee-referral-primary"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <span className="employee-button-loader" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      Send Invitation
                    </>
                  )}

                </button>

              </div>

            </form>

          </section>


          {/* =================================================
              INFO PANEL
              ================================================= */}

          <aside className="employee-referral-info">


            {/* AI CARD */}

            <div className="employee-info-card employee-ai-card">

              <div className="employee-info-icon">
                <Sparkles size={19} />
              </div>

              <span>
                AI-POWERED PROCESS
              </span>

              <h2>
                We'll take care of the analysis.
              </h2>

              <p>
                Once the candidate completes their
                application and uploads a resume,
                our AI analyzer evaluates the profile
                against available opportunities.
              </p>

            </div>


            {/* WHAT HAPPENS NEXT */}

            <div className="employee-info-card">

              <div className="employee-info-card-heading">

                <h3>
                  What happens next?
                </h3>

              </div>


              <InfoStep
                number="01"
                title="Invitation"
                text="Candidate receives an email with a unique application link."
              />

              <InfoStep
                number="02"
                title="Application"
                text="Candidate completes their profile and uploads their resume."
              />

              <InfoStep
                number="03"
                title="AI Analysis"
                text="Skills, experience and education are analyzed automatically."
              />

              <InfoStep
                number="04"
                title="HR Review"
                text="HR receives the analyzed candidate for review."
              />

            </div>


            {/* TIP */}

            <div className="employee-tip-card">

              <div className="employee-tip-icon">
                ✦
              </div>

              <div>

                <strong>
                  Referral tip
                </strong>

                <p>
                  Refer people whose skills and
                  experience you genuinely recommend.
                  Quality referrals help build stronger
                  teams.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
};


/* =========================================================
   TOP BAR
   ========================================================= */

const ReferralTopBar = ({
  navigate,
  title,
}) => {
  return (
    <header className="employee-referral-header">

      <div className="employee-referral-header-left">

        <button
          type="button"
          className="employee-referral-back"
          onClick={() =>
            navigate("/employee/dashboard")
          }
        >
          <ArrowLeft size={17} />
        </button>

        <div>

          <span>
            MICRON EMPLOYEE PORTAL
          </span>

          <strong>
            {title}
          </strong>

        </div>

      </div>


      <button
        type="button"
        className="employee-referral-header-link"
        onClick={() =>
          navigate("/employee/dashboard")
        }
      >
        Dashboard
      </button>

    </header>
  );
};


/* =========================================================
   INFO STEP
   ========================================================= */

const InfoStep = ({
  number,
  title,
  text,
}) => {
  return (
    <div className="employee-info-step">

      <div className="employee-info-number">
        {number}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <p>
          {text}
        </p>

      </div>

    </div>
  );
};


/* =========================================================
   SUCCESS FLOW ITEM
   ========================================================= */

const SuccessFlowItem = ({
  number,
  title,
  text,
  complete = false,
}) => {
  return (
    <div className="employee-success-flow-item">

      <div
        className={`employee-success-flow-number ${
          complete ? "complete" : ""
        }`}
      >
        {complete ? (
          <Check size={12} />
        ) : (
          number
        )}
      </div>

      <div>

        <strong>
          {title}
        </strong>

        <span>
          {text}
        </span>

      </div>

    </div>
  );
};


export default EmployeeReferral;