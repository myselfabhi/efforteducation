'use client';

import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Pencil } from 'lucide-react';
import { api, ApiError, type Course } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';
import { EmptyState } from '@/components/dashboard/EmptyState';
import { BookOpen } from 'lucide-react';

export default function AdminCoursesPage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => api.courses.listAdmin() as Promise<Course[]>,
  });
  const remove = useMutation({
    mutationFn: (id: number) => api.courses.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'courses'] });
      toast.success('Course removed');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to remove'),
  });

  return (
    <div>
      <PageHeader
        title="Courses"
        description="Manage the public course catalog."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/courses/new">
              <Plus className="h-4 w-4 mr-1" /> New course
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-6 w-6" />}
          title="No courses yet"
          description="Create your first course to start enrolling batches."
          action={
            <Button asChild>
              <Link href="/dashboard/admin/courses/new">
                <Plus className="h-4 w-4 mr-1" /> New course
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Price (INR)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((c) => (
                <TableRow key={c.id}>
                  <TableCell>
                    <div className="font-medium">{c.title}</div>
                    <div className="text-xs text-muted-foreground">/{c.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm capitalize">{c.category}</TableCell>
                  <TableCell className="text-sm">{c.duration_months ? `${c.duration_months} mo` : '—'}</TableCell>
                  <TableCell className="text-sm">{c.price_inr ? `₹${c.price_inr.toLocaleString('en-IN')}` : '—'}</TableCell>
                  <TableCell>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full ${
                        c.is_published ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {c.is_published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/admin/courses/${c.id}`}>
                        <Pencil className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Delete "${c.title}"?`)) remove.mutate(c.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
