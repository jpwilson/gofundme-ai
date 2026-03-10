'use client';

import { useState, useEffect } from 'react';
import {
  Bot, GitPullRequest, Ticket, Calendar, Zap, CheckCircle2,
  AlertCircle, Clock, ArrowRight, ToggleLeft, ToggleRight,
  MessageSquare, Link2, BarChart3, Target, CircleDot, Layers,
  Bug, BookOpen, ListTodo, Filter,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────

type TicketType = 'bug' | 'story' | 'task' | 'epic';
type TicketStatus = 'todo' | 'in-progress' | 'review' | 'done';
type Priority = 'critical' | 'high' | 'medium' | 'low';
type ActionKind = 'created-ticket' | 'assigned' | 'moved' | 'commented' | 'linked-pr' | 'sprint-planned' | 'reviewed-pr';
type PRStatus = 'approved' | 'changes-requested' | 'pending';
type TabId = 'timeline' | 'tickets' | 'sprints' | 'automations';

interface JiraTicket {
  key: string; title: string; type: TicketType; status: TicketStatus;
  priority: Priority; assignee: string; sprint: string;
  createdByAgent: boolean; estimatedPoints: number;
}
interface AgentAction {
  timestamp: string; action: ActionKind; detail: string; ticketKey?: string;
}
interface SprintData {
  name: string; startDate: string; endDate: string;
  totalPoints: number; completedPoints: number;
}
interface PRReview {
  prNumber: number; title: string; author: string; status: PRStatus;
  aiSummary: string; filesChanged: number; linesAdded: number; linesRemoved: number;
}
interface WorkflowAutomation {
  name: string; trigger: string; action: string;
  runsThisWeek: number; lastRun: string; enabled: boolean;
}

// ── Mock Data ──────────────────────────────────────────────────────────

const JIRA_TICKETS: JiraTicket[] = [
  { key: 'GFM-1234', title: 'Donation checkout flow drops sessions on mobile Safari', type: 'bug', status: 'in-progress', priority: 'critical', assignee: 'Maya Chen', sprint: 'Sprint 24', createdByAgent: false, estimatedPoints: 5 },
  { key: 'GFM-1235', title: 'Implement recurring donation subscription management', type: 'story', status: 'review', priority: 'high', assignee: 'Jordan Lee', sprint: 'Sprint 24', createdByAgent: true, estimatedPoints: 8 },
  { key: 'GFM-1236', title: 'Add Stripe Connect onboarding for campaign organizers', type: 'story', status: 'todo', priority: 'high', assignee: 'Sam Rivera', sprint: 'Sprint 24', createdByAgent: false, estimatedPoints: 5 },
  { key: 'GFM-1237', title: 'Optimize campaign image loading with lazy load and WebP', type: 'task', status: 'done', priority: 'medium', assignee: 'Alex Kim', sprint: 'Sprint 24', createdByAgent: true, estimatedPoints: 3 },
  { key: 'GFM-1238', title: 'Campaign discovery and recommendation engine epic', type: 'epic', status: 'in-progress', priority: 'high', assignee: 'Maya Chen', sprint: 'Sprint 24', createdByAgent: false, estimatedPoints: 13 },
  { key: 'GFM-1239', title: 'Fix currency formatting inconsistency in donation receipts', type: 'bug', status: 'done', priority: 'medium', assignee: 'Jordan Lee', sprint: 'Sprint 24', createdByAgent: true, estimatedPoints: 2 },
  { key: 'GFM-1240', title: 'Set up E2E tests for donation flow with Playwright', type: 'task', status: 'todo', priority: 'medium', assignee: 'Sam Rivera', sprint: 'Sprint 25', createdByAgent: false, estimatedPoints: 5 },
  { key: 'GFM-1241', title: 'Social sharing preview cards render incorrect metadata', type: 'bug', status: 'review', priority: 'high', assignee: 'Alex Kim', sprint: 'Sprint 24', createdByAgent: true, estimatedPoints: 3 },
  { key: 'GFM-1242', title: 'Build campaign milestone notifications system', type: 'story', status: 'todo', priority: 'low', assignee: 'Maya Chen', sprint: 'Sprint 25', createdByAgent: false, estimatedPoints: 8 },
  { key: 'GFM-1243', title: 'Migrate fundraiser search from REST to GraphQL', type: 'task', status: 'in-progress', priority: 'medium', assignee: 'Jordan Lee', sprint: 'Sprint 24', createdByAgent: true, estimatedPoints: 5 },
];

const AGENT_ACTIONS: AgentAction[] = [
  { timestamp: '2026-03-10T09:02:00Z', action: 'created-ticket', detail: 'Created bug ticket from Sentry alert: recurring payment webhook timeout', ticketKey: 'GFM-1241' },
  { timestamp: '2026-03-10T08:45:00Z', action: 'reviewed-pr', detail: 'Reviewed PR #342 — approved with minor suggestions on error handling', ticketKey: 'GFM-1237' },
  { timestamp: '2026-03-10T08:30:00Z', action: 'assigned', detail: 'Auto-assigned GFM-1235 to Jordan Lee based on expertise match', ticketKey: 'GFM-1235' },
  { timestamp: '2026-03-10T08:15:00Z', action: 'moved', detail: 'Moved GFM-1237 to Done — all checks passed', ticketKey: 'GFM-1237' },
  { timestamp: '2026-03-10T07:55:00Z', action: 'linked-pr', detail: 'Linked PR #339 to GFM-1234 based on branch naming convention', ticketKey: 'GFM-1234' },
  { timestamp: '2026-03-10T07:40:00Z', action: 'commented', detail: 'Added investigation notes on Safari session storage limitations', ticketKey: 'GFM-1234' },
  { timestamp: '2026-03-10T07:20:00Z', action: 'sprint-planned', detail: 'Suggested sprint backlog for Sprint 25 — 38 points across 7 tickets' },
  { timestamp: '2026-03-09T18:30:00Z', action: 'reviewed-pr', detail: 'Requested changes on PR #338 — missing input validation on donation amount', ticketKey: 'GFM-1236' },
  { timestamp: '2026-03-09T17:45:00Z', action: 'created-ticket', detail: 'Created task ticket for WebP image migration based on Lighthouse report', ticketKey: 'GFM-1237' },
  { timestamp: '2026-03-09T16:00:00Z', action: 'assigned', detail: 'Reassigned GFM-1239 to Jordan Lee — previous assignee on PTO', ticketKey: 'GFM-1239' },
  { timestamp: '2026-03-09T14:20:00Z', action: 'moved', detail: 'Moved GFM-1239 to Done after QA verification', ticketKey: 'GFM-1239' },
  { timestamp: '2026-03-09T13:10:00Z', action: 'linked-pr', detail: 'Linked PR #336 to GFM-1243 — GraphQL migration branch', ticketKey: 'GFM-1243' },
  { timestamp: '2026-03-09T11:00:00Z', action: 'commented', detail: 'Flagged potential regression in donation receipt email template', ticketKey: 'GFM-1239' },
  { timestamp: '2026-03-09T09:30:00Z', action: 'sprint-planned', detail: 'Identified 3 at-risk tickets for Sprint 24 based on velocity trends' },
  { timestamp: '2026-03-09T08:00:00Z', action: 'reviewed-pr', detail: 'Approved PR #335 — clean implementation of lazy loading', ticketKey: 'GFM-1237' },
];

const SPRINT_DATA: SprintData = {
  name: 'Sprint 24', startDate: '2026-02-24', endDate: '2026-03-10',
  totalPoints: 34, completedPoints: 21,
};

const PAST_SPRINTS = [
  { name: 'Sprint 23', planned: 30, completed: 28 },
  { name: 'Sprint 22', planned: 32, completed: 26 },
  { name: 'Sprint 21', planned: 28, completed: 27 },
];

const PR_REVIEWS: PRReview[] = [
  { prNumber: 342, title: 'feat: campaign image lazy load + WebP conversion', author: 'Alex Kim', status: 'approved', aiSummary: 'Well-structured lazy loading implementation with proper IntersectionObserver cleanup. WebP fallback chain looks solid.', filesChanged: 8, linesAdded: 245, linesRemoved: 42 },
  { prNumber: 339, title: 'fix: Safari session persistence in checkout', author: 'Maya Chen', status: 'pending', aiSummary: 'Addresses Safari ITP by switching to server-side session management. Needs integration test coverage.', filesChanged: 5, linesAdded: 132, linesRemoved: 67 },
  { prNumber: 338, title: 'feat: Stripe Connect organizer onboarding', author: 'Sam Rivera', status: 'changes-requested', aiSummary: 'Missing server-side validation on donation amount field. OAuth flow looks correct but error states need handling.', filesChanged: 12, linesAdded: 480, linesRemoved: 15 },
  { prNumber: 336, title: 'refactor: migrate search to GraphQL', author: 'Jordan Lee', status: 'approved', aiSummary: 'Clean migration with proper query batching. Response types are well-defined. Performance benchmarks show 40% improvement.', filesChanged: 14, linesAdded: 620, linesRemoved: 380 },
  { prNumber: 335, title: 'feat: recurring donation management UI', author: 'Jordan Lee', status: 'approved', aiSummary: 'Subscription management UI with cancel/pause/resume flows. Accessibility is well handled with ARIA labels.', filesChanged: 6, linesAdded: 310, linesRemoved: 20 },
];

const WORKFLOW_AUTOMATIONS: WorkflowAutomation[] = [
  { name: 'Sentry → Jira Bug Creation', trigger: 'New Sentry error with >10 occurrences', action: 'Create bug ticket with stack trace and affected users count', runsThisWeek: 4, lastRun: '2026-03-10T09:02:00Z', enabled: true },
  { name: 'PR Auto-Link', trigger: 'PR opened with branch matching GFM-* pattern', action: 'Link PR to corresponding Jira ticket and update status', runsThisWeek: 12, lastRun: '2026-03-10T07:55:00Z', enabled: true },
  { name: 'Sprint Risk Alert', trigger: 'Daily at 9 AM during active sprint', action: 'Analyze velocity and flag at-risk tickets in Slack', runsThisWeek: 5, lastRun: '2026-03-10T09:00:00Z', enabled: true },
  { name: 'Auto-Assign by Expertise', trigger: 'Unassigned ticket older than 2 hours', action: 'Assign to team member based on skill match and workload', runsThisWeek: 3, lastRun: '2026-03-10T08:30:00Z', enabled: true },
  { name: 'Stale PR Reminder', trigger: 'PR with no activity for 48 hours', action: 'Post reminder in Slack and add comment on PR', runsThisWeek: 2, lastRun: '2026-03-09T10:00:00Z', enabled: false },
  { name: 'Release Notes Generator', trigger: 'Sprint marked as complete', action: 'Generate release notes from merged PRs and ticket descriptions', runsThisWeek: 0, lastRun: '2026-03-03T17:00:00Z', enabled: true },
];

// ── Helpers ─────────────────────────────────────────────────────────────

const typeColor: Record<TicketType, string> = { bug: 'bg-red-100 text-red-700', story: 'bg-blue-100 text-blue-700', task: 'bg-emerald-100 text-emerald-700', epic: 'bg-purple-100 text-purple-700' };
const typeIcon: Record<TicketType, React.ReactNode> = { bug: <Bug size={14} />, story: <BookOpen size={14} />, task: <ListTodo size={14} />, epic: <Layers size={14} /> };
const priorityDot: Record<Priority, string> = { critical: 'bg-red-500', high: 'bg-orange-500', medium: 'bg-yellow-500', low: 'bg-gray-400' };
const statusLabel: Record<TicketStatus, string> = { todo: 'To Do', 'in-progress': 'In Progress', review: 'Review', done: 'Done' };
const prStatusStyle: Record<PRStatus, string> = { approved: 'bg-emerald-100 text-emerald-700', 'changes-requested': 'bg-amber-100 text-amber-700', pending: 'bg-gray-100 text-gray-600' };

const actionDot: Record<ActionKind, string> = {
  'created-ticket': 'bg-blue-500', assigned: 'bg-blue-400', moved: 'bg-blue-500',
  commented: 'bg-purple-500', 'linked-pr': 'bg-emerald-500',
  'sprint-planned': 'bg-amber-500', 'reviewed-pr': 'bg-emerald-500',
};

const actionIcon: Record<ActionKind, React.ReactNode> = {
  'created-ticket': <Ticket size={14} />, assigned: <ArrowRight size={14} />,
  moved: <ArrowRight size={14} />, commented: <MessageSquare size={14} />,
  'linked-pr': <Link2 size={14} />, 'sprint-planned': <Calendar size={14} />,
  'reviewed-pr': <GitPullRequest size={14} />,
};

function relativeTime(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ── Component ──────────────────────────────────────────────────────────

export default function JiraAgentPage() {
  const [tab, setTab] = useState<TabId>('timeline');
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'created-ticket' | 'reviewed-pr' | 'sprint-planned'>('all');
  const [actions, setActions] = useState(AGENT_ACTIONS);
  const [automations, setAutomations] = useState(WORKFLOW_AUTOMATIONS);

  // Auto-add timeline event every 6 seconds
  useEffect(() => {
    const templates: AgentAction[] = [
      { timestamp: '', action: 'commented', detail: 'Added performance benchmark results to ticket', ticketKey: 'GFM-1243' },
      { timestamp: '', action: 'moved', detail: 'Moved GFM-1235 to Review — PR linked and tests passing', ticketKey: 'GFM-1235' },
      { timestamp: '', action: 'assigned', detail: 'Auto-assigned incoming bug to Maya Chen based on domain expertise', ticketKey: 'GFM-1234' },
      { timestamp: '', action: 'reviewed-pr', detail: 'Approved PR #343 — donation receipt template fix verified', ticketKey: 'GFM-1239' },
      { timestamp: '', action: 'created-ticket', detail: 'Created task for accessibility audit on campaign pages', ticketKey: 'GFM-1244' },
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const t = templates[idx % templates.length];
      setActions(prev => [{ ...t, timestamp: new Date().toISOString() }, ...prev]);
      idx++;
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const filteredActions = timelineFilter === 'all' ? actions : actions.filter(a => a.action === timelineFilter);
  const agentCreatedCount = JIRA_TICKETS.filter(t => t.createdByAgent).length;

  const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
    { id: 'timeline', label: 'Timeline', icon: <Clock size={16} /> },
    { id: 'tickets', label: 'Tickets', icon: <Ticket size={16} /> },
    { id: 'sprints', label: 'Sprints', icon: <Calendar size={16} /> },
    { id: 'automations', label: 'Automations', icon: <Zap size={16} /> },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gfm-green/10">
          <Bot size={28} className="text-gfm-green" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gfm-dark">AI Agent — Jira Integration</h1>
          <p className="mt-1 text-sm text-gfm-secondary">Autonomous project management agent that creates tickets, reviews PRs, plans sprints, and keeps your board healthy.</p>
        </div>
        <span className="ml-auto flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          <CircleDot size={12} /> Agent Online
        </span>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-lg border border-gfm-border bg-gfm-bg p-1">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex items-center gap-1.5 rounded-md px-4 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-white text-gfm-dark shadow-sm' : 'text-gfm-secondary hover:text-gfm-dark'}`}>
            {t.icon}{t.label}
          </button>
        ))}
      </div>

      {/* ─── Timeline ────────────────────────────────────────────── */}
      {tab === 'timeline' && (
        <div>
          <div className="mb-4 flex flex-wrap gap-2">
            {(['all', 'created-ticket', 'reviewed-pr', 'sprint-planned'] as const).map(f => (
              <button key={f} onClick={() => setTimelineFilter(f)}
                className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium transition ${timelineFilter === f ? 'bg-gfm-green text-white' : 'border border-gfm-border bg-white text-gfm-secondary hover:border-gfm-green hover:text-gfm-green'}`}>
                <Filter size={12} />
                {f === 'all' ? 'All' : f === 'created-ticket' ? 'Ticket Creation' : f === 'reviewed-pr' ? 'PR Reviews' : 'Sprint Planning'}
              </button>
            ))}
          </div>

          <div className="relative ml-4 border-l-2 border-gfm-green/30 pl-6">
            {filteredActions.slice(0, 20).map((a, i) => (
              <div key={`${a.timestamp}-${i}`} className="relative mb-5 last:mb-0">
                <span className={`absolute -left-[31px] top-1 flex h-5 w-5 items-center justify-center rounded-full text-white ${actionDot[a.action]}`}>
                  {actionIcon[a.action]}
                </span>
                <div className="rounded-xl border border-gfm-border bg-white p-4">
                  <div className="flex items-center gap-2 text-xs text-gfm-secondary">
                    <Clock size={12} />
                    <span>{relativeTime(a.timestamp)}</span>
                    {a.ticketKey && (
                      <span className="rounded bg-blue-100 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700">{a.ticketKey}</span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gfm-dark">{a.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Tickets (Kanban) ────────────────────────────────────── */}
      {tab === 'tickets' && (
        <div>
          {/* Summary bar */}
          <div className="mb-5 grid grid-cols-3 gap-4">
            {[
              { label: 'Total Tickets', value: JIRA_TICKETS.length, icon: <Ticket size={18} className="text-gfm-green" /> },
              { label: 'AI-Created', value: `${Math.round((agentCreatedCount / JIRA_TICKETS.length) * 100)}%`, icon: <Bot size={18} className="text-blue-500" /> },
              { label: 'Avg Cycle Time', value: '3.2 days', icon: <Clock size={18} className="text-amber-500" /> },
            ].map(s => (
              <div key={s.label} className="rounded-xl border border-gfm-border bg-white p-4 flex items-center gap-3">
                <div className="rounded-lg bg-gfm-bg p-2">{s.icon}</div>
                <div>
                  <p className="text-lg font-bold text-gfm-dark">{s.value}</p>
                  <p className="text-xs text-gfm-secondary">{s.label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Kanban columns */}
          <div className="grid grid-cols-4 gap-4">
            {(['todo', 'in-progress', 'review', 'done'] as TicketStatus[]).map(status => (
              <div key={status}>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gfm-dark">{statusLabel[status]}</h3>
                  <span className="rounded-full bg-gfm-bg px-2 py-0.5 text-xs text-gfm-secondary">
                    {JIRA_TICKETS.filter(t => t.status === status).length}
                  </span>
                </div>
                <div className="space-y-3">
                  {JIRA_TICKETS.filter(t => t.status === status).map(ticket => (
                    <div key={ticket.key} className="rounded-xl border border-gfm-border bg-white p-4">
                      <div className="mb-2 flex items-center gap-2">
                        <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold ${typeColor[ticket.type]}`}>
                          {typeIcon[ticket.type]} {ticket.type}
                        </span>
                        <span className="text-xs font-mono text-gfm-secondary">{ticket.key}</span>
                      </div>
                      <p className="mb-3 text-sm font-medium text-gfm-dark leading-snug">{ticket.title}</p>
                      <div className="flex items-center justify-between text-xs text-gfm-secondary">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${priorityDot[ticket.priority]}`} title={ticket.priority} />
                          <span>{ticket.assignee.split(' ')[0]}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {ticket.createdByAgent && (
                            <span className="flex items-center gap-0.5 rounded bg-gfm-green/10 px-1.5 py-0.5 text-[10px] font-medium text-gfm-green">
                              <Bot size={10} /> Agent
                            </span>
                          )}
                          <span className="rounded bg-gfm-bg px-1.5 py-0.5 font-medium">{ticket.estimatedPoints}pt</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── Sprints ─────────────────────────────────────────────── */}
      {tab === 'sprints' && (
        <div className="space-y-6">
          {/* Current Sprint */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gfm-dark">{SPRINT_DATA.name}</h3>
                <p className="text-xs text-gfm-secondary">{SPRINT_DATA.startDate} → {SPRINT_DATA.endDate}</p>
              </div>
              <span className="rounded-full bg-gfm-green/10 px-3 py-1 text-sm font-semibold text-gfm-green">
                {Math.round((SPRINT_DATA.completedPoints / SPRINT_DATA.totalPoints) * 100)}% Complete
              </span>
            </div>
            <div className="mb-2 flex justify-between text-xs text-gfm-secondary">
              <span>{SPRINT_DATA.completedPoints} pts done</span>
              <span>{SPRINT_DATA.totalPoints} pts total</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-gfm-bg">
              <div className="h-full rounded-full bg-gfm-green transition-all"
                style={{ width: `${(SPRINT_DATA.completedPoints / SPRINT_DATA.totalPoints) * 100}%` }} />
            </div>
          </div>

          {/* Sprint Velocity */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gfm-dark">
              <BarChart3 size={16} className="text-gfm-green" /> Sprint Velocity
            </h3>
            <div className="space-y-3">
              {[...PAST_SPRINTS, { name: SPRINT_DATA.name, planned: SPRINT_DATA.totalPoints, completed: SPRINT_DATA.completedPoints }].map(s => (
                <div key={s.name}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium text-gfm-dark">{s.name}</span>
                    <span className="text-gfm-secondary">{s.completed} / {s.planned} pts</span>
                  </div>
                  <div className="flex h-5 overflow-hidden rounded bg-gfm-bg">
                    <div className="rounded bg-gfm-green/70 transition-all" style={{ width: `${(s.completed / 40) * 100}%` }} />
                    <div className="rounded-r bg-gfm-green/20" style={{ width: `${((s.planned - s.completed) / 40) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PR Reviews */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gfm-dark">
              <GitPullRequest size={16} className="text-gfm-green" /> PR Reviews
            </h3>
            <div className="space-y-3">
              {PR_REVIEWS.map(pr => (
                <div key={pr.prNumber} className="rounded-lg border border-gfm-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-xs font-mono text-gfm-secondary">#{pr.prNumber}</span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${prStatusStyle[pr.status]}`}>
                          {pr.status === 'changes-requested' ? 'Changes Requested' : pr.status.charAt(0).toUpperCase() + pr.status.slice(1)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gfm-dark">{pr.title}</p>
                      <p className="mt-1 text-xs text-gfm-secondary">by {pr.author}</p>
                    </div>
                    <div className="flex gap-3 text-[11px] text-gfm-secondary whitespace-nowrap">
                      <span>{pr.filesChanged} files</span>
                      <span className="text-emerald-600">+{pr.linesAdded}</span>
                      <span className="text-red-500">-{pr.linesRemoved}</span>
                    </div>
                  </div>
                  <div className="mt-2 rounded-lg bg-gfm-bg p-2.5 text-xs text-gfm-secondary">
                    <span className="mr-1 font-medium text-gfm-green">AI Summary:</span>{pr.aiSummary}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── Automations ─────────────────────────────────────────── */}
      {tab === 'automations' && (
        <div className="space-y-6">
          {/* Agent Performance */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gfm-dark">
              <Target size={16} className="text-gfm-green" /> Agent Performance
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Total Actions (7d)', value: '47', icon: <Zap size={18} className="text-gfm-green" /> },
                { label: 'Avg Response Time', value: '1.8s', icon: <Clock size={18} className="text-blue-500" /> },
                { label: 'Success Rate', value: '98.4%', icon: <CheckCircle2 size={18} className="text-emerald-500" /> },
              ].map(m => (
                <div key={m.label} className="flex items-center gap-3 rounded-lg bg-gfm-bg p-3">
                  {m.icon}
                  <div>
                    <p className="text-lg font-bold text-gfm-dark">{m.value}</p>
                    <p className="text-xs text-gfm-secondary">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Agent Decisions */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gfm-dark">
              <AlertCircle size={16} className="text-amber-500" /> Recent Agent Decisions
            </h3>
            <div className="space-y-2">
              {[
                { decision: 'Escalated GFM-1234 to critical after 3rd Sentry spike in 1 hour', confidence: 97, time: '12m ago' },
                { decision: 'Deferred auto-assign on GFM-1242 — low priority, team at capacity', confidence: 84, time: '2h ago' },
                { decision: 'Recommended splitting GFM-1238 epic into 4 sub-stories', confidence: 91, time: '5h ago' },
              ].map(d => (
                <div key={d.decision} className="flex items-center gap-3 rounded-lg bg-gfm-bg p-3">
                  <div className="flex-1">
                    <p className="text-sm text-gfm-dark">{d.decision}</p>
                    <p className="mt-0.5 text-[11px] text-gfm-secondary">{d.time}</p>
                  </div>
                  <span className="whitespace-nowrap rounded-full bg-emerald-100 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                    {d.confidence}% conf
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Workflow Rules */}
          <div className="rounded-xl border border-gfm-border bg-white p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gfm-dark">
              <Zap size={16} className="text-gfm-green" /> Workflow Automations
            </h3>
            <div className="space-y-3">
              {automations.map((rule, idx) => (
                <div key={rule.name} className="rounded-lg border border-gfm-border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <p className="text-sm font-medium text-gfm-dark">{rule.name}</p>
                        {!rule.enabled && (
                          <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] text-gray-500">Disabled</span>
                        )}
                      </div>
                      <p className="text-xs text-gfm-secondary"><span className="font-medium">Trigger:</span> {rule.trigger}</p>
                      <p className="text-xs text-gfm-secondary"><span className="font-medium">Action:</span> {rule.action}</p>
                      <div className="mt-2 flex items-center gap-3 text-[11px] text-gfm-secondary">
                        <span>{rule.runsThisWeek} runs this week</span>
                        <span>Last: {relativeTime(rule.lastRun)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setAutomations(prev => prev.map((r, i) => i === idx ? { ...r, enabled: !r.enabled } : r))}
                      className="mt-1 flex-shrink-0"
                      title={rule.enabled ? 'Disable' : 'Enable'}
                    >
                      {rule.enabled
                        ? <ToggleRight size={28} className="text-gfm-green" />
                        : <ToggleLeft size={28} className="text-gray-400" />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
