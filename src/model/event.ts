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
  location: LocationData | null;
  message: string;
  platform: string;
  projectID: string;
  tags: Tag[];
  title: string;
  user: User;
}

export interface LocationData {
  address: Address;
  ip: string;
  meta: {
    code: number;
  };
  proxy: boolean;
}

interface Address {
  city: string;
  country: string;
  countryCode: string;
  countryFlag: string;
  dma: string;
  dmaCode: string;
  geometry: {
    coordinates: [number, number]; // [longitude, latitude]
    type: string;
  };
  latitude: number;
  longitude: number;
  layer: string;
  postalCode: string;
  state: string;
  stateCode: string;
}

export interface Coordinates {
  longitude: number;
  latitude: number;
}
