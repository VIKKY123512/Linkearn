"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function ClicksChart({ data }: { data: { day: string; clicks: number }[] }) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="amberFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F2B705" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#F2B705" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="#242933" vertical={false} />
        <XAxis dataKey="day" stroke="#5A6270" fontSize={12} tickLine={false} axisLine={false} />
        <YAxis stroke="#5A6270" fontSize={12} tickLine={false} axisLine={false} />
        <Tooltip
          contentStyle={{ background: "#12151A", border: "1px solid #242933", borderRadius: 6 }}
          labelStyle={{ color: "#EDEAE2" }}
        />
        <Area type="monotone" dataKey="clicks" stroke="#F2B705" fill="url(#amberFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}
