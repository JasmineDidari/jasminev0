export type SupplierInfo = {
  name: string;
  region: "EU" | "non-EU";
  country: string;
  category: string;
  risk: "low" | "medium" | "high";
  riskNote: string;
};

export type SupplierType =
  | "SaaS"
  | "Cloud"
  | "Infra"
  | "Consultant";

export const SUPPLIER_TYPES: SupplierType[] = [
  "SaaS",
  "Cloud",
  "Infra",
  "Consultant",
];

export type UserSupplier = {
  id: string;
  name: string;
  type: SupplierType;
  country: string;
  system?: string;
  mustKeep?: boolean;
  criticality?: number;
};

export type ComplianceScores = {
  nis2: number;
  dora: number;
  sovereignty: number;
  gdpr: number;
};

export type QuizProfile = {
  securityPriority: boolean;
  nis2Priority: boolean;
  dataLocationKnown: boolean;
  documentationReady: boolean;
  cloudActAware: boolean;
};

/** Storage location used by each supplier we know about. */
export const SUPPLIER_LOCATION: Record<string, string> = {
  Microsoft: "Virginia, USA (non-EU)",
  Google: "Iowa, USA (non-EU)",
  AWS: "Virginia, USA (non-EU)",
  Azure: "Virginia, USA (non-EU)",
  ChatGPT: "Texas, USA (non-EU)",
  Slack: "California, USA (non-EU)",
  Dropbox: "California, USA (non-EU)",
  Zoom: "California, USA (non-EU)",
  Salesforce: "California, USA (non-EU)",
  Notion: "California, USA (non-EU)",
  Nextcloud: "Frankfurt, Germany (EU)",
  OVHcloud: "Roubaix, France (EU)",
  Hetzner: "Falkenstein, Germany (EU)",
  Mistral: "Paris, France (EU)",
  Proton: "Geneva, Switzerland (EU)",
  Element: "Dublin, Ireland (EU)",
  IONOS: "Karlsruhe, Germany (EU)",
  Scaleway: "Paris, France (EU)",
  Exoscale: "Geneva, Switzerland (EU)",
  UpCloud: "Helsinki, Finland (EU)",
  "Orange Cloud": "Paris, France (EU)",
};

const EU_COUNTRIES = new Set([
  "sverige","sweden","tyskland","germany","frankrike","france","spanien","spain",
  "italien","italy","nederländerna","netherlands","danmark","denmark","norge","norway",
  "finland","polen","poland","irland","ireland","belgien","belgium","österrike","austria",
  "portugal","schweiz","switzerland","estland","estonia","lettland","latvia","litauen","lithuania",
  "tjeckien","czechia","grekland","greece","ungern","hungary","rumänien","romania","eu",
]);

export function isEUCountry(country: string): boolean {
  return EU_COUNTRIES.has(country.trim().toLowerCase());
}

export const SUPPLIER_CATALOG: Record<string, SupplierInfo> = {
  Microsoft: {
    name: "Microsoft 365",
    region: "non-EU",
    country: "USA",
    category: "Produktivitet",
    risk: "high",
    riskNote: "CLOUD Act — amerikanska myndigheter kan begära ut data.",
  },
  Google: {
    name: "Google Workspace",
    region: "non-EU",
    country: "USA",
    category: "Produktivitet",
    risk: "high",
    riskNote: "CLOUD Act + omfattande datainsamling för annonsering.",
  },
  AWS: {
    name: "Amazon Web Services",
    region: "non-EU",
    country: "USA",
    category: "Cloud",
    risk: "high",
    riskNote: "EU-regioner finns men ägarskap och jurisdiktion är amerikansk.",
  },
  Azure: {
    name: "Microsoft Azure",
    region: "non-EU",
    country: "USA",
    category: "Cloud",
    risk: "high",
    riskNote: "Samma CLOUD Act-exponering som M365.",
  },
  ChatGPT: {
    name: "ChatGPT (OpenAI)",
    region: "non-EU",
    country: "USA",
    category: "AI",
    risk: "high",
    riskNote: "Träningsdata och prompts hanteras utanför EU.",
  },
  Slack: {
    name: "Slack",
    region: "non-EU",
    country: "USA",
    category: "Kommunikation",
    risk: "medium",
    riskNote: "Salesforce-ägt, lagring i USA om inte EU-residens köps till.",
  },
  Dropbox: {
    name: "Dropbox",
    region: "non-EU",
    country: "USA",
    category: "Lagring",
    risk: "high",
    riskNote: "Amerikansk leverantör utan garanterad EU-suveränitet.",
  },
  Zoom: {
    name: "Zoom",
    region: "non-EU",
    country: "USA",
    category: "Möten",
    risk: "medium",
    riskNote: "EU-datacenter finns men huvudkontor i USA.",
  },
  Salesforce: {
    name: "Salesforce",
    region: "non-EU",
    country: "USA",
    category: "CRM",
    risk: "high",
    riskNote: "CLOUD Act gäller även EU-instanser.",
  },
  Notion: {
    name: "Notion",
    region: "non-EU",
    country: "USA",
    category: "Produktivitet",
    risk: "medium",
    riskNote: "Ingen EU-residens som standard.",
  },
  Nextcloud: {
    name: "Nextcloud",
    region: "EU",
    country: "Tyskland",
    category: "Lagring",
    risk: "low",
    riskNote: "EU-baserad open source, full datakontroll.",
  },
  OVHcloud: {
    name: "OVHcloud",
    region: "EU",
    country: "Frankrike",
    category: "Cloud",
    risk: "low",
    riskNote: "Fransk leverantör, immun mot CLOUD Act.",
  },
  Hetzner: {
    name: "Hetzner",
    region: "EU",
    country: "Tyskland",
    category: "Cloud",
    risk: "low",
    riskNote: "Tysk hosting, GDPR-vänlig som standard.",
  },
  Mistral: {
    name: "Mistral AI",
    region: "EU",
    country: "Frankrike",
    category: "AI",
    risk: "low",
    riskNote: "Europeiskt AI-alternativ till OpenAI.",
  },
  Proton: {
    name: "Proton Mail",
    region: "EU",
    country: "Schweiz",
    category: "Kommunikation",
    risk: "low",
    riskNote: "End-to-end krypterat, schweizisk jurisdiktion.",
  },
  Element: {
    name: "Element / Matrix",
    region: "EU",
    country: "Storbritannien/EU",
    category: "Kommunikation",
    risk: "low",
    riskNote: "Decentraliserad och federerad chat.",
  },
  IONOS: {
    name: "IONOS",
    region: "EU",
    country: "Tyskland",
    category: "Cloud",
    risk: "low",
    riskNote: "Tysk molnleverantör med EU-garantier.",
  },
  Scaleway: {
    name: "Scaleway",
    region: "EU",
    country: "Frankrike",
    category: "Cloud",
    risk: "low",
    riskNote: "Fransk hyperscaler.",
  },
  Exoscale: {
    name: "Exoscale",
    region: "EU",
    country: "Schweiz",
    category: "Cloud",
    risk: "low",
    riskNote: "Europeisk molnplattform med stark datalokalisering och GDPR-fokus.",
  },
  UpCloud: {
    name: "UpCloud",
    region: "EU",
    country: "Finland",
    category: "Cloud",
    risk: "low",
    riskNote: "Finsk cloud-leverantör med EU-datacenter och tydlig suveränitetsprofil.",
  },
  "Orange Cloud": {
    name: "Orange Cloud",
    region: "EU",
    country: "Frankrike",
    category: "Cloud",
    risk: "low",
    riskNote: "Europeisk enterprise-cloud med stark profil för kritisk infrastruktur.",
  },
};

