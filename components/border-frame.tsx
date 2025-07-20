import { cn } from "@/lib/utils";

export default function BorderFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative border border-dashed border-primary/50", className)}>
      {/* Corner + signs (aligned precisely at the corners) */}
      <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2  text-card-foreground font-light text-lg leading-none">
        +
      </div>
      <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 text-card-foreground font-light text-lg leading-none">
        +
      </div>
      <div className="absolute bottom-0 left-0 -translate-x-1/2 translate-y-1/2 text-card-foreground font-light text-lg leading-none">
        +
      </div>
      <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 text-card-foreground font-light text-lg leading-none">
        +
      </div>

      {/* Optional grid lines */}
      {/* <div className="absolute top-0 bottom-0 left-1/2 w-px bg-white/10" />
      <div className="absolute left-0 right-0 top-1/2 h-px bg-white/10" /> */}

      <div className="relative p-6">{children}</div>
    </div>
  );
}
