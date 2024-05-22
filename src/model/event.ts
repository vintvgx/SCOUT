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
  location: Location | null;
  message: string;
  platform: string;
  projectID: string;
  tags: Tag[];
  title: string;
  user: User;
}

export interface Location {
  ip: string;
  is_eu: boolean;
  city: string | null;
  region: string | null;
  region_code: string | null;
  region_type: string | null;
  country_name: string;
  country: string;
  country_code: string;
  continent_name: string;
  continent_code: string;
  latitude: number;
  longitude: number;
  postal: string | null;
  calling_code: string;
  flag: string;
  emoji_flag: string;
  emoji_unicode: string;
  asn: ASN;
  languages: Language[];
  currency: Currency;
  time_zone: TimeZone;
  threat: Threat;
  count: string;
  status?: string;
}

export interface LocationData {
  address: Address;
  ip: string;
  meta: {
    code: number;
  };
  proxy: boolean;
}

export interface ASN {
  asn: string;
  name: string;
  domain: string;
  route: string;
  type: string;
}

export interface Language {
  name: string;
  native: string;
  code: string;
}

export interface Currency {
  name: string;
  code: string;
  symbol: string;
  native: string;
  plural: string;
}

export interface TimeZone {
  name: string | null;
  abbr: string | null;
  offset: string | null;
  is_dst: boolean | null;
  current_time: string | null;
}

export interface Threat {
  is_tor: boolean;
  is_icloud_relay: boolean;
  is_proxy: boolean;
  is_datacenter: boolean;
  is_anonymous: boolean;
  is_known_attacker: boolean;
  is_known_abuser: boolean;
  is_threat: boolean;
  is_bogon: boolean;
  blocklists: Blocklist[];
}

export interface Blocklist {
  name: string;
  site: string;
  type: string;
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