export const POPULAR_SUPPLIERS = Object.keys(SUPPLIER_CATALOG);

export const EU_ALTERNATIVES: Record<string, string[]> = {
  Microsoft: ["Nextcloud", "Proton", "IONOS"],
  Google: ["Nextcloud", "Proton", "Element"],
  AWS: ["Exoscale", "UpCloud", "Orange Cloud", "OVHcloud"],
  Azure: ["Orange Cloud", "Exoscale", "IONOS", "OVHcloud"],
  ChatGPT: ["Mistral", "Scaleway"],
  Slack: ["Element", "Proton"],
  Dropbox: ["Nextcloud", "Proton"],
  Zoom: ["Element", "IONOS"],
  Salesforce: ["Nextcloud", "IONOS"],
  Notion: ["Nextcloud", "Element"],
};

export const COMPLIANCE_SCOREBOOK: Record<string, ComplianceScores> = {
  Exoscale: { nis2: 94, dora: 88, sovereignty: 96, gdpr: 95 },
  UpCloud: { nis2: 91, dora: 85, sovereignty: 94, gdpr: 93 },
  "Orange Cloud": { nis2: 96, dora: 94, sovereignty: 93, gdpr: 92 },
  OVHcloud: { nis2: 92, dora: 90, sovereignty: 94, gdpr: 91 },
  Hetzner: { nis2: 86, dora: 78, sovereignty: 91, gdpr: 90 },
  Scaleway: { nis2: 88, dora: 82, sovereignty: 90, gdpr: 89 },
  IONOS: { nis2: 89, dora: 84, sovereignty: 90, gdpr: 90 },
  Nextcloud: { nis2: 84, dora: 76, sovereignty: 95, gdpr: 92 },
  Proton: { nis2: 88, dora: 80, sovereignty: 96, gdpr: 96 },
  Element: { nis2: 82, dora: 74, sovereignty: 91, gdpr: 89 },
  Mistral: { nis2: 86, dora: 80, sovereignty: 92, gdpr: 88 },
};

const STORAGE_KEY = "eurostack_user_suppliers";

export function saveUserSuppliers(suppliers: UserSupplier[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

export function clearUserSuppliers() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(STORAGE_KEY);
}

export function loadUserSuppliers(): UserSupplier[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserSupplier[]) : [];
  } catch {
    return [];
  }
}

/** Resolve a user-entered supplier against the catalog (case-insensitive). */
export function resolveSupplier(name: string): SupplierInfo | null {
  const key = Object.keys(SUPPLIER_CATALOG).find(
    (k) =>
      k.toLowerCase() === name.toLowerCase() ||
      SUPPLIER_CATALOG[k].name.toLowerCase() === name.toLowerCase(),
  );
  return key ? SUPPLIER_CATALOG[key] : null;
}

export function locationFor(name: string): string | null {
  const key = Object.keys(SUPPLIER_LOCATION).find(
    (k) => k.toLowerCase() === name.toLowerCase(),
  );
  return key ? SUPPLIER_LOCATION[key] : null;
}

export function alternativesFor(name: string, category?: string): string[] {
  const key = Object.keys(EU_ALTERNATIVES).find((k) =>
    name.toLowerCase().includes(k.toLowerCase()),
  );
  if (key) return EU_ALTERNATIVES[key];
  if (category === "Cloud") return ["OVHcloud", "Hetzner", "Scaleway"];
  if (category === "AI") return ["Mistral", "Scaleway"];
  if (category === "Kommunikation") return ["Element", "Proton"];
  return ["Nextcloud", "IONOS", "Proton"];
}