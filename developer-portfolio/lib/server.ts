import axios from "axios";

export const API_BASE_URL = "http://localhost:3001";

export const API_ROUTES = {
  AUTH: `${API_BASE_URL}/api/auth`,
  PROJECT: `${API_BASE_URL}/api/projects`,
  BLOG: `${API_BASE_URL}/api/blogs`,
  COMMENT: `${API_BASE_URL}/api/comments`,
};

