type DashboardCardProps = {
  label: string;
  value: string;
  detail: string;
  tone?: "neutral" | "success" | "warning" | "danger" | "info";
};

const toneClasses = {
  neutral: "border-[#D9DDE3]",
  success: "border-[#28875B]",
  warning: "border-[#C38221]",
  danger: "border-[#C43D4B]",
  info: "border-[#316FC4]",
};

export function DashboardCard({ label, value, detail, tone = "neutral" }: DashboardCardProps) {
  return (
    <article className={`rounded border-l-4 bg-white p-4 shadow-sm ${toneClasses[tone]}`}>
      <p className="text-xs font-semibold uppercase text-[#5F6368]">{label}</p>
      <p className="mt-3 text-2xl font-bold text-[#481827]">{value}</p>
      <p className="mt-2 text-sm text-[#5F6368]">{detail}</p>
    </article>
  );
}
