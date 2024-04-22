import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SentryItem } from "../../model/issue";
import { IssueErrorPayload, Project } from "../../model/project";
import format from "pretty-format";
import { LocationData, SentryEvent } from "../../model/event";
import { RootState } from "../store";
import * as Sentry from "@sentry/react-native";

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

  const projectIndex = state.issues.projects.findIndex(
    (proj) => proj.name === projectName
  );

  console.log("🚀 ~ FETCHING ISSUES INVOKED: ", projectName);

  // Find the project with the given projectName
  const project: Project | undefined = projects?.find(
    (proj) => proj.name === projectName
  );

  if (projectIndex !== -1 && !state.issues.projects[projectIndex].isLoaded) {
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
      response.data.forEach(async (fetchedIssue: SentryItem) => {
        // Fetch event data using issue id and the project id
        const eventActionResult = await thunkAPI.dispatch(
          fetchEvent({
            issueId: fetchedIssue.id,
            projectId: fetchedIssue.project.id,
          })
        );

        // If the fetchEvent action was successful, process the events
        if (fetchEvent.fulfilled.match(eventActionResult)) {
          // Process each event to fetch location data
          const eventsWithLocation = await Promise.all(
            eventActionResult.payload.events.map(async (event: SentryEvent) => {
              if (event.user?.ip_address) {
                // Dispatch fetchLocationForIP and wait for the result
                const locationActionResult = await thunkAPI.dispatch(
                  IP_API_fetchLocation(event.user.ip_address)
                );
                console.log(
                  "🚀 ~ eventActionResult.payload.events.map ~ locationActionResult:",
                  locationActionResult
                );

                // If the fetchLocationForIP action was successful, attach the location data to the event
                if (
                  IP_API_fetchLocation.fulfilled.match(locationActionResult)
                ) {
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
          const issueWithEvents = {
            ...fetchedIssue,
            events: eventsWithLocation,
          };

          // Dispatch action to add issue or error to the state
          try {
            if (fetchedIssue.level === "error") {
              thunkAPI.dispatch(
                issuesSlice.actions.addError({
                  projectId: fetchedIssue.project.id,
                  item: issueWithEvents,
                })
              );
            } else {
              thunkAPI.dispatch(
                issuesSlice.actions.addIssue({
                  projectId: fetchedIssue.project.id,
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
      const updatedProject = {
        ...state.issues.projects[projectIndex],
        isLoaded: true,
      };
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
      Sentry.captureException(error);
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
      Sentry.captureException(error);

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
      Sentry.captureException(error);

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

export const fetchRadarLocationForIP = createAsyncThunk(
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
      console.log("🚀 ~ response:", format(response));

      if (!response.ok) {
        throw new Error(
          `Failed to fetch location with status: ${response.status}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Error data:", error.response.data);
          console.error("Status code:", error.response.status);
          console.error("Headers:", error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error message:", error.message);
        }
      } else {
        console.error("Error", error);
      }
    }
  }
);

export const IP_API_fetchLocation = createAsyncThunk(
  "issues/IP_API_fetchLocation",
  async (ipAddress: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://ip-api.com/json/${ipAddress}`);
      console.log("🚀 ~ IP_API_fetchLocation response:", format(response.data));

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to fetch location: ${response.status}`);
      }
    } catch (error: any) {
      Sentry.captureException(error);

      return rejectWithValue(
        error.message || "Failed to fetch location for IP"
      );
    }
  }
);

export default issuesSlice.reducer;
