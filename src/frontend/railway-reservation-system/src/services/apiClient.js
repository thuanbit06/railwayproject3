const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

class ApiClient {
  async request(endpoint, options = {}) {
    const token = localStorage.getItem("railway_token");
    const res = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
  get(url) {
    return this.request(url);
  }
  post(url, body) {
    return this.request(url, { method: "POST", body: JSON.stringify(body) });
  }
  put(url, body) {
    return this.request(url, { method: "PUT", body: JSON.stringify(body) });
  }
}

export const apiClient = new ApiClient();
