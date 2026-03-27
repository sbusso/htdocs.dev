import { LOCALE } from "@config";

export interface Props {
  datetime: string | Date;
  size?: "sm" | "lg";
  className?: string;
}

export default function Datetime({ datetime, size = "sm", className }: Props) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="sr-only">Posted on:</span>
      <span
        className="datetime-text"
        style={{
          fontFamily: '"JetBrains Mono Variable", monospace',
          fontSize: size === "sm" ? "0.72rem" : "0.78rem",
          fontWeight: 500,
          color: "var(--text-muted)",
          letterSpacing: "0.03em",
          textTransform: "uppercase" as const,
        }}
      >
        <FormattedDatetime datetime={datetime} />
      </span>
    </div>
  );
}

const FormattedDatetime = ({ datetime }: { datetime: string | Date }) => {
  const myDatetime = new Date(datetime);

  const date = myDatetime.toLocaleDateString(LOCALE[0] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return <>{date}</>;
};
