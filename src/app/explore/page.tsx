'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type { NodeData, Category } from '@/components/explore/ExploreCanvas';

const CATEGORY_META: Record<Category, { color: string; label: string }> = {
  core: { color: '#02a95c', label: 'Core Pages' },
  'ai-features': { color: '#3b82f6', label: 'AI Features' },
  'ai-products': { color: '#8b5cf6', label: 'AI Products' },
  infrastructure: { color: '#f59e0b', label: 'Infrastructure' },
  data: { color: '#14b8a6', label: 'Data' },
};

const ExploreCanvas = dynamic(
  () => import('@/components/explore/ExploreCanvas'),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <div className="mb-4 h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80 mx-auto" />
          <p className="text-white/60 text-sm">Loading 3D visualization...</p>
        </div>
      </div>
    ),
  }
);

export default function ExplorePage() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [webglError, setWebglError] = useState(false);

  // Check WebGL support
  if (typeof window !== 'undefined' && !webglError) {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) setWebglError(true);
    } catch {
      setWebglError(true);
    }
  }

  if (webglError) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0a0a0a]">
        <div className="text-center max-w-md px-6">
          <h1 className="text-2xl font-bold text-white mb-3">WebGL Not Available</h1>
          <p className="text-white/60 text-sm">
            This page requires WebGL to render the 3D visualization. Please try a different browser or enable hardware acceleration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <ExploreCanvas selectedNode={selectedNode} onSelectNode={setSelectedNode} />
      </div>

      {/* Title overlay */}
      <div className="absolute top-6 left-6 pointer-events-none select-none">
        <h1 className="text-2xl font-bold text-white tracking-tight">
          Product Explorer
        </h1>
        <p className="text-white/50 text-sm mt-1">
          Interactive map of features and connections
        </p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-6 left-6 pointer-events-none select-none">
        <div
          className="rounded-xl px-4 py-3 space-y-2"
          style={{
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {(Object.entries(CATEGORY_META) as [Category, { color: string; label: string }][]).map(
            ([key, { color, label }]) => (
              <div key={key} className="flex items-center gap-2.5">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ background: color, boxShadow: `0 0 6px ${color}` }}
                />
                <span className="text-xs text-white/70 font-medium">{label}</span>
              </div>
            )
          )}
        </div>
      </div>

      {/* Detail panel */}
      <div
        className="absolute top-0 right-0 h-full w-[320px] transition-transform duration-300 ease-out"
        style={{
          transform: selectedNode ? 'translateX(0)' : 'translateX(100%)',
          background: 'rgba(10,10,10,0.92)',
          backdropFilter: 'blur(20px)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        {selectedNode && (
          <div className="p-6 h-full overflow-y-auto">
            <button
              onClick={() => setSelectedNode(null)}
              className="mb-6 text-white/40 hover:text-white/80 transition-colors text-sm"
            >
              Close
            </button>

            <div
              className="h-1 w-12 rounded-full mb-4"
              style={{ background: CATEGORY_META[selectedNode.category].color }}
            />

            <h2 className="text-xl font-bold text-white mb-1">
              {selectedNode.label}
            </h2>
            <span
              className="inline-block text-xs font-medium px-2 py-0.5 rounded-full mb-4"
              style={{
                color: CATEGORY_META[selectedNode.category].color,
                background: `${CATEGORY_META[selectedNode.category].color}20`,
              }}
            >
              {CATEGORY_META[selectedNode.category].label}
            </span>

            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {selectedNode.description}
            </p>

            {selectedNode.api && (
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-1.5">
                  API Provider
                </h3>
                <p className="text-sm text-white/80">{selectedNode.api}</p>
              </div>
            )}

            {selectedNode.href && (
              <Link
                href={selectedNode.href}
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={{
                  background: CATEGORY_META[selectedNode.category].color,
                  color: '#fff',
                }}
              >
                Go to page &rarr;
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
