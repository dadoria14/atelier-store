import Link from "next/link";

type SectionHeaderProps = {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "View All",
}: SectionHeaderProps) {
  return (
    <div className="mb-8 flex items-end justify-between gap-6 md:mb-10">
      <div className="stack [--stack-gap:0.75rem]">
        {eyebrow && <p className="text-caption text-muted">{eyebrow}</p>}
        <h2 className="text-heading">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          aria-label={`${linkLabel} ${title}`}
          className="text-label link shrink-0"
        >
          {linkLabel}
        </Link>
      )}
    </div>
  );
}
