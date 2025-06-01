import User from './user';

export default class Post {
  constructor() {}
  static async fetchAll(connection, type, include_trash) {
    let baseQuery = `SELECT * FROM pw_posts WHERE post_type = $1`;
    let params = [type];

    if (!include_trash) {
      baseQuery += ` AND post_status != 'trash'`;
    }

    const rows = await connection.unsafe(baseQuery, params);
    return rows;
  }

  static async fetchAllByStatus(connection, type, status) {
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status=${status}`;
    return rows;
  }
  static async fetchAllByAuthor(connection, type, author_id) {
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_author=${author_id}`;
    return rows;
  }
  static async getAllPostsAndPagesSlugAndChildCount(connection) {
    const rows = await connection`SELECT
      p.id,
      p.post_name,
      p.post_type,
      COUNT(c.ID) AS child_count
      FROM pw_posts p
      LEFT JOIN pw_posts c
        ON c.post_parent = p.id AND c.post_status = 'publish'
      WHERE p.post_status = 'publish'
      GROUP BY p.ID, p.post_type
      ORDER BY p.ID DESC;`;
    return rows;
  }

  static async fetch(args, type, connection, include_trash) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg?.value ?? 10;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg?.value ?? 0;

    let query = connection`
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      WHERE p.post_type = ${type}
    `;

    if (!include_trash) {
      query = connection`${query} AND post_status != 'trash'`;
    }

    query = connection`${query} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset}`;

    const rows = await query;

    await Promise.all(
      rows.map(async (row) => {
        row.author = await User.findById(row.post_author, connection);
      }),
    );

