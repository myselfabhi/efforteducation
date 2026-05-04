'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus, Trash2, Search } from 'lucide-react';
import { api, ApiError, type AuthUser } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table';

const ROLE_TONE: Record<string, string> = {
  super_admin: 'bg-primary/10 text-primary',
  teacher: 'bg-info/10 text-info',
  student: 'bg-muted text-muted-foreground',
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'super_admin' | 'teacher' | 'student'>('all');
  const [q, setQ] = useState('');

  const { data, isLoading, error } = useQuery({
    queryKey: ['users', filter],
    queryFn: () =>
      api.users.list(filter === 'all' ? undefined : (filter as 'teacher' | 'student' | 'super_admin')) as Promise<AuthUser[]>,
  });

  const remove = useMutation({
    mutationFn: (id: number) => api.users.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('User removed');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to remove'),
  });

  const setRole = useMutation({
    mutationFn: ({ id, role }: { id: number; role: 'super_admin' | 'teacher' | 'student' }) =>
      api.users.setRole(id, role),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['users'] });
      toast.success('Role updated');
    },
    onError: (err) => toast.error(err instanceof ApiError ? err.message : 'Failed to update role'),
  });

  const filtered = (data ?? []).filter((u) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      (u.full_name || '').toLowerCase().includes(needle) ||
      u.username.toLowerCase().includes(needle) ||
      u.email.toLowerCase().includes(needle)
    );
  });

  return (
    <div>
      <PageHeader
        title="Users"
        description="Invite teachers and manage every account on the platform."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/users/new">
              <Plus className="h-4 w-4 mr-1" /> Invite user
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search users…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <Select value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All roles</SelectItem>
            <SelectItem value="super_admin">Super admins</SelectItem>
            <SelectItem value="teacher">Teachers</SelectItem>
            <SelectItem value="student">Students</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-sm text-destructive">Failed to load users.</p>}
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <div className="rounded-2xl border border-border overflow-hidden bg-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>
                    <div className="font-medium">{u.full_name || u.username}</div>
                    <div className="text-xs text-muted-foreground">@{u.username}</div>
                  </TableCell>
                  <TableCell className="text-sm">{u.email}</TableCell>
                  <TableCell>
                    <Select
                      value={u.role}
                      onValueChange={(v) => setRole.mutate({ id: u.id, role: v as 'super_admin' | 'teacher' | 'student' })}
                    >
                      <SelectTrigger className={`w-36 h-8 text-xs ${ROLE_TONE[u.role] ?? ''}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="super_admin">Super admin</SelectItem>
                        <SelectItem value="teacher">Teacher</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
                      onClick={() => {
                        if (confirm(`Remove ${u.full_name || u.username}?`)) remove.mutate(u.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-sm text-muted-foreground py-8">
                    No users match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
