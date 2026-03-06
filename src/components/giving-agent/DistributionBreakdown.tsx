'use client';

import { useState, useEffect } from 'react';

interface DistributionSlice {
  label: string;
  amount: number; // cents
  color: string;
  percentage: number;
}

interface DistributionBreakdownProps {
  slices: DistributionSlice[];
  totalAmount: number; // cents
}

export function DistributionBreakdown({ slices, totalAmount }: DistributionBreakdownProps) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Build SVG pie chart
  const size = 200;
  const center = size / 2;
  const radius = 80;
  const innerRadius = 55;

  const arcs = slices.reduce<Array<DistributionSlice & { startAngle: number; endAngle: number }>>((acc, slice) => {
    const cumulative = acc.length > 0 ? acc[acc.length - 1].endAngle / 3.6 : 0;
    const startAngle = cumulative * 3.6;
    const endAngle = (cumulative + slice.percentage) * 3.6;
    acc.push({ ...slice, startAngle, endAngle });
    return acc;
  }, []);

  function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(angleRad),
      y: cy + r * Math.sin(angleRad),
    };
  }

  function describeArc(cx: number, cy: number, outerR: number, innerR: number, startAngle: number, endAngle: number) {
    const sweep = endAngle - startAngle;
    const largeArc = sweep > 180 ? 1 : 0;

    const outerStart = polarToCartesian(cx, cy, outerR, startAngle);
    const outerEnd = polarToCartesian(cx, cy, outerR, endAngle);
    const innerStart = polarToCartesian(cx, cy, innerR, endAngle);
    const innerEnd = polarToCartesian(cx, cy, innerR, startAngle);

    return [
      `M ${outerStart.x} ${outerStart.y}`,
      `A ${outerR} ${outerR} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
      `L ${innerStart.x} ${innerStart.y}`,
      `A ${innerR} ${innerR} 0 ${largeArc} 0 ${innerEnd.x} ${innerEnd.y}`,
      'Z',
    ].join(' ');
  }

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="flex flex-col md:flex-row items-center gap-8">
      {/* Pie Chart */}
      <div className="relative shrink-0">
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className={`transition-transform duration-700 ${animated ? 'scale-100' : 'scale-0'}`}
        >
          {arcs.map((arc, i) => {
            const gap = 1.5;
            const adjustedStart = arc.startAngle + gap / 2;
            const adjustedEnd = arc.endAngle - gap / 2;
            if (adjustedEnd <= adjustedStart) return null;

            return (
              <path
                key={i}
                d={describeArc(center, center, hoveredIndex === i ? radius + 4 : radius, innerRadius, adjustedStart, adjustedEnd)}
                fill={arc.color}
                className="transition-all duration-200 cursor-pointer"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{ filter: hoveredIndex === i ? 'brightness(1.1)' : 'none' }}
              />
            );
          })}
          {/* Center text */}
          <text x={center} y={center - 8} textAnchor="middle" className="fill-[var(--gfm-dark)] text-xs font-medium">
            Total
          </text>
          <text x={center} y={center + 14} textAnchor="middle" className="fill-[var(--gfm-dark)] text-lg font-bold">
            ${(totalAmount / 100).toFixed(0)}
          </text>
        </svg>
      </div>

      {/* Legend */}
      <div className="flex-1 space-y-3 w-full">
        {slices.map((slice, i) => (
          <div
            key={i}
            className={`flex items-center justify-between rounded-xl p-3 transition-all duration-200 ${
              hoveredIndex === i ? 'bg-[var(--gfm-bg)] scale-[1.02]' : 'bg-transparent'
            }`}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: slice.color }} />
              <span className="text-sm font-medium text-[var(--gfm-dark)]">{slice.label}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--gfm-dark)]">
                ${(slice.amount / 100).toFixed(2)}
              </span>
              <span className="text-xs font-medium text-[var(--gfm-secondary)] w-10 text-right">
                {slice.percentage.toFixed(0)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
