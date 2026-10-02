import { Icon } from "./Icon";

export function CtaBlock() {
  return (
    <div className="px-margin-mobile pb-space-lg">
      <div
        className="flex flex-col items-center gap-space-md rounded-[20px] bg-black p-5 text-center text-white"
        style={{ boxShadow: "4px 4px 0px #1c1b1b" }}
      >
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-headline-sm text-white">Ready to test a link?</h2>
          <p className="max-w-[260px] text-body-sm text-line">
            Scan suspicious texts, emails, or messages before clicking.
          </p>
        </div>
        <a
          href="#scanner"
          style={{ boxShadow: "3px 3px 0px #ffffff" }}
          className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-lime text-label-lg tracking-wide text-lime-ink transition-all active:translate-x-0.5 active:translate-y-0.5"
        >
          <span>Scan a link now</span>
          <Icon name="bolt" size={20} />
        </a>
      </div>
    </div>
  );
}
