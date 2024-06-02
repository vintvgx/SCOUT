import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { SentryItem } from "../../model/issue";
import { IssueErrorPayload, Project } from "../../model/project";
import format from "pretty-format";
import { Location, LocationData, SentryEvent } from "../../model/event";
import { RootState } from "../store";
// import * as Sentry from "@sentry/react-native";
import { DEFAULT_LOCATION } from "../../utils/constants";
import { requestThrottle } from "../../utils/throttleRequest";
import * as SecureStore from "expo-secure-store";

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

export const sentryDataSlice = createSlice({
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
    updateEventLocation: (
      state,
      action: PayloadAction<{
        projectId: string;
        eventId: string;
        location: Location;
      }>
    ) => {
      const { projectId, eventId, location } = action.payload;

      const project = state.projects.find((p) => p.id === projectId);
      if (project) {
        project.issues.forEach((issue: any) => {
          issue.events.forEach((event: any) => {
            if (event.id === eventId) {
              event.location = location;
            }
          });
        });
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
      console.log("Resetting loaded data for project:", action.payload);
      state.projects = state.projects.map((project) =>
        project.name === action.payload
          ? { ...project, isLoaded: false, issues: [], errors: [] }
          : project
      );
    },
    addNewIssueID: (state, action: PayloadAction<string[]>) => {
      const newIssueIDs = action.payload;
      state.newIssues = Array.from(
        new Set([...state.newIssues, ...newIssueIDs])
      );
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
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Existing cases for fetchSentryIssues
      .addCase(fetchSentryIssues.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSentryIssues.fulfilled, (state) => {
        // state.loading = false;
      })
      .addCase(fetchSentryIssues.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSentryIssuesWithLocation.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSentryIssuesWithLocation.fulfilled, (state) => {
        state.projects.map((project) => {
          project.isLoaded = true;
          project.lastUpdated = new Date().toISOString();
        });
      })
      .addCase(fetchSentryIssuesWithLocation.rejected, (state, action) => {
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
  updateEventLocation,
  resetLoadedData,
  clearNewIssue,
  clearNewIssues,
  setLoading,
} = sentryDataSlice.actions;

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
          serverStatus: "live",
          lastUpdated: new Date().toISOString(),
        })
      );
      return projectsWithIssuesAndErrors;
    } catch (error: any) {
      console.log(error);
      // Sentry.captureException(error);

      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk for fetching issues from Sentry
export const fetchSentryIssues = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("issues/fetchSentryIssues", async (projectName, thunkAPI) => {
  console.log("DISPATCHED: fetchSentryIssues for", projectName);

  // Get the current state
  const state = thunkAPI.getState() as RootState;

  // Retrieve the projects array from the state
  const projects: Project[] | undefined = state.issues.projects;

  // Find the index of the project with the given projectName
  const projectIndex = state.issues.projects.findIndex(
    (proj) => proj.name === projectName
  );

  // Check if project is already loaded and fetch if not
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
          const fetchedEvents = await Promise.all(
            eventActionResult.payload.events.map(async (event: SentryEvent) => {
              // Return the event with or without location data
              return event;
            })
          );

          // Attach the events with location data to the issue
          const issueWithEvents = {
            ...fetchedIssue,
            events: fetchedEvents,
          };

          // Dispatch action to add issue or error to the state
          if (fetchedIssue.level === "error") {
            thunkAPI.dispatch(
              sentryDataSlice.actions.addError({
                projectId: fetchedIssue.project.id,
                item: issueWithEvents,
              })
            );
          } else {
            thunkAPI.dispatch(
              sentryDataSlice.actions.addIssue({
                projectId: fetchedIssue.project.id,
                item: issueWithEvents,
              })
            );
          }
        }
      });

      const updatedProject = {
        ...state.issues.projects[projectIndex],
        lastUpdated: new Date().toISOString(),
        isLoaded: true,
      };
      await thunkAPI.dispatch(
        sentryDataSlice.actions.updateProject(updatedProject)
      );
      thunkAPI.dispatch(setLoading(false));
    } catch (error: any) {
      console.error(
        "Error fetching issues:",
        error.response?.data || error.message
      );
      // Sentry.captureException(error);
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  } else {
    console.log(`Issues for project ${projectName} already loaded`);
    thunkAPI.dispatch(setLoading(false));
  }
});

// Async thunk for fetching issues
export const fetchSentryIssuesWithLocation = createAsyncThunk<
  void, // Type for returned value
  string, // Type for projectName argument
  { rejectValue: string } // Type for thunkAPI (customize as needed)
>("issues/fetchSentryIssuesWithLocation", async (projectName, thunkAPI) => {
  console.log("DISPATCHED: fetchSentryIssuesWithLocation for ", projectName);

  // Get the current state
  const state = thunkAPI.getState() as RootState;

  // Retrieve the projects array from the state
  const projects: Project[] | undefined = state.issues.projects;

  const projectIndex = state.issues.projects.findIndex(
    (proj) => proj.name === projectName
  );

  // Find the project with the given projectName
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
                  fetchLocationFromIP(event.user.ip_address)
                );

                // Attach the location data to the event, successful or not
                event.location =
                  locationActionResult.payload as Location | null;
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
          if (fetchedIssue.level === "error") {
            thunkAPI.dispatch(
              sentryDataSlice.actions.addError({
                projectId: fetchedIssue.project.id,
                item: issueWithEvents,
              })
            );
          } else {
            thunkAPI.dispatch(
              sentryDataSlice.actions.addIssue({
                projectId: fetchedIssue.project.id,
                item: issueWithEvents,
              })
            );
          }
        }
      });

      // Set the project.isLoaded property to true
      const updatedProject = {
        ...state.issues.projects[projectIndex],
        isLoaded: true,
        lastUpdated: new Date().toISOString(),
      };
      await thunkAPI.dispatch(
        sentryDataSlice.actions.updateProject(updatedProject)
      );
      await thunkAPI.dispatch(setLoading(false));
    } catch (error: any) {
      console.error(
        "Error fetching issues:",
        error.response?.data || error.message
      );
      // Sentry.captureException(error);
      console.log(error);
      return thunkAPI.rejectWithValue(
        error.response?.data || "An error occurred"
      );
    }
  } else {
    console.log(`Issues for project ${projectName} already loaded`);
    thunkAPI.dispatch(setLoading(false));
  }
});

