import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import WordpressHash from 'wordpress-hash-node';
import System from '../models/system';
import Media from '../models/media';
import Post from '../models/post';

const graphqlResolver = {
  systemCheck: async function ({}, { connection }) {
    return await System.systemCheck(connection);
  },
  systemCreate: async function ({ input }, { connection }) {
    return await System.createDatabase(
      connection,
      input.email,
      input.first_name,
      input.last_name,
      input.display_name,
      WordpressHash.HashPassword(input.password),
    );
  },
  login: async function ({ email, password }, { connection, secret }) {
    let user = await User.find({ param: 'user_email', value: email }, connection);

    if (!user) {
      const error = new Error('User not found.');
      error.code = 401;
      throw error;
    }
    const isEqual = WordpressHash.CheckPassword(password, user.user_pass);

    if (!isEqual) {
      const error = new Error('Password is incorrect.');
      error.code = 401;
      throw error;
    }
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      secret,
      { expiresIn: '1h' },
    );
    const refreshToken = jwt.sign({ user }, secret, { expiresIn: '1d' });
    return {
      token: token,
      refreshToken: refreshToken,
      userId: user.id,
      user: [
        {
          id: user.id,
          user_login: user.user_login,
          user_nicename: user.user_nicename,
          user_email: user.user_email,
          user_registered: user.user_registered,
          user_status: user.user_status,
          display_name: user.display_name,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      ],
    };
  },
  refresh: async function ({ refreshToken }, { connection, secret }) {
    const decoded = jwt.verify(refreshToken, secret);
    const token = jwt.sign({ userId: decoded.user.id, email: decoded.user.email }, secret, {
      expiresIn: '1h',
    });
    const newRefreshToken = jwt.sign({ user: decoded.user }, secret, { expiresIn: '1d' });
    const user = await User.findById(decoded.user.id, connection);
    return {
      token: token,
      refreshToken: newRefreshToken,
      userId: decoded.user.id,
      user: [
        {
          id: user.id,
          user_login: user.user_login,
          user_nicename: user.user_nicename,
          user_email: user.user_email,
          user_registered: user.user_registered,
          user_status: user.user_status,
          display_name: user.display_name,
          first_name: user.first_name,
          last_name: user.last_name,
        },
      ],
    };
  },
  getMediaFiles: async function ({ folder, offset = 0, type, search }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }

    const files = await Media.getFiles(folder, offset, type, search, connection);
    const count = await Media.getCount(type, search, connection);

    return { files: files, total: count };
  },
  getMediaFileById: async function ({ id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const file = await Media.getFileById(id, connection);
    return file;
  },
  deleteFiles: async function ({ ids }, { c, connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    let success = true;

    for (const id of ids) {
      const deleted = await Media.deleteFile(c, connection, id);
      if (!deleted) {
        success = false;
      }
    }

    return { success };
  },
  getMediaSettings: async function ({}, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const settings = await Media.getSettings(connection);
    return { settings: settings.option_value };
  },
  updateMediaSettings: async function ({ data }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    return Media.updateSettings(connection, data);
  },
  getPosts: async function ({ page, perPage, type, include_trash }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAll(connection, type, include_trash);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetch(args, type, connection, include_trash);
    return {
      posts: posts.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPosts.length,
    };
  },
  getPostsByStatus: async function ({ page, perPage, type, status }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllByStatus(connection, type, status);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchByStatus(args, type, status, connection);
    return {
      posts: posts.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPosts.length,
    };
  },
  getPostsByAuthor: async function ({ page, perPage, type, author_id }, { connection, isAuth }) {
    if (!page) {
      page = 1;
    }

    if (!perPage) {
      perPage = 10;
    }
    const totalPosts = await Post.fetchAllByAuthor(connection, type, author_id);
    const args = [
      { type: 'limit', value: perPage },
      { type: 'offset', value: (page - 1) * perPage },
    ];

    const posts = await Post.fetchByAuthor(args, type, author_id, connection);
    return {
      posts: posts.map((p) => {
        const item = {
          ...p,
          id: p.id,
          post_date: p.post_date.toISOString(),
          post_date_gmt: p.post_date_gmt.toISOString(),
          post_modified: p.post_modified.toISOString(),
          post_modified_gmt: p.post_modified_gmt.toISOString(),
        };
        return item;
      }),
      total: totalPosts.length,
    };
  },
  createDraftNewPost: async function (
    { title, content, featuredImageId },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createDraftPost(title, content, featuredImageId, userId, connection);
    return success;
  },
  createPublishNewPost: async function (
    { title, content, featuredImageId },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.createPublishPost(
      title,
      content,
      featuredImageId,
      userId,
      connection,
    );
    return success;
  },
  updatePost: async function (
    { title, content, featuredImageId, postId },
    { connection, isAuth, userId },
  ) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePost(
      title,
      content,
      featuredImageId,
      postId,
      userId,
      connection,
    );
    return success;
  },
  getCategories: async function ({ type }, { connection, isAuth }) {
    const categories = await Post.getCategories(type, connection);
    return { categories: categories };
  },
  getPostsAndPagesNavigation: async function ({}, { connection }) {
    const posts = await Post.getAllPostsAndPagesSlugAndChildCount(connection);
    const totalPosts = posts.length;
    return {
      posts,
      total: totalPosts,
    };
  },
  getPostBy: async function ({ field, value }, { connection }) {
    return await Post.getPostBy(field, value, connection);
  },
  updatePostStatus: async function ({ status, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostStatus(status, post_id, connection);
    return success;
  },
  updatePostPublishDate: async function ({ date, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPublishDate(date, post_id, connection);
    return success;
  },
  updatePostPassword: async function ({ password, post_id }, { connection, isAuth }) {
    if (!isAuth) {
      const error = new Error('Invalid Auth Token.');
      error.code = 401;
      throw error;
    }
    const success = await Post.updatePostPassword(password, post_id, connection);
    return success;
  },
};

export default graphqlResolver;
