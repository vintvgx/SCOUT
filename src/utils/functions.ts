import axios from "axios";
import { format as prettyFormat } from "pretty-format";

export const fetchIssues = async (
  setRefreshing: (value: boolean) => void,
  setIssues: (data: any) => void,
  setError: (message: string) => void
) => {
  setRefreshing(true); // Enable the refreshing indicator
  try {
    const response = await axios.get(
      "https://sentry.io/api/0/projects/communite/portfolio/issues/",
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );
    setIssues(response.data);
    console.log("🚀 ~ fetchIssues ~ data:", prettyFormat(response.data));
  } catch (err: any) {
    setError(err.message);
    console.error(err.message);
  } finally {
    setRefreshing(false); // Disable the refreshing indicator
  }
};

export const fetchProjects = async (
  setProjects: (data: any) => void,
  setError: (message: string) => void
) => {
  try {
    const response = await axios.get(
      "https://sentry.io/api/0/organizations/communite/projects/",
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );
    setProjects(response.data);
    console.log("Projects:", prettyFormat(response.data));
  } catch (err: any) {
    setError(err.message);
    console.error("GET Projects err:", err.message);
  }
};
