import { SentryEvent } from "./event";

export interface SentryItem {
  annotations: any[]; // Adjust the `any` type based on what `annotations` actually contains
  assignedTo: null | string; // Assuming assignedTo can be a string if it's not null
  count: string;
  culprit: string;
  events?: SentryEvent[];
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
}
