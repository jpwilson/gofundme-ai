'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Html, Line } from '@react-three/drei';
import * as THREE from 'three';

// ─── Data ────────────────────────────────────────────────────────────────────

interface NodeData {
  id: string;
  label: string;
  category: Category;
  description: string;
  href?: string;
  api?: string;
}

type Category = 'core' | 'ai-features' | 'ai-products' | 'infrastructure' | 'data';

const CATEGORY_META: Record<Category, { color: string; label: string }> = {
  core: { color: '#02a95c', label: 'Core Pages' },
  'ai-features': { color: '#3b82f6', label: 'AI Features' },
  'ai-products': { color: '#8b5cf6', label: 'AI Products' },
  infrastructure: { color: '#f59e0b', label: 'Infrastructure' },
  data: { color: '#14b8a6', label: 'Data' },
};

const NODES: NodeData[] = [
  // Core Pages
  { id: 'fundraiser-page', label: 'Fundraiser Page', category: 'core', description: 'Main fundraiser view with story, donations, and AI-powered insights.', href: '/ai/fundraiser' },
  { id: 'community-page', label: 'Community Page', category: 'core', description: 'Community hub with digests, cause matching, and activity feeds.', href: '/ai/community' },
  { id: 'profile-page', label: 'Profile Page', category: 'core', description: 'Donor profile with giving personality and personalized recommendations.', href: '/ai/profile' },
  // AI Features
  { id: 'story-coach', label: 'Story Coach', category: 'ai-features', description: 'AI writing assistant that helps craft compelling fundraiser stories.', api: 'Claude API' },
  { id: 'sentiment-analysis', label: 'Sentiment Analysis', category: 'ai-features', description: 'Analyzes emotional tone of fundraiser stories and comments.', api: 'Claude API' },
  { id: 'trust-scoring', label: 'Trust Scoring', category: 'ai-features', description: 'AI-powered trust score for fundraiser legitimacy.', api: 'Claude API' },
  { id: 'community-digest', label: 'Community Digest', category: 'ai-features', description: 'Smart summaries of community activity and trending causes.', api: 'Claude API' },
  { id: 'giving-personality', label: 'Giving Personality', category: 'ai-features', description: 'Personality profiling based on donation patterns and preferences.', api: 'Claude API' },
  { id: 'cause-matching', label: 'Cause Matching', category: 'ai-features', description: 'Matches donors with causes aligned to their values.', api: 'Claude API' },
  { id: 'fundraiser-recs', label: 'Fundraiser Recommendations', category: 'ai-features', description: 'Personalized fundraiser recommendations based on user behavior.', api: 'Claude API' },
  // AI Products
  { id: 'fraud-detection', label: 'Fraud Detection', category: 'ai-products', description: 'Anomaly detection system identifying potentially fraudulent fundraisers.', href: '/ai2/fraud-detection' },
  { id: 'giving-agent', label: 'Giving Agent', category: 'ai-products', description: 'Automated monthly giving agent that donates on behalf of users.', href: '/giving-agent' },
  { id: 'persona-targeting', label: 'Persona Targeting', category: 'ai-products', description: 'Social media donor persona identification and targeting.', href: '/ai2/persona-recommendations' },
  { id: 'agent-observability', label: 'Agent Observability', category: 'ai-products', description: 'Monitoring and tracing for AI agent behavior and performance.', href: '/ai2/agent-observability' },
  { id: 'jira-agent', label: 'Jira Agent', category: 'ai-products', description: 'AI-powered Jira workflows for engineering productivity.', href: '/ai2/jira-agent' },
  // Infrastructure
  { id: 'claude-api', label: 'Claude API (OpenRouter)', category: 'infrastructure', description: 'Primary LLM provider via OpenRouter for all AI features.' },
  { id: 'langfuse', label: 'LangFuse', category: 'infrastructure', description: 'LLM observability platform for cost tracking and prompt management.' },
  { id: 'mock-provider', label: 'Mock Provider', category: 'infrastructure', description: 'Fallback mock AI provider for development and testing.' },
  { id: 'vercel', label: 'Vercel', category: 'infrastructure', description: 'Deployment and hosting platform for the Next.js application.' },
  // Data
  { id: 'fundraisers', label: 'Fundraisers', category: 'data', description: 'Fundraiser campaigns with stories, goals, and media.' },
  { id: 'donations', label: 'Donations', category: 'data', description: 'Individual donation records with amounts, timestamps, and messages.' },
  { id: 'communities', label: 'Communities', category: 'data', description: 'Community groups organized around causes and interests.' },
  { id: 'users', label: 'Users', category: 'data', description: 'User accounts with profiles, preferences, and activity history.' },
  { id: 'activities', label: 'Activities', category: 'data', description: 'Activity feed events like donations, shares, and milestones.' },
];

