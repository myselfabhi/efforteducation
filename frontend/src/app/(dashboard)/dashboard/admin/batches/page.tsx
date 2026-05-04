'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { PageHeader } from '@/components/dashboard/PageHeader';
import { BatchesList } from '@/components/dashboard/BatchesList';
import { Button } from '@/app/components/ui/button';

export default function AdminBatchesPage() {
  return (
    <div>
      <PageHeader
        title="All batches"
        description="Every batch on the platform."
        actions={
          <Button asChild>
            <Link href="/dashboard/admin/batches/new">
              <Plus className="h-4 w-4 mr-1" /> New batch
            </Link>
          </Button>
        }
      />
      <BatchesList
        hrefBase="/dashboard/admin/batches"
        emptyTitle="No batches yet"
        emptyDescription="Create your first batch to get going."
      />
    </div>
  );
}
