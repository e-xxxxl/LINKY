// Seeds a small set of clearly-marked demo reviews so the review wall isn't
// empty in local development. Demo reviews are flagged with isDemo: true and
// rendered with a visible "Demo content" label; they are never presented as
// real user submissions.
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const DEMO_REVIEWS = [
  {
    name: "Demo Reviewer",
    rating: 5,
    reviewText:
      "I nearly opened a fake delivery link today. LINKY helped me spot the suspicious domain before I clicked it.",
    reason: "Checking a delivery text",
  },
  {
    name: "Demo Reviewer",
    rating: 4,
    reviewText:
      "Useful for double-checking links from unfamiliar senders. The explanation of why a link was flagged is what I like most.",
    reason: "Verifying an email link",
  },
  {
    name: "Demo Reviewer",
    rating: 5,
    reviewText:
      "Straightforward to use and doesn't overload you with jargon. The technical details are there if you want them.",
    reason: "General curiosity",
  },
];

async function main() {
  const existing = await prisma.review.count({ where: { isDemo: true } });
  if (existing > 0) {
    console.log("Demo reviews already present, skipping seed.");
    return;
  }

  await prisma.review.createMany({
    data: DEMO_REVIEWS.map((r) => ({ ...r, status: "approved", isDemo: true })),
  });

  console.log(`Seeded ${DEMO_REVIEWS.length} demo reviews.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
