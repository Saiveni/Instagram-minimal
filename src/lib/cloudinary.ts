export const CLOUDINARY_CLOUD_NAME = 'dnfzg7d5p';
export const CLOUDINARY_UPLOAD_PRESET = 'Instagram';

export const uploadToCloudinary = async (file: File): Promise<{ url: string; publicId: string }> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/${file.type.startsWith('video') ? 'video' : 'image'}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const getOptimizedImageUrl = (publicId: string, options: {
  width?: number;
  height?: number;
  quality?: number | string;
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

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  // This requires a server-side implementation with your Cloudinary API secret
  // For now, we'll just log it
  console.log('Delete from Cloudinary:', publicId);
  // TODO: Implement server-side deletion
};
