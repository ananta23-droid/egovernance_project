const TOKEN_KEY = "sewabot_token";
const USER_KEY = "sewabot_user";
const AUTH_EVENT = "sewabot-auth-change";

const readJSON = (value) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const emitChange = () => {
  window.dispatchEvent(new Event(AUTH_EVENT));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => readJSON(localStorage.getItem(USER_KEY));

export const isAuthenticated = () => Boolean(getToken());

export const setAuth = ({ token, user }) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }

  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_KEY);
  }

  emitChange();
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  emitChange();
};

export const onAuthChange = (handler) => {
  window.addEventListener(AUTH_EVENT, handler);
  window.addEventListener("storage", handler);

  return () => {
    window.removeEventListener(AUTH_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
};