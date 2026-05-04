'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { api, type Course } from '@/lib/api';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { CourseForm } from '@/components/dashboard/CourseForm';

export default function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  const courseId = parseInt(id, 10);

  // We don't have a "get by id" admin endpoint; load all and find one.
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'courses'],
    queryFn: () => api.courses.listAdmin() as Promise<Course[]>,
  });

  const course = data?.find((c) => c.id === courseId);

  return (
    <div>
      <PageHeader title="Edit course" description={course?.title} />
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : !course ? (
        <p className="text-sm text-destructive">Not found.</p>
      ) : (
        <CourseForm mode="edit" initial={course} onDone={() => router.push('/dashboard/admin/courses')} />
      )}
    </div>
  );
}
