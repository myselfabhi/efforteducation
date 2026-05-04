'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { Video, FileText, ClipboardList, Megaphone, Users, Plus } from 'lucide-react';
import { api, type Batch, type LiveClass, type Material, type Announcement } from '@/lib/api';
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
