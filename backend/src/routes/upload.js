// ============================================================================
// Upload Routes - CloudPOS
// Handle file uploads to Cloudflare R2 storage
// ============================================================================
import { Hono } from 'hono';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';

const upload = new Hono();

// Apply authentication only to upload/delete routes (not serve)

// ── Upload Image ────────────────────────────────────────────────────────────
// POST /api/upload/image
upload.post('/image', authMiddleware, adminMiddleware, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('image');

    if (!file || !(file instanceof File)) {
      return c.json({ error: 'No image file provided' }, 400);
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return c.json({
        error: 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'
      }, 400);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return c.json({
        error: 'File too large. Maximum size is 5MB'
      }, 400);
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `products/${timestamp}-${randomStr}.${extension}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    await c.env.STORAGE.put(filename, arrayBuffer, {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Generate public URL
    // Note: You need to configure public access for your R2 bucket
    // or use a custom domain. For now, we'll return a relative path
    // that can be served through a worker or public bucket URL
    const imageUrl = `/api/images/${filename}`;

    return c.json({
      success: true,
      image_url: imageUrl,
      filename: filename,
    });
  } catch (error) {
    console.error('Upload error:', error);
    return c.json({ error: 'Failed to upload image' }, 500);
  }
});

// ── Delete Image ────────────────────────────────────────────────────────────
// DELETE /api/upload/image
upload.delete('/image', authMiddleware, adminMiddleware, async (c) => {
  try {
    const { filename } = await c.req.json();

    if (!filename) {
      return c.json({ error: 'Filename required' }, 400);
    }

    await c.env.STORAGE.delete(filename);

    return c.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    console.error('Delete error:', error);
    return c.json({ error: 'Failed to delete image' }, 500);
  }
});

export default upload;
