export const CLOUDINARY_CLOUD_NAME = 'dnfzg7d5p';
export const CLOUDINARY_UPLOAD_PRESET = 'Instagram';

export const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`,
    {
      method: 'POST',
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error('Upload failed');
  }

  const data = await response.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
};

export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number;
  format?: string;
} = {}) => {
  const { width, height, quality = 'auto', format = 'auto' } = options;
  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    `q_${quality}`,
    `f_${format}`,
  ].filter(Boolean).join(',');

  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${transformations}/${publicId}`;
};
