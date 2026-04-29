import {
  COMPLIANCE_SCOREBOOK,
  isEUCountry,
  resolveSupplier,
  type ComplianceScores,
  type QuizProfile,
  type SupplierInfo,
  type UserSupplier,
} from "@/lib/suppliers";

type ResolvedSupplier = {
  user: UserSupplier;
  catalog: SupplierInfo | null;
  region: "EU" | "non-EU" | "Okänd";
};

const defaultProfile: QuizProfile = {
  securityPriority: true,
  nis2Priority: true,
  dataLocationKnown: false,
  documentationReady: false,
  cloudActAware: false,
};

function resolveUserSupplier(user: UserSupplier): ResolvedSupplier {
  const catalog = resolveSupplier(user.name);
  let region: "EU" | "non-EU" | "Okänd";

  if (catalog) region = catalog.region;
  else if (!user.country.trim()) region = "Okänd";
  else region = isEUCountry(user.country) ? "EU" : "non-EU";

  return { user, catalog, region };
}

function riskFor(item: ResolvedSupplier): "low" | "medium" | "high" {
  if (item.region === "non-EU" && item.user.mustKeep) return "medium";
  if (item.catalog) return item.catalog.risk;
  if (item.region === "EU") return "low";
  if (item.region === "non-EU") return "high";
  return "medium";
}

export function weightedCompliance(scores: ComplianceScores, profile = defaultProfile): number {
  const nis2Weight = profile.nis2Priority ? 0.34 : 0.26;
  const doraWeight = profile.securityPriority ? 0.31 : 0.25;
  const sovereigntyWeight = profile.dataLocationKnown ? 0.2 : 0.27;
  const gdprWeight = Math.max(0.1, 1 - nis2Weight - doraWeight - sovereigntyWeight);

  return Math.round(
    scores.nis2 * nis2Weight +
      scores.dora * doraWeight +
      scores.sovereignty * sovereigntyWeight +
      scores.gdpr * gdprWeight,
  );
}

function scoresFor(item: ResolvedSupplier): ComplianceScores {
  const catalogName = item.catalog?.name.replace("Microsoft 365", "Microsoft");
  if (catalogName && COMPLIANCE_SCOREBOOK[catalogName]) return COMPLIANCE_SCOREBOOK[catalogName];
  if (item.region === "EU") return { nis2: 82, dora: 76, sovereignty: 88, gdpr: 90 };
  if (riskFor(item) === "medium") return { nis2: 58, dora: 52, sovereignty: 42, gdpr: 63 };
  if (riskFor(item) === "high") return { nis2: 38, dora: 34, sovereignty: 22, gdpr: 48 };
  return { nis2: 50, dora: 46, sovereignty: 40, gdpr: 55 };
}

export function calculateUserScore(suppliers: UserSupplier[], profile = defaultProfile): number {
  if (!suppliers.length) return 0;

  const total = suppliers.reduce(
    (acc, supplier) => acc + weightedCompliance(scoresFor(resolveUserSupplier(supplier)), profile),
    0,
  );

  return Math.round(total / suppliers.length);
}
