import { APIGetPostBy } from '../API/APIPosts';
import parse from 'html-react-parser';

export const get_post = async () => {
  const path = window.location.pathname; // e.g., "/blog/post/123"
  const segments = path.split('/').filter(Boolean);

  const lastPart = segments.pop() || segments.pop();
  const data = await get_post_by('post_name', lastPart);
  if (data != null) {
    return data;
  }
  return null;
};

export const get_post_by = async (field, value) => {
  const data = await APIGetPostBy(field, value);
  if (data.status == 200) {
    return data.data.getPostBy;
  }
  return null;
};

export const get_content = (post) => {
  if (post) {
    return parse(post.post_content);
  }
  return '';
};

export const get_post_thumbnail = (post, size) => {
  if (post) {
    const meta = JSON.parse(post.featured_image_metadata);
    const entry = meta.sizes.filter((sizeEntry) => sizeEntry.slug == size);

    const origin = window.location.origin;
    if (entry.length > 0) {
      return `${origin.replace('5173', '8787')}/r2/${entry[0].file}`;
    }
    return `${origin.replace('5173', '8787')}/r2/${meta.file}`;
  }
  return '';
};