const EDGES: [string, string][] = [
  // Fundraiser Page connections
  ['fundraiser-page', 'story-coach'],
  ['fundraiser-page', 'sentiment-analysis'],
  ['fundraiser-page', 'trust-scoring'],
  ['fundraiser-page', 'fundraisers'],
  ['fundraiser-page', 'donations'],
  // Community Page connections
  ['community-page', 'community-digest'],
  ['community-page', 'cause-matching'],
  ['community-page', 'communities'],
  ['community-page', 'activities'],
  // Profile Page connections
  ['profile-page', 'giving-personality'],
  ['profile-page', 'fundraiser-recs'],
  ['profile-page', 'users'],
  ['profile-page', 'donations'],
  // AI Products
  ['fraud-detection', 'trust-scoring'],
  ['fraud-detection', 'fundraisers'],
  ['giving-agent', 'cause-matching'],
  ['giving-agent', 'donations'],
  ['giving-agent', 'users'],
  // AI Features -> Infrastructure
  ['story-coach', 'claude-api'],
  ['story-coach', 'langfuse'],
  ['sentiment-analysis', 'claude-api'],
  ['sentiment-analysis', 'langfuse'],
  ['trust-scoring', 'claude-api'],
  ['trust-scoring', 'langfuse'],
  ['community-digest', 'claude-api'],
  ['community-digest', 'langfuse'],
  ['giving-personality', 'claude-api'],
  ['giving-personality', 'langfuse'],
  ['cause-matching', 'claude-api'],
  ['cause-matching', 'langfuse'],
  // Infrastructure
  ['claude-api', 'mock-provider'],
  // Core Pages -> Vercel
  ['fundraiser-page', 'vercel'],
  ['community-page', 'vercel'],
  ['profile-page', 'vercel'],
];

// ─── Layout ──────────────────────────────────────────────────────────────────

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function computePositions(): Record<string, [number, number, number]> {
  const positions: Record<string, [number, number, number]> = {};

  const groups: Record<Category, string[]> = {
    core: [],
    'ai-features': [],
    'ai-products': [],
    infrastructure: [],
    data: [],
  };

  NODES.forEach((n) => groups[n.category].push(n.id));

  // Core pages: center cluster
  groups.core.forEach((id, i) => {
    const angle = (i / groups.core.length) * Math.PI * 2;
    const r = 1.5;
    positions[id] = [
      Math.cos(angle) * r + (seededRandom(i * 7) - 0.5) * 0.5,
      (seededRandom(i * 13) - 0.5) * 1,
      Math.sin(angle) * r + (seededRandom(i * 19) - 0.5) * 0.5,
    ];
  });

  // AI Features: inner ring
  groups['ai-features'].forEach((id, i) => {
    const angle = (i / groups['ai-features'].length) * Math.PI * 2 + 0.3;
    const r = 5;
    positions[id] = [
      Math.cos(angle) * r + (seededRandom(i * 11) - 0.5) * 0.8,
      (seededRandom(i * 17) - 0.5) * 2.5,
      Math.sin(angle) * r + (seededRandom(i * 23) - 0.5) * 0.8,
    ];
  });

  // AI Products: outer ring
  groups['ai-products'].forEach((id, i) => {
    const angle = (i / groups['ai-products'].length) * Math.PI * 2 + 0.7;
    const r = 8;
    positions[id] = [
      Math.cos(angle) * r + (seededRandom(i * 29) - 0.5) * 1,
      (seededRandom(i * 31) - 0.5) * 3 + 1.5,
      Math.sin(angle) * r + (seededRandom(i * 37) - 0.5) * 1,
    ];
  });

  // Infrastructure: top cluster
  groups.infrastructure.forEach((id, i) => {
    const angle = (i / groups.infrastructure.length) * Math.PI * 2;
    const r = 3.5;
    positions[id] = [
      Math.cos(angle) * r + (seededRandom(i * 41) - 0.5) * 0.6,
      5 + (seededRandom(i * 43) - 0.5) * 1.5,
      Math.sin(angle) * r + (seededRandom(i * 47) - 0.5) * 0.6,
    ];
  });

  // Data: bottom cluster
  groups.data.forEach((id, i) => {
    const angle = (i / groups.data.length) * Math.PI * 2 + 0.5;
    const r = 4;
    positions[id] = [
      Math.cos(angle) * r + (seededRandom(i * 53) - 0.5) * 0.6,
      -5 + (seededRandom(i * 59) - 0.5) * 1.5,
      Math.sin(angle) * r + (seededRandom(i * 61) - 0.5) * 0.6,
    ];
  });

  return positions;
}

// ─── 3D Components ───────────────────────────────────────────────────────────

