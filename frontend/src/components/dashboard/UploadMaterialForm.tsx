'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Upload } from 'lucide-react';
import { api, ApiError, type Material } from '@/lib/api';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';
import { Checkbox } from '@/app/components/ui/checkbox';

interface Props {
  batchId: number;
  backHref: string;
}

type MaterialType = Material['type'];

const ACCEPT: Record<MaterialType, string> = {
  pdf: 'application/pdf',
  doc: '.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  image: 'image/*',
  video_link: '',
  text_note: '',
};

export function UploadMaterialForm({ batchId, backHref }: Props) {
  const router = useRouter();
  const qc = useQueryClient();

  const [type, setType] = useState<MaterialType>('pdf');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pinned, setPinned] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [textBody, setTextBody] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);

  const submit = useMutation({
    mutationFn: async () => {
      if (type === 'text_note') {
        if (!textBody) throw new Error('Note body is required');
        return api.materials.create(batchId, { title, description: description || undefined, type, text_body: textBody, is_pinned: pinned });
      }
      if (type === 'video_link') {
        if (!linkUrl) throw new Error('Link URL is required');
        return api.materials.create(batchId, { title, description: description || undefined, type, url: linkUrl, is_pinned: pinned });
      }
      if (!file) throw new Error('Pick a file');

      // 1) Get signed PUT URL
      const signed = await api.materials.signedUpload({
        filename: file.name,
        content_type: file.type || 'application/octet-stream',
        size_bytes: file.size,
      });

      // 2) Direct upload via XHR (so we can track progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', signed.uploadUrl);
        xhr.setRequestHeader('Content-Type', file.type || 'application/octet-stream');
        xhr.upload.onprogress = (ev) => {
          if (ev.lengthComputable) setUploadProgress(Math.round((ev.loaded / ev.total) * 100));
        };
        xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)));
        xhr.onerror = () => reject(new Error('Upload failed'));
        xhr.send(file);
      });

      // 3) Save metadata
      return api.materials.create(batchId, {
        title,
        description: description || undefined,
        type,
        url: signed.publicUrl,
        size_bytes: file.size,
        is_pinned: pinned,
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['batch', batchId, 'materials'] });
      toast.success('Material added');
      router.push(backHref);
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to upload';
      toast.error(message);
      setUploadProgress(null);
    },
  });

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    submit.mutate();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 max-w-xl">
      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as MaterialType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pdf">PDF</SelectItem>
            <SelectItem value="doc">Document (Word)</SelectItem>
            <SelectItem value="image">Image</SelectItem>
            <SelectItem value="video_link">Video / external link</SelectItem>
            <SelectItem value="text_note">Text note</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (optional)</Label>
        <Textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      {type === 'text_note' && (
        <div className="space-y-2">
          <Label htmlFor="text_body">Note</Label>
          <Textarea id="text_body" rows={8} value={textBody} onChange={(e) => setTextBody(e.target.value)} />
        </div>
      )}

      {type === 'video_link' && (
        <div className="space-y-2">
          <Label htmlFor="url">URL (YouTube / Drive / link)</Label>
          <Input id="url" type="url" required value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://…" />
        </div>
      )}

      {(type === 'pdf' || type === 'doc' || type === 'image') && (
        <div className="space-y-2">
          <Label htmlFor="file">File</Label>
          <Input id="file" type="file" accept={ACCEPT[type]} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file && (
            <p className="text-xs text-muted-foreground">{file.name} · {(file.size / 1024 / 1024).toFixed(1)} MB</p>
          )}
          {uploadProgress !== null && (
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}
        </div>
      )}

      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <Checkbox checked={pinned} onCheckedChange={(v) => setPinned(!!v)} />
        Pin to top
      </label>

      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={submit.isPending}>
          {submit.isPending ? (uploadProgress !== null ? `Uploading ${uploadProgress}%` : 'Saving…') : (
            <>
              <Upload className="h-4 w-4 mr-2" /> Save material
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