    return [...rows];
  }

  static async fetchByStatus(args, type, status, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg.value;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg.value;
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_status=${status} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;
    await Promise.all(
      rows.map(async (row) => {
        // row.categories = await Article.fetchPostCategories(row.id, connection);
        row.author = await User.findById(row.post_author, connection);
      }),
    );
    return [...rows];
  }

  static async fetchByAuthor(args, type, author_id, connection) {
    const limitArg = args.find((arg) => arg.type === 'limit');
    const limit = limitArg.value;

    const offsetArg = args.find((arg) => arg.type === 'offset');
    const offset = offsetArg.value;
    const rows =
      await connection`SELECT * FROM pw_posts WHERE post_type=${type} AND post_author=${author_id} ORDER BY post_date DESC LIMIT ${limit} OFFSET ${offset} `;
    await Promise.all(
      rows.map(async (row) => {
        // row.categories = await Article.fetchPostCategories(row.id, connection);
        row.author = await User.findById(row.post_author, connection);
      }),
    );
    return [...rows];
  }

  static async getCategories(type, connection) {
    return connection`
        SELECT 
          t.term_id,
          t.name,
          t.slug,
          tt.description,
          COUNT(tr.object_id) AS post_count
        FROM pw_terms t
        JOIN pw_term_taxonomy tt ON tt.term_id = t.term_id
        LEFT JOIN pw_term_relationships tr ON tr.term_taxonomy_id = tt.term_taxonomy_id
        WHERE tt.taxonomy = ${type}
        GROUP BY t.term_id, t.name, t.slug, tt.description;
      `;
  }

  static async createDraftPost(title, content, featuredImageId, authorId, connection) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      const result = await connection`INSERT INTO pw_posts (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_modified,
        post_modified_gmt,
        post_type,
        guid
      ) VALUES (
        ${authorId}, 
        NOW(),
        NOW(),
        ${content},
        ${title},
        '',
        'draft',
        ${slug},
        NOW(),
        NOW(),
        'post',
        ${`/${slug}`}
      ) RETURNING ID;`;
      const postId = result[0].id;

      if (featuredImageId) {
        await connection`INSERT INTO pw_postmeta (
          post_id,
          meta_key,
          meta_value
        ) VALUES (
          ${postId},
          '_thumbnail_id',
          ${featuredImageId}
        );`;
      }

      return { success: true, post_id: postId };
    } catch (err) {
      console.error('createDraftPost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async createPublishPost(title, content, featuredImageId, authorId, connection) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();
      const result = await connection`INSERT INTO pw_posts (
        post_author,
        post_date,
        post_date_gmt,
        post_content,
        post_title,
        post_excerpt,
        post_status,
        post_name,
        post_modified,
        post_modified_gmt,
        post_type,
        guid
      ) VALUES (
        ${authorId}, 
        NOW(),
        NOW(),
        ${content},
        ${title},
        '',
        'publish',
        ${slug},
        NOW(),
        NOW(),
        'post',
        ${`/${slug}`}
      ) RETURNING ID;`;
      const postId = result[0].id;
      if (featuredImageId) {
        await connection`INSERT INTO pw_postmeta (
          post_id,
          meta_key,
          meta_value
        ) VALUES (
          ${postId},
          '_thumbnail_id',
          ${featuredImageId}
        );`;
      }
      return { success: true, post_id: postId };
    } catch (err) {
      console.error('createPublishPost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async updatePost(title, content, featuredImageId, postId, authorId, connection) {
    try {
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, '')
        .replace(/\s+/g, '-')
        .trim();

      // Update the main post
      await connection`
        UPDATE pw_posts
        SET
          post_title = ${title},
          post_content = ${content},
          post_modified = NOW(),
          post_modified_gmt = NOW(),
          post_name = ${slug},
          guid = ${`/${slug}`},
          post_author = ${authorId}
        WHERE ID = ${postId};
      `;

      // If featured image ID is provided, update or insert the postmeta
      if (featuredImageId) {
        const existing = await connection`
          SELECT * FROM pw_postmeta
          WHERE post_id = ${postId} AND meta_key = '_thumbnail_id'
          LIMIT 1;
        `;

        if (existing.length > 0) {
          // Update existing featured image meta
          await connection`
            UPDATE pw_postmeta
            SET meta_value = ${featuredImageId}
            WHERE post_id = ${postId} AND meta_key = '_thumbnail_id';
          `;
        } else {
          // Insert new featured image meta
          await connection`
            INSERT INTO pw_postmeta (post_id, meta_key, meta_value)
            VALUES (${postId}, '_thumbnail_id', ${featuredImageId});
          `;
        }
      }

      return { success: true, post_id: postId };
    } catch (err) {
      console.error('updatePost failed:', err);
      return { success: false, error: err.message };
    }
  }

  static async getPostBy(field, value, connection) {
    console.log('foo');
    const allowedFields = ['id', 'post_name', 'post_title', 'post_author'];
    if (!allowedFields.includes(field)) {
      throw new Error('Invalid field parameter');
    }
    const query = `
      SELECT 
        p.*, 
        pm.meta_value AS featured_image_id,
        am.meta_value AS featured_image_metadata
      FROM pw_posts p
      LEFT JOIN pw_postmeta pm 
        ON p.id = pm.post_id AND pm.meta_key = '_thumbnail_id'
      LEFT JOIN pw_postmeta am 
        ON CAST(pm.meta_value AS INTEGER) = am.post_id AND am.meta_key = '_pw_attachment_metadata'
      WHERE p.${field} = $1
    `;
    const post = await connection.unsafe(query, [value]);
    if (post.length > 0) {
      await Promise.all(
        post.map(async (row) => {
          // row.categories = await Article.fetchPostCategories(row.id, connection);
          row.author = await User.findById(row.post_author, connection);
          row.post_date = row.post_date.toISOString();
          row.post_date_gmt = row.post_date_gmt.toISOString();
          row.post_modified = row.post_modified.toISOString();
          row.post_modified_gmt = row.post_modified_gmt.toISOString();
        }),
      );
      return post[0];
    }
    return null;
  }

  static async updatePostStatus(status, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_status = ${status} WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async updatePostPublishDate(date, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_date = ${date} WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  static async updatePostPassword(password, post_id, connection) {
    try {
      const update =
        await connection`UPDATE pw_posts SET post_password = ${password}, post_status = 'publish' WHERE id = ${post_id}`;
      if (update.count === 1) {
        return { success: true, post_id: post_id };
      } else {
        return { success: false, error: 'No rows updated or multiple rows affected' };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