function GraphNode({
  node,
  position,
  selected,
  onSelect,
}: {
  node: NodeData;
  position: [number, number, number];
  selected: boolean;
  onSelect: (node: NodeData | null) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const color = CATEGORY_META[node.category].color;

  useFrame(() => {
    if (!meshRef.current) return;
    const mat = meshRef.current.material as THREE.MeshStandardMaterial;
    const targetEmissive = hovered || selected ? 0.6 : 0.2;
    mat.emissiveIntensity += (targetEmissive - mat.emissiveIntensity) * 0.1;
    const targetScale = hovered ? 1.3 : selected ? 1.15 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  const handlePointerOver = useCallback((e: THREE.Event) => {
    (e as any).stopPropagation();
    setHovered(true);
    document.body.style.cursor = 'pointer';
  }, []);

  const handlePointerOut = useCallback(() => {
    setHovered(false);
    document.body.style.cursor = 'auto';
  }, []);

  const handleClick = useCallback((e: THREE.Event) => {
    (e as any).stopPropagation();
    onSelect(selected ? null : node);
  }, [node, selected, onSelect]);

  const radius = node.category === 'core' ? 0.4 : 0.3;

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
        onClick={handleClick}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
      {/* Label */}
      <Html
        center
        distanceFactor={15}
        style={{
          pointerEvents: 'none',
          userSelect: 'none',
          whiteSpace: 'nowrap',
        }}
      >
        <div
          className="text-white text-xs font-medium px-2 py-0.5 rounded-full"
          style={{
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(4px)',
            fontSize: '11px',
            transform: 'translateY(-24px)',
          }}
        >
          {node.label}
        </div>
      </Html>
      {/* Hover tooltip */}
      {hovered && (
        <Html
          center
          distanceFactor={12}
          style={{ pointerEvents: 'none', userSelect: 'none', whiteSpace: 'nowrap' }}
        >
          <div
            style={{
              background: 'rgba(0,0,0,0.85)',
              backdropFilter: 'blur(8px)',
              border: `1px solid ${color}`,
              borderRadius: '8px',
              padding: '8px 12px',
              transform: 'translateY(-48px)',
              maxWidth: '220px',
              whiteSpace: 'normal',
            }}
          >
            <div style={{ color, fontWeight: 600, fontSize: '12px', marginBottom: '2px' }}>
              {node.label}
            </div>
            <div style={{ color: '#ccc', fontSize: '11px', lineHeight: '1.3' }}>
              {node.description}
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}

function GraphEdge({
  from,
  to,
}: {
  from: [number, number, number];
  to: [number, number, number];
}) {
  return (
    <Line
      points={[from, to]}
      color="white"
      opacity={0.12}
      transparent
      lineWidth={1}
    />
  );
}

function AutoRotate({ enabled }: { enabled: boolean }) {
  const { camera } = useThree();
  const angleRef = useRef(0);

  useFrame((_, delta) => {
    if (!enabled) return;
    angleRef.current += delta * 0.08;
    const radius = Math.sqrt(camera.position.x ** 2 + camera.position.z ** 2);
    camera.position.x = Math.cos(angleRef.current) * radius;
    camera.position.z = Math.sin(angleRef.current) * radius;
    camera.lookAt(0, 0, 0);
  });

  return null;
}

function Scene({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: NodeData | null;
  onSelectNode: (node: NodeData | null) => void;
}) {
  const [interacting, setInteracting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const positions = useMemo(computePositions, []);

  const handleInteractionStart = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setInteracting(true);
  }, []);

  const handleInteractionEnd = useCallback(() => {
    timeoutRef.current = setTimeout(() => setInteracting(false), 3000);
  }, []);

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -5, -10]} intensity={0.5} color="#3b82f6" />
      <pointLight position={[0, 10, 0]} intensity={0.3} color="#02a95c" />

      {/* Edges */}
      {EDGES.map(([fromId, toId], i) => {
        const from = positions[fromId];
        const to = positions[toId];
        if (!from || !to) return null;
        return <GraphEdge key={i} from={from} to={to} />;
      })}

      {/* Nodes */}
      {NODES.map((node) => {
        const pos = positions[node.id];
        if (!pos) return null;
        return (
          <GraphNode
            key={node.id}
            node={node}
            position={pos}
            selected={selectedNode?.id === node.id}
            onSelect={onSelectNode}
          />
        );
      })}

      <OrbitControls
        enablePan
        enableZoom
        enableRotate
        minDistance={5}
        maxDistance={35}
        onStart={handleInteractionStart}
        onEnd={handleInteractionEnd}
      />
      <AutoRotate enabled={!interacting} />
    </>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function ExploreCanvas({
  selectedNode,
  onSelectNode,
}: {
  selectedNode: NodeData | null;
  onSelectNode: (node: NodeData | null) => void;
}) {
  return (
    <Canvas
      camera={{ position: [12, 8, 12], fov: 55 }}
      style={{ background: '#0a0a0a' }}
      gl={{ antialias: true }}
      onPointerMissed={() => onSelectNode(null)}
    >
      <Scene selectedNode={selectedNode} onSelectNode={onSelectNode} />
    </Canvas>
  );
}

export type { NodeData, Category };
export { CATEGORY_META };
