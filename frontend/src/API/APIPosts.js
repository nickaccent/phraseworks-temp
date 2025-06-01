import { graphqlUrl } from '../config';
export const APIGetNavigationPostsAndPages = async () => {
  const query = `query {getPostsAndPagesNavigation { posts { id post_name post_type child_count }  total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIAllGetPosts = async (loginPassword, page, perPage, type) => {
  const query = `query {getPosts(page: ${page}, perPage: ${perPage}, type: \"${type}\", include_trash: 1) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetPosts = async (loginPassword, page, perPage, type) => {
  const query = `query {getPosts(page: ${page}, perPage: ${perPage}, type: \"${type}\", include_trash: 0) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetPostsByStatus = async (loginPassword, page, perPage, type, filter) => {
  const query = `query {getPostsByStatus(page: ${page}, perPage: ${perPage}, type: \"${type}\", status: \"${filter}\") { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetPostsByAuthor = async (loginPassword, page, perPage, type, authorId) => {
  const query = `query {getPostsByAuthor(page: ${page}, perPage: ${perPage}, type: \"${type}\", author_id: ${authorId}) { posts { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } } total } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetCategories = async (loginPassword, category) => {
  const query = `query {getCategories(type: \"${category}\") { categories { term_id name slug description post_count } } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APISaveDraftNewPost = async (loginPassword, title, content, featuredImageId) => {
  const query = `mutation {createDraftNewPost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APISavePublishNewPost = async (loginPassword, title, content, featuredImageId) => {
  const query = `mutation {createPublishNewPost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIGetPostBy = async (field, value) => {
  const query = `query {getPostBy(field: \"${field}\", value: \"${value}\") { id post_date post_date_gmt post_content post_title post_excerpt post_status post_password post_name post_modified post_modified_gmt post_parent guid menu_order post_type post_mime_type comment_count post_author author { id user_login user_nicename user_email user_url user_registered user_activation_key user_status display_name first_name last_name } featured_image_id featured_image_metadata } }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdatePostStatus = async (loginPassword, status, postId) => {
  const query = `mutation {updatePostStatus(status: \"${status}\" post_id: ${postId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdatePostPublishDate = async (loginPassword, date, postId) => {
  const query = `mutation {updatePostPublishDate(date: \"${date}\" post_id: ${postId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdatePostPassword = async (loginPassword, password, postId) => {
  const query = `mutation {updatePostPassword(password: \"${password}\" post_id: ${postId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};

export const APIUpdatePost = async (loginPassword, title, content, featuredImageId, postId) => {
  const query = `mutation {updatePost(title: \"${title}\" content: """${content}""", featuredImageId: ${featuredImageId}, postId: ${postId}) { success error post_id} }`;
  const url = `${graphqlUrl}graphql`;
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${loginPassword}`,
    },
    body: JSON.stringify({ query: query }),
  });

  const data = await response.json();
  return {
    status: response.status,
    data: data.data,
  };
};
