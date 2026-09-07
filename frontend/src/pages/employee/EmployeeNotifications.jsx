import { useState } from "react";
import {
  Bell,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Mail,
  Sparkles,
  UserCheck,
} from "lucide-react";

import "./EmployeeNotifications.css";

function EmployeeNotifications() {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "referral",
      title: "Welcome to the Employee Referral Portal",
      message:
        "You can now refer talented people from your professional network directly through the portal.",
      time: "Just now",
      unread: true,
    },
    {
      id: 2,
      type: "ai",
      title: "AI-powered candidate matching",
      message:
        "Once a referred candidate submits their resume, the AI analyzer will evaluate their profile against available opportunities.",
      time: "Today",
      unread: true,
    },
    {
      id: 3,
      type: "system",
      title: "Your employee account is active",
      message:
        "Your employee account has been successfully created and verified.",
      time: "Today",
      unread: false,
    },
  ]);

  const unreadCount = notifications.filter(
    (item) => item.unread
  ).length;

  const markAllRead = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      }))
    );
  };

  const getIcon = (type) => {
    if (type === "ai") {
      return <Sparkles size={19} />;
    }

    if (type === "referral") {
      return <UserCheck size={19} />;
    }

    return <CheckCircle2 size={19} />;
  };

  return (
    <div className="notifications-page">

      <div className="notifications-content">

        <header className="notifications-page-header">

          <div>
            <span className="notifications-eyebrow">
              ACTIVITY CENTER
            </span>

            <h1>Notifications</h1>

            <p>
              Stay updated on your referrals and employee portal activity.
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-read-button"
              onClick={markAllRead}
            >
              <CheckCircle2 size={16} />
              Mark all as read
            </button>
          )}

        </header>

        <section className="notifications-summary">

          <div className="notification-summary-item">
            <div className="notification-summary-icon blue">
              <Bell size={18} />
            </div>

            <div>
              <strong>{notifications.length}</strong>
              <span>Total notifications</span>
            </div>
          </div>

          <div className="notification-summary-item">
            <div className="notification-summary-icon amber">
              <Mail size={18} />
            </div>

            <div>
              <strong>{unreadCount}</strong>
              <span>Unread notifications</span>
            </div>
          </div>

          <div className="notification-summary-item">
            <div className="notification-summary-icon green">
              <Clock3 size={18} />
            </div>

            <div>
              <strong>Live</strong>
              <span>Activity updates</span>
            </div>
          </div>

        </section>

        <section className="notification-list-panel">

          <div className="notification-list-header">
            <div>
              <span>YOUR ACTIVITY</span>
              <h2>Recent notifications</h2>
            </div>

            <span className="notification-count">
              {unreadCount} unread
            </span>
          </div>

          <div className="notification-list">

            {notifications.map((notification) => (
              <article
                key={notification.id}
                className={`notification-row ${
                  notification.unread ? "unread" : ""
                }`}
              >

                <div className="notification-row-icon">
                  {getIcon(notification.type)}
                </div>

                <div className="notification-row-content">

                  <div className="notification-title">
                    <h3>{notification.title}</h3>

                    {notification.unread && (
                      <span className="new-pill">
                        NEW
                      </span>
                    )}
                  </div>

                  <p>{notification.message}</p>

                  <div className="notification-meta">
                    <Clock3 size={12} />
                    {notification.time}
                  </div>

                </div>

                <ChevronRight
                  className="notification-chevron"
                  size={18}
                />

              </article>
            ))}

          </div>

        </section>

        <section className="notification-info">

          <div className="notification-info-icon">
            <Bell size={19} />
          </div>

          <div>
            <h3>Important referral updates</h3>

            <p>
              You'll receive notifications when meaningful activity
              occurs on candidates you've referred.
            </p>
          </div>

        </section>

      </div>
    </div>
  );
}

export default EmployeeNotifications;