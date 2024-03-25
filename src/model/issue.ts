import { SentryEvent } from "./event";

export interface SentryIssue {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  firstSeen: string;
  lastSeen: string;
  count: string;
  userCount: number;
  level: string;
  status: string;
  isPublic: boolean;
  isBookmarked: boolean;
  isSubscribed: boolean;
  hasSeen: boolean;
  annotations: Array<any>;
  assignedTo: null | object;
  project: {
    id: string;
    name: string;
    slug: string;
    platform: string;
  };
  permalink: string;
}

export interface SentryItem {
  annotations: any[]; // Adjust the `any` type based on what `annotations` actually contains
  assignedTo: null | string; // Assuming assignedTo can be a string if it's not null
  count: string;
  culprit: string;
  firstSeen: string;
  hasSeen: boolean;
  id: string;
  isBookmarked: boolean;
  isPublic: boolean;
  isSubscribed: boolean;
  isUnhandled: boolean;
  issueCategory: string;
  issueType: string;
  lastSeen: string;
  level: string;
  logger: null | string; // Assuming logger can be a string if it's not null
  metadata: {
    initial_priority: number;
    sdk: {
      name: string;
      name_normalized: string;
    };
    title: string;
  };
  numComments: number;
  permalink: string;
  platform: string;
  priority: string;
  priorityLockedAt: null | string; // Adjust if there's a specific type for dates other than string
  project: {
    id: string;
    name: string;
    platform: string;
    slug: string;
  };
  shareId: null | string; // Assuming shareId can be a string if it's not null
  shortId: string;
  stats: {
    "24h": Array<[number, number]>; // Assuming this structure from the provided example
  };
  status: string;
  statusDetails: object; // This could be more specific based on actual contents
  subscriptionDetails: null | object; // This could be more specific based on actual contents
  substatus: string;
  title: string;
  type: string;
  userCount: number;
  user: string;
  events?: SentryEvent[];
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  platform: string;
  serverStatus?: string | "live" | "down";
}

export interface SentryIssueResponse {
  issues: Array<SentryIssue>;
  projectName: string;
}

export interface Accumulator {
  errors: SentryItem[];
  issues: SentryItem[];
}
