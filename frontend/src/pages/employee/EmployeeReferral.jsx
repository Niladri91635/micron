import { useState } from "react";
import { ArrowLeft, CheckCircle2, Mail, Send, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

import apiClient from "../../services/apiClients";
import { getEmployeeSession } from "../../services/auth";

import "./EmployeeReferral.css";


const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
};


function EmployeeReferral() {
  const navigate = useNavigate();
  const employee = getEmployeeSession();

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({
    type: "",
    text: "",
  });

  const [submitting, setSubmitting] = useState(false);


  /* =====================================================
     HANDLE INPUT
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setStatus({
      type: "",
      text: "",
    });
  };


  /* =====================================================
     VALIDATION
  ===================================================== */

  const validate = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName) {
      return "Candidate first name is required.";
    }

    if (!lastName) {
      return "Candidate last name is required.";
    }

    if (!email) {
      return "Candidate email is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address.";
    }

    return "";
  };


  /* =====================================================
     SEND INVITATION
  ===================================================== */

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!employee) {
      navigate("/employee/login", {
        replace: true,
      });

      return;
    }

    const validationError = validate();

    if (validationError) {
      setStatus({
        type: "error",
        text: validationError,
      });

      return;
    }

    setSubmitting(true);

    const candidate = {
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim().toLowerCase(),
    };


    try {

      /*
       * Backend endpoint.
       *
       * The backend should:
       * 1. Create referral
       * 2. Generate unique candidate token
       * 3. Generate application link
       * 4. Send invitation email
       */

      const response = await apiClient.post(
        "/referrals/invite",
        {
          employeeId: employee.employeeId,
          candidateFirstName: candidate.firstName,
          candidateLastName: candidate.lastName,
          candidateEmail: candidate.email,
        }
      );


      /*
       * Save referral locally as a temporary
       * frontend fallback/demo record.
       */

      const applicationLink =
        response?.data?.applicationLink ||
        `${window.location.origin}/candidate/apply/demo-${Date.now()}`;


      const referral = {
        id:
          response?.data?.referralId ||
          `REF-${Date.now()}`,

        candidateId:
          response?.data?.candidateId ||
          `CAND-${Date.now()}`,

        firstName: candidate.firstName,
        lastName: candidate.lastName,
        candidateName:
          `${candidate.firstName} ${candidate.lastName}`,

        email: candidate.email,

        candidateEmail: candidate.email,

        applicationLink,

        status: "INVITED",

        createdAt: new Date().toISOString(),

        stages: {
          referred: true,
          invited: true,
          submitted: false,
          aiReview: false,
          hrReview: false,
        },
      };


      saveReferral(referral);


      setStatus({
        type: "success",
        text:
          "Invitation sent successfully. The candidate can now complete their application using the unique link sent to their email.",
      });

      setForm(initialForm);

    } catch (error) {

      /*
       * During frontend development the backend may not
       * be running yet.
       *
       * We create a local demo referral so the complete
       * employee flow can still be demonstrated.
       */

      const applicationLink =
        `${window.location.origin}/candidate/apply/demo-${Date.now()}`;


      const referral = {
        id: `REF-${Date.now()}`,

        candidateId: `CAND-${Date.now()}`,

        firstName: candidate.firstName,
        lastName: candidate.lastName,

        candidateName:
          `${candidate.firstName} ${candidate.lastName}`,

        email: candidate.email,
        candidateEmail: candidate.email,

        applicationLink,

        status: "INVITED",

        createdAt: new Date().toISOString(),

        stages: {
          referred: true,
          invited: true,
          submitted: false,
          aiReview: false,
          hrReview: false,
        },
      };


      saveReferral(referral);


      setStatus({
        type: "success",
        text:
          "Referral created successfully. The invitation will be sent when the backend email service is connected.",
      });

      setForm(initialForm);

      console.log(
        "Referral API unavailable:",
        error
      );
    } finally {
      setSubmitting(false);
    }
  };


  /* =====================================================
     SAVE REFERRAL
  ===================================================== */

  const saveReferral = (referral) => {
    try {
      const existing = JSON.parse(
        localStorage.getItem(
          "micronEmployeeReferrals"
        ) || "[]"
      );

      localStorage.setItem(
        "micronEmployeeReferrals",
        JSON.stringify([
          referral,
          ...existing,
        ])
      );

    } catch (error) {
      console.error(
        "Unable to save referral:",
        error
      );
    }
  };


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <div className="employee-referral-page">

      {/* HEADER */}

      <header className="employee-referral-header">

        <div className="employee-referral-header-left">

          <button
            type="button"
            className="employee-referral-back"
            onClick={() =>
              navigate("/employee/dashboard")
            }
          >
            <ArrowLeft size={16} />
          </button>

          <div>
            <span>EMPLOYEE PORTAL</span>
            <strong>Refer Candidate</strong>
          </div>

        </div>


        <button
          type="button"
          className="employee-referral-dashboard-link"
          onClick={() =>
            navigate("/employee/dashboard")
          }
        >
          Dashboard
        </button>

      </header>


      {/* CONTENT */}

      <main className="employee-referral-content">

        {/* INTRO */}

        <section className="employee-referral-intro">

          <span>
            EMPLOYEE REFERRAL
          </span>

          <h1>
            Refer a Candidate
          </h1>

          <p>
            Enter the candidate's basic details.
            We'll create an invitation so they can
            complete their application.
          </p>

        </section>


        {/* LAYOUT */}

        <div className="employee-referral-layout">


          {/* FORM */}

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
                  All fields are required.
                </p>

              </div>

            </div>


            {/* STATUS */}

            {status.text && (
              <div
                className={`employee-referral-message ${status.type}`}
              >

                {status.type === "success" && (
                  <CheckCircle2 size={17} />
                )}

                <span>
                  {status.text}
                </span>

              </div>
            )}


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
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  autoComplete="given-name"
                />

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
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  autoComplete="family-name"
                />

              </div>


              {/* EMAIL */}

              <div className="employee-form-field">

                <label htmlFor="email">
                  Email Address
                  <span>*</span>
                </label>

                <div className="employee-email-input">

                  <Mail size={16} />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="candidate@example.com"
                    autoComplete="email"
                  />

                </div>

                <small>
                  The invitation will be sent to this
                  email address.
                </small>

              </div>


              {/* ACTIONS */}

              <div className="employee-referral-actions">

                <button
                  type="button"
                  className="employee-referral-cancel"
                  onClick={() =>
                    navigate("/employee/dashboard")
                  }
                  disabled={submitting}
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="employee-referral-submit"
                  disabled={submitting}
                >

                  {submitting ? (
                    <>
                      <span className="employee-referral-spinner" />
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


          {/* INFORMATION */}

          <aside className="employee-referral-side">


            <div className="employee-referral-info-card">

              <div className="employee-referral-info-icon">
                <Mail size={18} />
              </div>

              <span>
                INVITATION PROCESS
              </span>

              <h2>
                You only provide the basics.
              </h2>

              <p>
                The candidate will receive an email
                with a unique application link.
              </p>

            </div>


            <div className="employee-referral-info-card">

              <h3>
                What happens next?
              </h3>


              <div className="employee-referral-step">

                <b>01</b>

                <div>
                  <strong>
                    Invitation
                  </strong>

                  <p>
                    Candidate receives an email.
                  </p>
                </div>

              </div>


              <div className="employee-referral-step">

                <b>02</b>

                <div>
                  <strong>
                    Application
                  </strong>

                  <p>
                    Candidate completes their profile.
                  </p>
                </div>

              </div>


              <div className="employee-referral-step">

                <b>03</b>

                <div>
                  <strong>
                    Resume
                  </strong>

                  <p>
                    Candidate uploads their resume.
                  </p>
                </div>

              </div>


              <div className="employee-referral-step">

                <b>04</b>

                <div>
                  <strong>
                    AI Analysis
                  </strong>

                  <p>
                    AI analyzes the candidate profile.
                  </p>
                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

    </div>
  );
}


export default EmployeeReferral;