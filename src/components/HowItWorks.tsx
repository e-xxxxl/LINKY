import { SectionPill } from "./SectionPill";

const STEPS = [
  { number: "01", title: "Paste", body: "Copy and paste any suspicious URL or message link.", badge: "surface-highest" as const },
  { number: "02", title: "Scan", body: "Our automated system inspects domain age and spoofing tricks.", badge: "surface-highest" as const },
  { number: "03", title: "Get your result", body: "Receive an instant plain verdict with score and clear reasons.", badge: "lime" as const },
];

export function HowItWorks() {
  return (
    <div className="flex flex-col gap-space-sm px-margin-mobile pb-space-lg">
      <SectionPill>How it works</SectionPill>
      <div
        className="flex flex-col gap-space-md rounded-[18px] bg-near-black p-5 text-white"
        style={{ boxShadow: "4px 4px 0px #1c1b1b" }}
      >
        {STEPS.map((step, i) => (
          <div key={step.number}>
            <div className="flex items-start gap-3">
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-display text-label-md ${
                  step.badge === "lime" ? "bg-lime text-lime-ink" : "bg-surface-highest text-black"
                }`}
                style={{ boxShadow: step.badge === "lime" ? "2px 2px 0px #ffffff" : "2px 2px 0px #c6f340" }}
              >
                {step.number}
              </div>
              <div className="flex flex-col">
                <span className="font-display text-title-md text-white">{step.title}</span>
                <p className="mt-0.5 text-body-sm text-line">{step.body}</p>
              </div>
            </div>
            {i < STEPS.length - 1 && <div className="mt-space-md h-px w-full bg-ink-faint/30" />}
          </div>
        ))}
      </div>
    </div>
  );
}
