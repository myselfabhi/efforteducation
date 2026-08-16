import { AwsClient } from 'aws4fetch';
import { customAlphabet } from 'nanoid';
import type { Env } from '../types';

const keyId = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 16);

export interface SignedUploadResult {
  uploadUrl: string;
  publicUrl: string;
  objectKey: string;
  expiresInSec: number;
}

/**
 * Mint a presigned PUT URL for direct browser upload to R2 (S3 API).
 *
 * Ported from the AWS-SDK version to aws4fetch, which is Workers-native. The
 * URL is query-signed (SigV4) so the browser can PUT with any Content-Type;
 * the `contentType` arg is retained for the caller's contract but is not a
 * signed header. Same return shape as the Express service.
 */
export async function createSignedUpload(
  env: Env,
  opts: { filename: string; contentType: string; prefix?: string },
): Promise<SignedUploadResult> {
  const bucket = env.R2_BUCKET;
  const publicBase = env.R2_PUBLIC_URL;
  if (!bucket || !publicBase) throw new Error('R2_BUCKET / R2_PUBLIC_URL not configured');

  const safeName = opts.filename.replace(/[^a-zA-Z0-9._-]/g, '_').slice(-80);
  const objectKey = `${opts.prefix ?? 'materials'}/${keyId()}-${safeName}`;
  const expiresInSec = 60 * 5;

  const client = new AwsClient({
    accessKeyId: env.R2_ACCESS_KEY_ID,
    secretAccessKey: env.R2_SECRET_ACCESS_KEY,
    service: 's3',
    region: 'auto',
  });

  const endpoint = `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com/${bucket}/${objectKey}`;
  const signed = await client.sign(
    new Request(`${endpoint}?X-Amz-Expires=${expiresInSec}`, { method: 'PUT' }),
    { aws: { signQuery: true } },
  );

  const publicUrl = `${publicBase.replace(/\/$/, '')}/${objectKey}`;
  return { uploadUrl: signed.url, publicUrl, objectKey, expiresInSec };
}
