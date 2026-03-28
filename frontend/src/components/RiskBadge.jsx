export default function RiskBadge({ level }) {
  const map = {
    Low: { cls: "badge-low", icon: "✅" },
    Medium: { cls: "badge-medium", icon: "⚠️" },
    High: { cls: "badge-high", icon: "🔴" },
  };
  const { cls, icon } = map[level] || map["Medium"];
  return (
    <span className={`badge ${cls}`}>
      {icon} {level} Risk
    </span>
  );
}
