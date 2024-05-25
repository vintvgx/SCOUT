import { SentryItem } from "./issue";

export interface Project {
  id: string;
  name: string;
  slug: string;
  platform: string;
  serverStatus?: string | "live" | "down";
  errors: SentryItem[];
  issues: SentryItem[];
  archivesFetched: boolean;
  isLoaded: boolean;
  lastUpdated: string;
}

export interface IssueErrorPayload {
  projectId: string;
  item: SentryItem; // Assuming you're adding one issue/error at a time
}
