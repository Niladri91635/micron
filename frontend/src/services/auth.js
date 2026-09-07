const EMPLOYEE_SESSION_KEY = "micronLoggedInEmployee";
const HR_SESSION_KEY = "micronLoggedInHR";
const DEMO_EMPLOYEE_KEY = "micronEmployeeAccount";
const DEMO_HR_KEY = "micronHRAccount";

function readJson(key) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

export function getEmployeeSession() {
  return readJson(EMPLOYEE_SESSION_KEY);
}

export function getHRSession() {
  return readJson(HR_SESSION_KEY);
}

export function isEmployeeAuthenticated() {
  return Boolean(getEmployeeSession());
}

export function isHRAuthenticated() {
  return Boolean(getHRSession());
}

export function setEmployeeSession(employee) {
  localStorage.setItem(EMPLOYEE_SESSION_KEY, JSON.stringify(employee));
}

export function setHRSession(hr) {
  localStorage.setItem(HR_SESSION_KEY, JSON.stringify(hr));
}

export function clearEmployeeSession() {
  localStorage.removeItem(EMPLOYEE_SESSION_KEY);
  localStorage.removeItem("micronAuthToken");
}

export function clearHRSession() {
  localStorage.removeItem(HR_SESSION_KEY);
  localStorage.removeItem("micronAuthToken");
}

export function getDemoEmployeeAccount() {
  return readJson(DEMO_EMPLOYEE_KEY);
}

export function saveDemoEmployeeAccount(account) {
  localStorage.setItem(DEMO_EMPLOYEE_KEY, JSON.stringify(account));
}

export function getDemoHRAccount() {
  return readJson(DEMO_HR_KEY);
}

export function saveDemoHRAccount(account) {
  localStorage.setItem(DEMO_HR_KEY, JSON.stringify(account));
}

// Demo-only password hashing. Production authentication must be handled by the backend.
export async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}
