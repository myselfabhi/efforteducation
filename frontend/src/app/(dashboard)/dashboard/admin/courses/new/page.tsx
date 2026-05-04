'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { CourseForm } from '@/components/dashboard/CourseForm';

export default function NewCoursePage() {
  const router = useRouter();
  return (
    <div>
      <PageHeader title="New course" />
      <CourseForm mode="create" onDone={() => router.push('/dashboard/admin/courses')} />
    </div>
  );
}
