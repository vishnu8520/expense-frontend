import { API_URL } from "./config";

const buildRequestConfig = (method, body) => {
  const config = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

const request = async (path, options = {}) => {
  const response = await fetch(`${API_URL}${path}`, options);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};

export const expenseApi = {
  getByMonth: (month) => request(`/expenses?month=${month}`),
  create: (payload) => request("/expenses", buildRequestConfig("POST", payload)),
  update: (id, payload) => request(`/expenses/${id}`, buildRequestConfig("PUT", payload)),
  remove: (id) => request(`/expenses/${id}`, buildRequestConfig("DELETE")),
};

export const dailyExpenseApi = {
  getByMonth: (month) => request(`/daily-expenses?month=${month}`),
  updateTarget: (month, payload) =>
    request(`/daily-expenses/${month}/target`, buildRequestConfig("PUT", payload)),
  createEntry: (month, payload) =>
    request(`/daily-expenses/${month}/entries`, buildRequestConfig("POST", payload)),
  updateEntry: (month, entryId, payload) =>
    request(`/daily-expenses/${month}/entries/${entryId}`, buildRequestConfig("PUT", payload)),
  removeEntry: (month, entryId) =>
    request(`/daily-expenses/${month}/entries/${entryId}`, buildRequestConfig("DELETE")),
};

export const reportApi = {
  getByMonth: (month) => request(`/reports/${month}`),
};