export const fetchArchivedSentryIssues = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("issues/fetchArchivedSentryIssues", async (projectName, thunkAPI) => {
  console.log("DISPATCHED: fetchArchivedSentryIssues for", projectName);

  const state = thunkAPI.getState() as RootState;

  const projectIndex = state.issues.projects.findIndex(
    (proj) => proj.name === projectName
  );

  if (state.issues.projects[projectIndex].archivesFetched) {
    console.log("Archived issues already fetched for project", projectName);
    return;
  }

  try {
    const response = await axios.get(
      `https://sentry.io/api/0/projects/communite/${projectName}/issues/?scope=archived`,
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );

    response.data.forEach(async (fetchedIssue: SentryItem) => {
      const eventActionResult = await thunkAPI.dispatch(
        fetchEvent({
          issueId: fetchedIssue.id,
          projectId: fetchedIssue.project.id,
        })
      );

      if (fetchEvent.fulfilled.match(eventActionResult)) {
        const eventsWithLocation = await Promise.all(
          eventActionResult.payload.events.map(async (event: SentryEvent) => {
            if (event.user?.ip_address) {
              const locationActionResult = await thunkAPI.dispatch(
                fetchLocationFromIP(event.user.ip_address)
              );

              if (fetchLocationFromIP.fulfilled.match(locationActionResult)) {
                event.location = {
                  ...locationActionResult.payload,
                  status: "success",
                };
              } else {
                console.error(
                  "Failed to fetch location for event user IP:",
                  locationActionResult.error
                );

                // Sentry.captureException(locationActionResult.error);
              }
            }
            return event;
          })
        );

        const issueWithEvents = {
          ...fetchedIssue,
          events: eventsWithLocation,
        };

        if (fetchedIssue.level === "error") {
          thunkAPI.dispatch(
            sentryDataSlice.actions.addError({
              projectId: fetchedIssue.project.id,
              item: issueWithEvents,
            })
          );
        } else {
          thunkAPI.dispatch(
            sentryDataSlice.actions.addIssue({
              projectId: fetchedIssue.project.id,
              item: issueWithEvents,
            })
          );
        }
      }
    });

    const updatedProject = {
      ...state.issues.projects[projectIndex],
      archivesFetched: true,
    };
    await thunkAPI.dispatch(
      sentryDataSlice.actions.updateProject(updatedProject)
    );
  } catch (error: any) {
    console.error(
      "Error fetching archived issues:",
      error.response?.data || error.message
    );
    // Sentry.captureException(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "An error occurred"
    );
  }
});

export const archiveSentryIssue = createAsyncThunk<
  void,
  { issueId: string; projectName: string },
  { rejectValue: string }
>("issues/archiveSentryIssue", async ({ issueId, projectName }, thunkAPI) => {
  console.log("DISPATCHED: archiveSentryIssue for", issueId);

  try {
    const response = await axios.put(
      `https://sentry.io/api/0/organizations/communite/issues/${issueId}/`,
      {
        status: "resolved",
      },
      {
        headers: {
          Authorization:
            "Bearer 6e639307dff6ddc655a74d16f040d9e88c29ea9c151bc60b7ee5f819b19252b4",
        },
      }
    );

    console.log("Archived issue:", issueId);
  } catch (error: any) {
    console.error(
      "Error archiving issue:",
      error.response?.data || error.message
    );
    // Sentry.captureException(error);
    return thunkAPI.rejectWithValue(
      error.response?.data || "An error occurred while archiving issue"
    );
  }
});

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
      return { issueId, events: response.data };
    } catch (error: any) {
      // Sentry.captureException(error);
      console.log(error);

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

export const fetchLocationFromIP = createAsyncThunk<Location, string>(
  "issues/IP_API_fetchLocation",
  async (ipAddress: string, { rejectWithValue }) => {
    const fetchLocation = async () => {
      try {
        // First, attempt to get the location from the Secure Store
        const cachedLocation = await SecureStore.getItemAsync(ipAddress);
        if (cachedLocation) {
          // console.log("Using cached location data for IP:", ipAddress);
          return JSON.parse(cachedLocation);
        }

        const response = await axios.get(
          `https://ipgeolocation.abstractapi.com/v1/?api_key=58d5c114755a4ac287efb175ded901cf&ip_address=${ipAddress}`
        );
        if (response.status === 200) {
          await SecureStore.setItemAsync(
            ipAddress,
            JSON.stringify(response.data)
          );
          console.log("Saved to SecureStore: ", ipAddress);
          return response.data;
        } else {
          throw new Error(
            `Failed fetched data for ${ipAddress}: ${response.status}`
          );
        }
      } catch (error: any) {
        console.log("Using default location data due to error:", error.message);
        return rejectWithValue(DEFAULT_LOCATION);
      }
    };

    return new Promise((resolve, reject) => {
      requestThrottle.addToQueue(() =>
        fetchLocation().then(resolve).catch(reject)
      );
    });
  }
);

export default sentryDataSlice.reducer;
