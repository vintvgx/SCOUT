import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SentryItem } from "../../model/issue";
import { IssueErrorPayload, Project } from "../../model/project";
import format from "pretty-format";
import { LocationData, SentryEvent } from "../../model/event";
import { RootState } from "../store";

interface ProjectsState {
  // data: { errors: SentryIssue[]; issues: SentryIssue[] };
  projects: Project[];
  loading: boolean;
  projectsLoading: boolean;
  error: string | null;
  projectsError: any;
  newIssues: string[];
}

const initialState: ProjectsState = {
  // data: { errors: [], issues: [] },
  projects: [],
  loading: false,
  projectsLoading: false,
  error: null,
  projectsError: null,
  newIssues: [],
};

const projectUrls: { [key: string]: string } = {
  "urban-ai": "https://urbanai.info",
  portfolio: "https://kareemsaygbe.dev",
  vournal: "https://vournal-b93307c9ab1a.herokuapp.com",
};

const issuesSlice = createSlice({
  name: "issues",
  initialState,
  reducers: {
    addIssue: (state, action: PayloadAction<IssueErrorPayload>) => {
      const { projectId, item } = action.payload;
      const project = state.projects.find(
        (project) => project.id === projectId
      );

      if (project) {
        project.issues.push(item);
      }
    },
    addError: (state, action: PayloadAction<IssueErrorPayload>) => {
      const { projectId, item } = action.payload;
      const project = state.projects.find(
        (project) => project.id === projectId
      );
      if (project) {
        project.errors.push(item);
      }
    },
    updateProject: (state, action: PayloadAction<Project>) => {
      const { payload } = action;
      return {
        ...state,
        projects: state.projects.map((project) =>
          project.id === payload.id ? payload : project
        ),
      };
    },
    clearData: (state) => {
      state.projects.forEach((project) => {
        project.errors = [];
        project.issues = [];
      });
    },
    resetLoadedData: (state, action: PayloadAction<string>) => {
      state.projects = state.projects.map((project) =>
        project.name === action.payload
          ? { ...project, isLoaded: false, issues: [], errors: [] }
          : project
      );
    },
    addNewIssueID: (state, action: PayloadAction<string[]>) => {
      // Ensure no duplicates
      const newIssueIDs = action.payload;
      newIssueIDs.forEach((id) => {
        if (!state.newIssues.includes(id)) {
          state.newIssues.push(id);
        }
      });
    },
    clearNewIssue: (state, action: PayloadAction<string>) => {
      const issueIdToRemove = action.payload;
      state.newIssues = state.newIssues.filter(
        (issueId) => issueId !== issueIdToRemove
      );
    },
    clearNewIssues: (state) => {
      state.newIssues = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases for fetchIssues
      .addCase(fetchIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIssues.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchProjects.pending, (state) => {
        state.projectsLoading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.projects = action.payload;
        state.projectsLoading = false;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.projectsLoading = false;
        state.projectsError = action.payload;
      })
      .addCase(checkServerStatus.fulfilled, (state, action) => {
        state.projects = action.payload;
      });
  },
});

export const {
  addIssue,
  addError,
  updateProject,
  clearData,
  addNewIssueID,
  resetLoadedData,
  clearNewIssue,
  clearNewIssues,
} = issuesSlice.actions;

// Async thunk for fetching issues
export const fetchIssues = createAsyncThunk<
  void, // Type for returned value
  string, // Type for projectName argument
  { rejectValue: string } // Type for thunkAPI (customize as needed)
>("issues/fetchIssues", async (projectName, thunkAPI) => {
  // Get the current state
  const state = thunkAPI.getState() as RootState;

  // Retrieve the projects array from the state
  const projects: Project[] | undefined = state.issues.projects;

  console.log("🚀 ~ FETCHING ISSUES INVOKED: ", projectName);

  // Find the project with the given projectName
  const project: Project | undefined = projects?.find(
    (proj) => proj.name === projectName
  );

  if (project && !project.isLoaded) {
    console.log(
      "🚀 ~ file: ProjectsSlice.ts ~ FETCHING ISSUES FOR project:",
      project
    );

    try {
      // fetch project issues
      const response = await axios.get(
        `https://sentry.io/api/0/projects/communite/${projectName}/issues/`,
        {
          headers: {
            Authorization:
              "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
          },
        }
      );

      // Sequentially fetch events for each issue and attach location data
      response.data.forEach(async (issue: SentryItem) => {
        // Fetch event data using issue id and the project id
        const eventActionResult = await thunkAPI.dispatch(
          fetchEvent({ issueId: issue.id, projectId: issue.project.id })
        );

        // If the fetchEvent action was successful, process the events
        if (fetchEvent.fulfilled.match(eventActionResult)) {
          // Process each event to fetch location data
          const eventsWithLocation = await Promise.all(
            eventActionResult.payload.events.map(async (event: SentryEvent) => {
              if (event.user?.ip_address) {
                // Dispatch fetchLocationForIP and wait for the result
                const locationActionResult = await thunkAPI.dispatch(
                  fetchLocationForIP(event.user.ip_address)
                );

                // If the fetchLocationForIP action was successful, attach the location data to the event
                if (fetchLocationForIP.fulfilled.match(locationActionResult)) {
                  event.location = locationActionResult.payload;
                } else {
                  console.error(
                    "Failed to fetch location for event user IP:",
                    locationActionResult.error
                  );
                }
              }
              // Return the event with or without location data
              return event;
            })
          );

          // Attach the events with location data to the issue
          const issueWithEvents = { ...issue, events: eventsWithLocation };

          // Dispatch action to add issue or error to the state
          try {
            if (issue.level === "error") {
              thunkAPI.dispatch(
                issuesSlice.actions.addError({
                  projectId: issue.project.id,
                  item: issueWithEvents,
                })
              );
            } else {
              thunkAPI.dispatch(
                issuesSlice.actions.addIssue({
                  projectId: issue.project.id,
                  item: issueWithEvents,
                })
              );
            }
          } catch (e) {
            console.log(e);
          }
        }
      });

      // Set the project.isLoaded property to true
      const updatedProject = { ...project, isLoaded: true };
      await thunkAPI.dispatch(
        issuesSlice.actions.updateProject(updatedProject)
      );

      // console.log("Project updated:", format(updatedProject));

      // No need to return a payload as we're updating the state incrementally
    } catch (error: any) {
      console.error(
        "Error fetching issues:",
        error.response?.data || error.message
      );
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  } else {
    console.log("Project already loaded");
  }
});

export const fetchProjects = createAsyncThunk(
  "issues/fetchProjects",
  async (_, { rejectWithValue }) => {
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

      const projectsWithIssuesAndErrors = response.data.map(
        (project: { issues: any; errors: any }) => ({
          ...project,
          issues: project.issues || [],
          errors: project.errors || [],
          isLoaded: false,
        })
      );
      return projectsWithIssuesAndErrors;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchEvent = createAsyncThunk(
  "issues/fetchEvent",
  async (
    { issueId, projectId }: { issueId: string; projectId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(
        `https://sentry.io/api/0/organizations/communite/issues/${issueId}/events/`,
        {
          headers: {
            Authorization:
              "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
          },
        }
      );
      // console.log("🚀 ~ response:", format(response.data));
      // console.log("EVENTS:", { issueId, events: response.data });

      return { issueId, events: response.data };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "An error occurred while fetching events"
      );
    }
  }
);

export const checkServerStatus = createAsyncThunk(
  "issues/checkServerStatus",
  async (projects: Project[], { rejectWithValue }) => {
    try {
      const updatedProjects = await Promise.all(
        projects.map(async (project) => {
          // const url = projectUrls[project.name];
          // if (!url) {
          //   return { ...project, serverStatus: "down" }; // Mark as down if URL not found
          // }
          // try {
          //   await axios.get(url);
          return { ...project, serverStatus: "live" };
          // } catch {
          //   return { ...project, serverStatus: "down" };
          // }
        })
      );
      return updatedProjects;
    } catch (error: any) {
      return rejectWithValue("Failed to check server status");
    }
  }
);

export const fetchLocationForIP = createAsyncThunk(
  "issues/fetchLocationForIP",
  async (ipAddress: string, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://api.radar.io/v1/geocode/ip?ip=${ipAddress}`,
        {
          method: "GET",
          headers: {
            Authorization:
              "prj_live_pk_feab46e3a831493a7a49d3294834b276bf5fd7b1",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error("Failed to fetch location");
      }
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to fetch location for IP"
      );
    }
  }
);

export default issuesSlice.reducer;
