import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { toScanReport } from "@/lib/scanMapper";
import { ScanResult } from "@/components/ScanResult";
import { DetailHeader } from "@/components/DetailHeader";
import { RISK_LEVEL_LABEL } from "@/lib/format";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function getScan(id: string) {
  const scan = await prisma.scan.findUnique({ where: { id } });
  return scan ? toScanReport(scan) : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const report = await getScan(id);
  if (!report) return { title: "Scan not found" };

  const title = `${RISK_LEVEL_LABEL[report.riskLevel]} — Scan Report`;
  return {
    title,
    description: report.summary,
    openGraph: { title, description: report.summary },
    robots: { index: false, follow: false },
  };
}

export default async function ScanPage({ params }: PageProps) {
  const { id } = await params;
  const report = await getScan(id);

  if (!report) notFound();

  return (
    <>
      <DetailHeader title="Scan result details" />
      <main className="flex-1 bg-surface pt-16">
        <div className="mx-auto w-full max-w-[480px] px-margin-mobile pb-space-xl">
          <ScanResult report={report} />
        </div>
      </main>
    </>
  );
}
