'use client';

import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip,
  CartesianGrid 
} from 'recharts';

export function AnalyticsChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip
          cursor={{ stroke: '#8884d8', strokeWidth: 2 }}
          content={({ active, payload }) => {
              if (active && payload && payload.length) {
                  return (
                      <div className="bg-background border p-2 rounded-lg shadow-lg">
                          <p className="text-sm font-bold">{`$${payload[0].value}`}</p>
                          <p className="text-xs text-muted-foreground">{payload[0].payload.name}</p>
                      </div>
                  );
              }
              return null;
          }}
        />
        <Line 
          type="monotone" 
          dataKey="total" 
          stroke="#8884d8" 
          strokeWidth={2}
          dot={{ r: 6, fill: '#8884d8' }}
          activeDot={{ r: 8 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}