// Terms that commonly appear in phishing and social-engineering URLs,
// grouped so a single scan does not get penalized repeatedly for one theme.
export const SUSPICIOUS_KEYWORD_GROUPS: Record<string, string[]> = {
  credential: ["login", "signin", "sign-in", "verify", "password", "credential"],
  account: ["account", "confirm", "update", "suspended", "restore", "unlock"],
  financial: ["banking", "bank", "wallet", "invoice", "billing", "payment", "refund"],
  urgency: ["urgent", "immediately", "alert", "security-alert", "limited"],
};

export function findKeywordMatches(text: string): { group: string; term: string }[] {
  const lower = text.toLowerCase();
  const matches: { group: string; term: string }[] = [];
  for (const [group, terms] of Object.entries(SUSPICIOUS_KEYWORD_GROUPS)) {
    for (const term of terms) {
      if (lower.includes(term)) {
        matches.push({ group, term });
        break;
      }
    }
  }
  return matches;
}
