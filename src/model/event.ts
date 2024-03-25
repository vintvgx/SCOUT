export interface Tag {
  key: string;
  value: string;
  query?: string;
}

export interface User {
  data: null | object;
  email: null | string;
  id: null | string;
  ip_address: string;
  name: null | string;
  username: null | string;
}

export interface SentryEvent {
  crashFile: null | string;
  culprit: string;
  dateCreated: string;
  eventType: string;
  eventID: string;
  groupID: string;
  id: string;
  location: null | string;
  message: string;
  platform: string;
  projectID: string;
  tags: Tag[];
  title: string;
  user: User;
}
