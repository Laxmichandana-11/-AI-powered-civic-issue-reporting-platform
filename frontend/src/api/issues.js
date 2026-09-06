import api from "./axios";


export const getIssues = () => api.get("/issues");


export const getIssueById = (id) => api.get(`/issues/${id}`);

export const createIssue = (formData) =>
  api.post("/issues", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default {
  getIssues,
  getIssueById,
  createIssue,
};
