import { graphqlUrl } from '../config';
export const APICheckSystem = async () => {
  const query = `query {systemCheck { success error } }`;
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

export const APICreateSystem = async (email, firstName, lastName, displayName, password) => {
  const query = `mutation {
    systemCreate(input: { 
      email: \"${email}\", 
      first_name: \"${firstName}\", 
      last_name: \"${lastName}\", 
      display_name: \"${displayName}\"
      password: \"${password}\"
    }) { success error } }`;
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
