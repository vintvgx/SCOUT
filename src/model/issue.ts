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

export interface Project {
  id: string;
  name: string;
  slug: string;
  platform: string;
}

export interface SentryIssueResponse {
  issues: Array<SentryIssue>;
  projectName: string;
}
