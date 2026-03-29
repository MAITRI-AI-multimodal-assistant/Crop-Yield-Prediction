import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer, ReferenceLine,
} from "recharts";

export default function ShapChart({ features, advice }) {
  if (!features || features.length === 0) return null;

  const data = [...features].sort((a, b) => Math.abs(b.shap_value) - Math.abs(a.shap_value));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const d = payload[0].payload;
      return (
        <div style={{
          background: "#0d1810",
          border: "1px solid rgba(0,166,81,0.15)",
          borderRadius: 8,
          padding: "8px 12px",
          fontSize: "0.85rem",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}>
          <p style={{ fontWeight: 600, color: "#d4edda" }}>{d.feature}</p>
          <p style={{ color: d.shap_value >= 0 ? "#4ade80" : "#f87171" }}>
            Impact: {d.shap_value >= 0 ? "+" : ""}{d.shap_value.toFixed(3)}
          </p>
          <p style={{ color: "#4d7a5e", fontSize: "0.78rem" }}>
            Direction: {d.direction}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <div style={{ marginBottom: "0.5rem", fontSize: "0.8rem", color: "#4d7a5e", display: "flex", gap: "1rem" }}>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 12, height: 12, background: "#4ade80", borderRadius: 2, display: "inline-block" }} />
          Positive impact
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ width: 12, height: 12, background: "#f87171", borderRadius: 2, display: "inline-block" }} />
          Negative impact
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 20, left: 80, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,166,81,0.15)" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#4d7a5e" }}
            axisLine={false}
            tickLine={false}
            label={{ value: "SHAP Value", position: "insideBottom", offset: -2, fontSize: 11, fill: "#4d7a5e" }}
          />
          <YAxis
            type="category"
            dataKey="feature"
            tick={{ fontSize: 11, fill: "#8bc4a0" }}
            axisLine={false}
            tickLine={false}
            width={78}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,166,81,0.06)" }} />
          <ReferenceLine x={0} stroke="rgba(0,166,81,0.15)" strokeWidth={2} />
          <Bar dataKey="shap_value" radius={[0, 4, 4, 0]} maxBarSize={22}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.shap_value >= 0 ? "#4ade80" : "#f87171"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {advice && (
        <div style={{
          marginTop: "1rem",
          padding: "0.85rem 1rem",
          background: "rgba(143,206,106,0.12)",
          borderRadius: 10,
          borderLeft: "3px solid #00a651",
          fontSize: "0.9rem",
          color: "#8bc4a0",
          lineHeight: 1.6,
        }}>
          💡 {advice}
        </div>
      )}
    </div>
  );
}
