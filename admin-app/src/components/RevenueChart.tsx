import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Circle, TrendingUp, Calendar, Zap } from 'lucide-react';

interface ChartPoint {
  date: string;
  revenue: number;
  members: number;
}

interface RevenueChartProps {
  data: ChartPoint[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // SVG Chart sizing parameters
  const width = 640;
  const height = 240;
  const paddingLeft = 60;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Compute min/max for scaling
  const revenues = data.map((d) => d.revenue);
  const minRevenue = Math.min(...revenues) * 0.95; // 5% buffer bottom
  const maxRevenue = Math.max(...revenues) * 1.05; // 5% buffer top
  const range = (maxRevenue - minRevenue) || 100;

  // Scale map functions
  const getX = (index: number) => {
    return paddingLeft + (index / (data.length - 1)) * chartWidth;
  };

  const getY = (value: number) => {
    return paddingTop + chartHeight - ((value - minRevenue) / range) * chartHeight;
  };

  // Generate Bezier path points
  const points = data.map((d, i) => ({ x: getX(i), y: getY(d.revenue) }));
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Smooth out curve using Bezier control points
      const prev = points[i - 1];
      const curr = points[i];
      const cpX1 = prev.x + (curr.x - prev.x) / 3;
      const cpY1 = prev.y;
      const cpX2 = prev.x + (2 * (curr.x - prev.x)) / 3;
      const cpY2 = curr.y;
      pathD += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${curr.x} ${curr.y}`;
    }

    // Close area shape for color gradient highlight
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Create Y-axis guidelines / labels
  const yTicksCount = 4;
  const yTicks = Array.from({ length: yTicksCount }).map((_, i) => {
    const val = minRevenue + (i / (yTicksCount - 1)) * range;
    return Math.round(val);
  });

  return (
    <div className="p-6 border border-neutral-200 dark:border-neutral-800 rounded-2xl bg-white dark:bg-[#121315] hover:border-neutral-300 dark:hover:border-neutral-700/80 transition-all select-none col-span-1 lg:col-span-2 flex flex-col justify-between">
      {/* Chart Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-50 flex items-center gap-2">
            Revenue Performance
          </h4>
          <p className="text-2xs text-neutral-400 dark:text-neutral-500 mt-0.5">
            Reflecting active premium template payouts & subscriptions over last 7 days.
          </p>
        </div>
        <div className="flex items-center gap-4 text-2xs font-bold text-neutral-500/80 dark:text-neutral-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 inline-block" />
            <span>Revenue ($)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
            <span>Members</span>
          </span>
        </div>
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-hidden" style={{ minHeight: `${height}px` }}>
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
          height={height}
          className="overflow-visible"
        >
          {/* Gradients */}
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#6366f1" stopOpacity="0.01" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="50%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>

          {/* Y Axis Guide Lines */}
          {yTicks.map((tick, i) => {
            const y = getY(tick);
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="currentColor"
                  className="text-neutral-200 dark:text-neutral-800"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 12}
                  y={y + 4}
                  textAnchor="end"
                  className="text-4xs font-mono font-bold text-neutral-400 fill-current"
                >
                  ${tick.toLocaleString()}
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {data.map((point, i) => {
            const x = getX(i);
            return (
              <text
                key={i}
                x={x}
                y={height - paddingBottom + 20}
                textAnchor="middle"
                className="text-4xs font-mono font-bold text-neutral-400 dark:text-neutral-500 fill-current"
              >
                {point.date}
              </text>
            );
          })}

          {/* SVG Colored Area Path */}
          {areaD && (
            <path
              d={areaD}
              fill="url(#chartGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* SVG Stroke Path */}
          {pathD && (
            <motion.path
              d={pathD}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth={3}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
          )}

          {/* Spark Interaction Dots */}
          {points.map((pt, i) => {
            const isActive = hoverIndex === i;
            return (
              <g
                key={i}
                onMouseEnter={() => setHoverIndex(i)}
                onMouseLeave={() => setHoverIndex(null)}
                className="cursor-pointer"
              >
                {/* Visual Circle Pulse */}
                {isActive && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={9}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    className="opacity-40 animate-ping"
                  />
                )}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isActive ? 6 : 4}
                  fill={isActive ? '#ffffff' : '#6366f1'}
                  stroke={isActive ? '#8b5cf6' : 'none'}
                  strokeWidth={2}
                  className="transition-all duration-150"
                />
                {/* Hover trigger spacer for ease of cursor tracking */}
                <rect
                  x={pt.x - 15}
                  y={paddingTop}
                  width={30}
                  height={chartHeight}
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip on Hover */}
        {hoverIndex !== null && (
          <div
            className="absolute bg-white/95 dark:bg-[#121315]/95 border border-neutral-200 dark:border-neutral-800 rounded-xl p-3 shadow-xl backdrop-blur-sm pointer-events-none transition-all duration-150 z-10"
            style={{
              left: `${Math.min(
                Math.max(getX(hoverIndex) - 75, paddingLeft),
                width - 170
              )}px`,
              top: `${Math.min(getY(data[hoverIndex].revenue) - 85, height - 100)}px`,
            }}
          >
            <div className="flex items-center gap-1 mb-1">
              <Calendar size={10} className="text-neutral-400" />
              <span className="text-4xs font-mono font-semibold uppercase text-neutral-400 tracking-wider">
                {data[hoverIndex].date}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-2xs font-bold text-neutral-900 dark:text-neutral-50 flex justify-between gap-4">
                <span>Revenue:</span>
                <span className="text-indigo-600 dark:text-indigo-400">
                  ${data[hoverIndex].revenue.toLocaleString()}
                </span>
              </p>
              <p className="text-2xs font-bold text-neutral-900 dark:text-neutral-50 flex justify-between gap-4">
                <span>Platform Members:</span>
                <span className="text-emerald-500">{data[hoverIndex].members}</span>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Summary footer of performance */}
      <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800/80 flex items-center justify-between">
        <div className="flex gap-2 items-center">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 dark:bg-indigo-400/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Zap size={14} />
          </div>
          <div>
            <p className="text-2xs font-bold text-neutral-900 dark:text-neutral-50">
              Dynamic Tracking Active
            </p>
            <span className="text-[10px] text-neutral-500">
              Interactive chart synchronizes with action triggers in real-time.
            </span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-500 block uppercase">
            +9.2% Growth
          </span>
          <span className="text-4xs text-neutral-400">vs yesterday benchmark</span>
        </div>
      </div>
    </div>
  );
}
