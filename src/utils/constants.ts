import { Location } from "../model/event";

// Default location data for Lawrence, Massachusetts, USA
export const DEFAULT_LOCATION: Location = {
  ip: "192.0.2.1", // Example IP, replace with a relevant IP if known
  is_eu: false,
  city: "Lawrence",
  region: "Massachusetts",
  region_code: "MA",
  region_type: "State",
  country_name: "United States",
  country_code: "US",
  continent_name: "North America",
  continent_code: "NA",
  latitude: 42.707,
  longitude: -71.1631,
  postal: "01840",
  calling_code: "1",
  flag: "🇺🇸",
  emoji_flag: "🇺🇸",
  emoji_unicode: "U+1F1FA U+1F1F8",
  asn: {
    asn: "AS1234",
    name: "ISP Name",
    domain: "isp.com",
    route: "192.0.2.0/24",
    type: "ISP",
  },
  languages: [
    {
      name: "English",
      native: "English",
      code: "en",
    },
  ],
  currency: {
    name: "United States Dollar",
    code: "USD",
    symbol: "$",
    native: "$",
    plural: "US dollars",
  },
  time_zone: {
    name: "America/New_York",
    abbr: "EST",
    offset: "-05:00",
    is_dst: false,
    current_time: "2024-05-01T12:00:00-05:00",
  },
  threat: {
    is_tor: false,
    is_icloud_relay: false,
    is_proxy: false,
    is_datacenter: false,
    is_anonymous: false,
    is_known_attacker: false,
    is_known_abuser: false,
    is_threat: false,
    is_bogon: false,
    blocklists: [],
  },
  count: "1",
};

export const INITIAL_REGION = {
  latitude: 42.3601,
  longitude: -71.0589,
  latitudeDelta: 0.0922,
  longitudeDelta: 0.0421,
};
