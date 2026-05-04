import { FileText, FileImage, Link as LinkIcon, FileType, StickyNote, Pin } from 'lucide-react';
import { format } from 'date-fns';
import type { Material } from '@/lib/api';

interface Props {
  material: Material;
  onOpen?: (m: Material) => void;
  rightSlot?: React.ReactNode;
}

const ICON: Record<Material['type'], React.ComponentType<{ className?: string }>> = {
  pdf: FileText,
  doc: FileType,
  image: FileImage,
  video_link: LinkIcon,
  text_note: StickyNote,
};

const TONE: Record<Material['type'], string> = {
  pdf: 'bg-primary/10 text-primary',
  doc: 'bg-info/10 text-info',
  image: 'bg-warning/10 text-warning',
  video_link: 'bg-success/10 text-success',
  text_note: 'bg-muted text-muted-foreground',
};

export function MaterialCard({ material, onOpen, rightSlot }: Props) {
  const Icon = ICON[material.type] ?? FileText;

  function handleClick() {
    if (onOpen) return onOpen(material);
    if (material.url) window.open(material.url, '_blank', 'noopener,noreferrer');
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 flex items-start gap-3 hover:shadow-sm transition-shadow">
      <button
        onClick={handleClick}
        className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${TONE[material.type]}`}
        aria-label={`Open ${material.title}`}
      >
        <Icon className="h-5 w-5" />
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          {material.is_pinned && <Pin className="h-3 w-3 text-primary" />}
          <button onClick={handleClick} className="font-medium truncate text-left hover:text-primary">
            {material.title}
          </button>
        </div>
        {material.description && (
          <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{material.description}</p>
        )}
        <p className="text-[10px] text-muted-foreground mt-1">
          {material.uploader_name || material.uploader_username || 'Unknown'} · {format(new Date(material.created_at), 'PP')}
        </p>
      </div>
      {rightSlot}
    </div>
  );
}
