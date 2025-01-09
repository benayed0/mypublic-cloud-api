import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const get_upload_url = async (id: string, name: string) => {
  const client = new S3Client({ region: 'us-east-1' });
  const Bucket = 'mypublicloud';
  const Key = `articles/${id}/${name}`;
  const command = new PutObjectCommand({
    Bucket,
    Key,
  });
  try {
    // Generate the pre-signed URL for a 5-minute expiration
    const PreSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 300,
    });
    return PreSignedUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};
const get_download_url = async (id: string, name: string) => {
  console.log(id, name);

  const client = new S3Client({ region: 'us-east-1' });
  const Bucket = 'mypublicloud';
  const Key = `articles/${id}/${name}`;
  const command = new GetObjectCommand({
    Bucket,
    Key,
  });
  try {
    // Generate the pre-signed URL for a 5-minute expiration
    const PreSignedUrl = await getSignedUrl(client, command, {
      expiresIn: 300,
    });
    return PreSignedUrl;
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    throw error;
  }
};

const formatExtension = (extension: string) => {
  const extensionMap: { [key: string]: string } = {
    'application/pdf': 'pdf',
    '.doc': 'doc',
    '.docx': 'docx',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'xlsx',
    'application/vnd.ms-excel': 'xlsx',
  };
  return extensionMap[extension] || extension;
};
export const aws_s3_utils = { get_upload_url, get_download_url };
