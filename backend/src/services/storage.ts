import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { customAlphabet } from 'nanoid';

const keyId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16);

let _client: S3Client | null = null;

function client(): S3Client {
  if (_client) return _client;
  const accountId = process.env.R2_ACCOUNT_ID;
  if (!accountId) throw new Error('R2_ACCOUNT_ID not configured');
  _client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });
  return _client;
}

export interface SignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresInSec: number;
}

/** Mint a presigned PUT URL for direct browser upload to R2. */
export async function createSignedUpload(opts: {
  filename: string;
  contentType: string;
  prefix?: string;
}): Promise<SignedUploadResult> {
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_URL;
  if (!bucket || !publicBase) throw new Error('R2_BUCKET / R2_PUBLIC_URL not configured');

  const safeName = opts.filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const objectKey = `${opts.prefix ?? 'materials'}/${keyId()}-${safeName}`;
  const expiresInSec = 60 * 5;

  const cmd = new PutObjectCommand({
    Bucket: bucket,
    Key: objectKey,
    ContentType: opts.contentType,
  });
  const uploadUrl = await getSignedUrl(client(), cmd, { expiresIn: expiresInSec });
  const publicUrl = `${publicBase.replace(/\/$/, '')}/${objectKey}`;

  return { uploadUrl, publicUrl, objectKey, expiresInSec };
}
