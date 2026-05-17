'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Video, FileText, ClipboardList, Megaphone, Users, Plus, GraduationCap, Star, X, Loader2, UserCheck, UserX, MailQuestion } from 'lucide-react';
import { api, type Batch, type BatchTeacher, type LiveClass, type Material, type Announcement, type AuthUser, type EnrolmentRequest } from '@/lib/api';
import { useAuthStore } from '@/lib/stores/authStore';
import { Button } from '@/app/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/app/components/ui/tabs';
import { ClassCard } from './ClassCard';
import { MaterialCard } from './MaterialCard';
import { EmptyState } from './EmptyState';

interface Props {
  batchId: number;
  canManage: boolean; // teacher of batch / super_admin
  basePath: string;   // e.g. /dashboard/teacher/batches/12
}

export function BatchDetail({ batchId, canManage, basePath }: Props) {
  const [tab, setTab] = useState('overview');
  const user = useAuthStore((s) => s.user);
  const isSuperAdmin = user?.role === 'super_admin' || user?.role === 'admin';

  const batchQ = useQuery({
    queryKey: ['batch', batchId],
    queryFn: () => api.batches.get(batchId) as Promise<Batch>,
  });
  const classesQ = useQuery({
    queryKey: ['batch', batchId, 'classes'],
    queryFn: () => api.classes.listForBatch(batchId) as Promise<LiveClass[]>,
  });
  const materialsQ = useQuery({
    queryKey: ['batch', batchId, 'materials'],
    queryFn: () => api.materials.listForBatch(batchId) as Promise<Material[]>,
  });
  const announceQ = useQuery({
    queryKey: ['batch', batchId, 'announcements'],
    queryFn: () => api.announcements.listForBatch(batchId) as Promise<Announcement[]>,
  });

  // Pending enrolment requests — drives the Requests tab badge for managers.
  const requestsQ = useQuery({
    queryKey: ['batch', batchId, 'enrolment-requests', 'pending'],
    queryFn: () => api.batches.listEnrolmentRequests(batchId, 'pending') as Promise<EnrolmentRequest[]>,
    enabled: canManage,
  });
  const pendingCount = requestsQ.data?.length ?? 0;

  if (batchQ.isLoading) return <p className="text-sm text-muted-foreground">Loading…</p>;
  if (batchQ.error || !batchQ.data) return <p className="text-sm text-destructive">Failed to load batch.</p>;
  const batch = batchQ.data;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">{batch.course_title}</p>
        <h1 className="text-3xl font-bold tracking-tight">{batch.name}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {format(new Date(batch.start_date), 'PP')}
          {batch.end_date && ` – ${format(new Date(batch.end_date), 'PP')}`}
          {batch.schedule_description && ` · ${batch.schedule_description}`}
        </p>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full md:w-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="materials">Materials</TabsTrigger>
          <TabsTrigger value="announcements">Announcements</TabsTrigger>
          <TabsTrigger value="people">People</TabsTrigger>
          {canManage && (
            <TabsTrigger value="requests" className="relative">
              Requests
              {pendingCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold tabular-nums">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
          )}
          {isSuperAdmin && <TabsTrigger value="teachers">Teachers</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-4 pt-4">
          <div className="grid sm:grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Students</p>
              <p className="text-2xl font-bold">{batch.students?.length ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Teachers</p>
              <p className="text-2xl font-bold">{batch.teachers?.length ?? 0}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="text-2xl font-bold capitalize">{batch.status}</p>
            </div>
          </div>
          <AttendanceCard batchId={batchId} />
        </TabsContent>

        <TabsContent value="classes" className="space-y-4 pt-4">
          {canManage && (
            <div className="flex justify-end">
              <Button asChild>
                <Link href={`${basePath}/classes/new`}>
                  <Plus className="h-4 w-4 mr-1" /> Schedule class
                </Link>
              </Button>
            </div>
          )}
          {classesQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !classesQ.data || classesQ.data.length === 0 ? (
            <EmptyState icon={<Video className="h-6 w-6" />} title="No classes yet" description="Scheduled classes will appear here." />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {classesQ.data.map((c) => (
                <ClassCard key={c.id} cls={c} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="materials" className="space-y-4 pt-4">
          {canManage && (
            <div className="flex justify-end">
              <Button asChild>
                <Link href={`${basePath}/materials/new`}>
                  <Plus className="h-4 w-4 mr-1" /> Upload material
                </Link>
              </Button>
            </div>
          )}
          {materialsQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !materialsQ.data || materialsQ.data.length === 0 ? (
            <EmptyState icon={<FileText className="h-6 w-6" />} title="No materials yet" description="Notes, PDFs, and links will appear here." />
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {materialsQ.data.map((m) => (
                <MaterialCard key={m.id} material={m} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="announcements" className="space-y-4 pt-4">
          {canManage && (
            <div className="flex justify-end">
              <Button asChild>
                <Link href={`${basePath}/announcements/new`}>
                  <Plus className="h-4 w-4 mr-1" /> Post announcement
                </Link>
              </Button>
            </div>
          )}
          {announceQ.isLoading ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : !announceQ.data || announceQ.data.length === 0 ? (
            <EmptyState icon={<Megaphone className="h-6 w-6" />} title="Nothing announced yet" />
          ) : (
            <ul className="space-y-3">
              {announceQ.data.map((a) => (
                <li key={a.id} className="rounded-xl border border-border bg-card p-4">
                  <div className="flex items-center gap-2">
                    {a.is_pinned && <span className="text-[10px] uppercase tracking-wide text-primary font-semibold">Pinned</span>}
                    <h4 className="font-semibold">{a.title}</h4>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {a.poster_name || a.poster_username || 'Staff'} · {format(new Date(a.created_at), 'PP p')}
                  </p>
                  <p className="text-sm mt-2 whitespace-pre-wrap">{a.body}</p>
                </li>
              ))}
            </ul>
          )}
        </TabsContent>

        {canManage && (
          <TabsContent value="requests" className="space-y-4 pt-4">
            <RequestsManager batchId={batchId} />
          </TabsContent>
        )}

        {isSuperAdmin && (
          <TabsContent value="teachers" className="space-y-4 pt-4">
            <TeachersManager
              batchId={batchId}
              teachers={batch.teachers ?? []}
              onChange={() => batchQ.refetch()}
            />
          </TabsContent>
        )}

        <TabsContent value="people" className="space-y-4 pt-4">
          <section>
            <h3 className="font-semibold mb-2">Teachers</h3>
            <ul className="space-y-1.5">
              {batch.teachers?.map((t) => (
                <li key={t.id} className="text-sm flex items-center justify-between border-b border-border py-1.5 last:border-0">
                  <span>
                    {t.full_name || t.username}
                    {t.is_primary && <span className="ml-2 text-[10px] uppercase tracking-wide text-primary font-semibold">primary</span>}
                  </span>
                </li>
              ))}
              {(!batch.teachers || batch.teachers.length === 0) && (
                <li className="text-sm text-muted-foreground">No teachers assigned.</li>
              )}
            </ul>
          </section>
          <section>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4" />
                Students ({batch.students?.length ?? 0})
              </h3>
              {canManage && (
                <Button asChild size="sm" variant="outline">
                  <Link href={`${basePath}/enroll`}>Add students</Link>
                </Button>
              )}
            </div>
            <ul className="space-y-1.5">
              {batch.students?.map((s) => (
                <li key={s.id} className="text-sm flex items-center justify-between border-b border-border py-1.5 last:border-0">
                  <span>{s.full_name || s.username}</span>
                  <span className="text-xs text-muted-foreground capitalize">{s.status}</span>
                </li>
              ))}
              {(!batch.students || batch.students.length === 0) && (
                <li className="text-sm text-muted-foreground">No students yet.</li>
              )}
            </ul>
          </section>
        </TabsContent>
      </Tabs>

      {canManage && (
        <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}/quizzes/new`}>
              <ClipboardList className="h-4 w-4 mr-1" /> Create quiz
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Enrolment-request triage (admin + teacher of batch).
// ─────────────────────────────────────────────────────────────────────────────

function RequestsManager({ batchId }: { batchId: number }) {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'pending' | 'all'>('pending');
  const [noteFor, setNoteFor] = useState<number | null>(null);
  const [note, setNote] = useState('');

  const q = useQuery({
    queryKey: ['batch', batchId, 'enrolment-requests', filter],
    queryFn: () => api.batches.listEnrolmentRequests(batchId, filter) as Promise<EnrolmentRequest[]>,
  });

  const decideM = useMutation({
    mutationFn: ({ reqId, action, note: n }: { reqId: number; action: 'approve' | 'decline'; note?: string }) =>
      api.batches.decideEnrolmentRequest(batchId, reqId, action, n),
    onSuccess: () => {
      setNoteFor(null);
      setNote('');
      qc.invalidateQueries({ queryKey: ['batch', batchId] });
      qc.invalidateQueries({ queryKey: ['batch', batchId, 'enrolment-requests'] });
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <MailQuestion className="h-4 w-4" />
            Enrolment requests
          </h3>
          <p className="text-xs text-muted-foreground">
            Approve to add the student to the batch; decline to dismiss with an optional note.
          </p>
        </div>
        <div className="flex rounded-lg border border-border bg-card text-xs overflow-hidden shrink-0">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 h-8 ${filter === 'pending' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'}`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 h-8 border-l border-border ${filter === 'all' ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary/40'}`}
          >
            All
          </button>
        </div>
      </div>

      {q.isLoading && <p className="text-sm text-muted-foreground">Loading…</p>}
      {q.data && q.data.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-6">
          {filter === 'pending' ? 'No pending requests.' : 'No requests yet.'}
        </p>
      )}

      {q.data && q.data.length > 0 && (
        <ul className="divide-y divide-border rounded-xl border border-border bg-card">
          {q.data.map((r) => {
            const isPending  = r.status === 'pending';
            const isOpenNote = noteFor === r.id;
            return (
              <li key={r.id} className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex items-start gap-3">
                    <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                      {(r.student_full_name || r.student_username || '??').slice(0, 2).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium truncate">
                        {r.student_full_name || r.student_username}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{r.student_email}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Sent {format(new Date(r.requested_at), 'PP p')}
                        {!isPending && r.decided_at && ` · ${r.status} ${format(new Date(r.decided_at), 'PP p')}`}
                      </p>
                      {r.message && (
                        <blockquote className="mt-2 text-sm text-muted-foreground italic border-l-2 border-border pl-2">
                          &ldquo;{r.message}&rdquo;
                        </blockquote>
                      )}
                    </div>
                  </div>
                  {isPending ? (
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => decideM.mutate({ reqId: r.id, action: 'approve' })}
                        disabled={decideM.isPending}
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg bg-success text-success-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60"
                      >
                        <UserCheck className="h-3.5 w-3.5" />
                        Approve
                      </button>
                      <button
                        onClick={() => { setNoteFor(r.id); setNote(''); }}
                        disabled={decideM.isPending}
                        className="inline-flex items-center gap-1 h-9 px-3 rounded-lg border border-border text-xs font-semibold hover:bg-destructive/10 hover:text-destructive transition"
                      >
                        <UserX className="h-3.5 w-3.5" />
                        Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`shrink-0 inline-flex items-center px-2 h-6 rounded-full text-[10px] font-semibold uppercase tracking-widest ${
                      r.status === 'approved' ? 'bg-success/10 text-success' :
                      r.status === 'declined' ? 'bg-destructive/10 text-destructive' :
                      'bg-secondary/40 text-muted-foreground'
                    }`}>
                      {r.status}
                    </span>
                  )}
                </div>

                {isOpenNote && (
                  <div className="mt-3 space-y-2 rounded-lg border border-border bg-secondary/20 p-3">
                    <label className="text-xs font-medium text-muted-foreground block">
                      Decline note (optional — shown to student)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value.slice(0, 500))}
                      rows={2}
                      className="w-full text-base sm:text-sm bg-background border border-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/40"
                      placeholder="e.g. 'This batch is for class 8 only.'"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => decideM.mutate({ reqId: r.id, action: 'decline', note: note.trim() || undefined })}
                        disabled={decideM.isPending}
                        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg bg-destructive text-destructive-foreground text-xs font-semibold hover:opacity-90 disabled:opacity-60"
                      >
                        {decideM.isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <UserX className="h-3.5 w-3.5" />}
                        Confirm decline
                      </button>
                      <button
                        onClick={() => { setNoteFor(null); setNote(''); }}
                        className="h-9 px-3 rounded-lg border border-border text-xs hover:bg-secondary/40"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {r.note && r.status === 'declined' && !isOpenNote && (
                  <div className="mt-2 rounded-lg bg-destructive/5 text-destructive/90 px-3 py-2 text-xs">
                    <span className="font-semibold mr-1">Note sent:</span>
                    {r.note}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Attendance card — caller's % of past classes attended in this batch.
// ─────────────────────────────────────────────────────────────────────────────

function AttendanceCard({ batchId }: { batchId: number }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['batch', batchId, 'my-attendance'],
    queryFn: () => api.batches.myAttendance(batchId),
    staleTime: 60_000,
  });
  if (isLoading || error || !data || data.total_past === 0) return null;
  const pct = Math.round((data.attended / data.total_past) * 100);
  const hours = Math.floor(data.total_seconds / 3600);
  const minutes = Math.floor((data.total_seconds % 3600) / 60);
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">
            Your attendance
          </p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {data.attended} <span className="text-base font-normal text-muted-foreground">/ {data.total_past} classes</span>
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {hours > 0 && `${hours}h `}{minutes}m on camera total
          </p>
        </div>
        <div className="text-right shrink-0">
          <div
            className={`text-3xl font-black tabular-nums ${
              pct >= 80 ? 'text-success' : pct >= 50 ? 'text-warning' : 'text-destructive'
            }`}
          >
            {pct}%
          </div>
          <div className="text-[10px] uppercase tracking-widest text-muted-foreground">attended</div>
        </div>
      </div>
      <div className="mt-3 h-2 w-full rounded-full bg-secondary overflow-hidden">
        <div
          className={`h-full transition-all ${
            pct >= 80 ? 'bg-success' : pct >= 50 ? 'bg-warning' : 'bg-destructive'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Teachers management (super-admin only)
//
// Roster + add/remove + set-primary. Mutations refresh the parent batch query
// so the People tab + Overview teacher count stay in sync.
// ─────────────────────────────────────────────────────────────────────────────

function TeachersManager({
  batchId,
  teachers,
  onChange,
}: {
  batchId: number;
  teachers: BatchTeacher[];
  onChange: () => void;
}) {
  const qc = useQueryClient();
  const [pickerOpen, setPickerOpen] = useState(false);
  const [filter, setFilter] = useState('');

  // All teachers in the system, excluded by already-assigned id.
  const allTeachersQ = useQuery({
    queryKey: ['users', 'teacher'],
    queryFn: () => api.users.list('teacher') as Promise<AuthUser[]>,
    enabled: pickerOpen,
  });

  const assignedIds = useMemo(() => new Set(teachers.map((t) => t.id)), [teachers]);
  const candidates = (allTeachersQ.data ?? []).filter(
    (t) => !assignedIds.has(t.id) && (
      !filter ||
      (t.full_name?.toLowerCase().includes(filter.toLowerCase()) ?? false) ||
      t.username.toLowerCase().includes(filter.toLowerCase()) ||
      t.email.toLowerCase().includes(filter.toLowerCase())
    )
  );

  const refresh = () => {
    onChange();
    qc.invalidateQueries({ queryKey: ['batch', batchId] });
  };

  const addM = useMutation({
    mutationFn: (teacherId: number) =>
      api.batches.addTeacher(batchId, teacherId, teachers.length === 0 /* first one is primary */),
    onSuccess: () => { setFilter(''); setPickerOpen(false); refresh(); },
  });
  const removeM = useMutation({
    mutationFn: (teacherId: number) => api.batches.removeTeacher(batchId, teacherId),
    onSuccess: refresh,
  });
  const primaryM = useMutation({
    mutationFn: (teacherId: number) => api.batches.setPrimaryTeacher(batchId, teacherId),
    onSuccess: refresh,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Teachers ({teachers.length})
          </h3>
          <p className="text-xs text-muted-foreground">
            Super-admin can add or remove teachers and pick the primary.
          </p>
        </div>
        <Button size="sm" onClick={() => setPickerOpen((v) => !v)}>
          <Plus className="h-4 w-4 mr-1" />
          {pickerOpen ? 'Cancel' : 'Add teacher'}
        </Button>
      </div>

      {pickerOpen && (
        <div className="rounded-xl border border-border bg-card p-3 space-y-2">
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Search by name, username, or email…"
            className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm text-base sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            autoFocus
          />
          {allTeachersQ.isLoading ? (
            <p className="text-xs text-muted-foreground py-2">Loading teachers…</p>
          ) : candidates.length === 0 ? (
            <p className="text-xs text-muted-foreground py-2">
              {filter ? 'No teachers match.' : 'All teachers are already assigned to this batch.'}
            </p>
          ) : (
            <ul className="max-h-56 overflow-y-auto divide-y divide-border">
              {candidates.slice(0, 20).map((t) => (
                <li key={t.id} className="flex items-center justify-between py-2">
                  <div className="min-w-0">
                    <p className="text-sm truncate">{t.full_name || t.username}</p>
                    <p className="text-xs text-muted-foreground truncate">{t.email}</p>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => addM.mutate(t.id)}
                    disabled={addM.isPending}
                  >
                    {addM.isPending && addM.variables === t.id ? <Loader2 className="h-3 w-3 animate-spin" /> : 'Add'}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      <ul className="rounded-xl border border-border divide-y divide-border bg-card">
        {teachers.length === 0 ? (
          <li className="p-4 text-sm text-muted-foreground text-center">
            No teachers assigned yet. The first teacher you add becomes primary automatically.
          </li>
        ) : (
          teachers.map((t) => (
            <li key={t.id} className="flex items-center justify-between gap-2 p-3">
              <div className="min-w-0 flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-medium shrink-0">
                  {(t.full_name || t.username).slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate flex items-center gap-1.5">
                    {t.full_name || t.username}
                    {t.is_primary && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] uppercase tracking-wide text-primary font-semibold">
                        <Star className="h-3 w-3 fill-primary" /> primary
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">@{t.username}</p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {!t.is_primary && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => primaryM.mutate(t.id)}
                    disabled={primaryM.isPending}
                  >
                    Set as primary
                  </Button>
                )}
                <button
                  onClick={() => {
                    if (confirm(`Remove ${t.full_name || t.username} from this batch?`)) {
                      removeM.mutate(t.id);
                    }
                  }}
                  className="inline-flex items-center justify-center h-9 w-9 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition"
                  disabled={removeM.isPending}
                  aria-label="Remove teacher"
                  title="Remove teacher"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
