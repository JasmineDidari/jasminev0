export type SupplierInfo = {
  name: string;
  region: "EU" | "non-EU";
  country: string;
  category: string;
  risk: "low" | "medium" | "high";
  riskNote: string;
};

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
};

export const POPULAR_SUPPLIERS = Object.keys(SUPPLIER_CATALOG);

const STORAGE_KEY = "eurostack_suppliers";

export function saveSuppliers(suppliers: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(suppliers));
}

export function loadSuppliers(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}