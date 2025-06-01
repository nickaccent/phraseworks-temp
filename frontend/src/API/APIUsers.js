import { graphqlUrl } from '../../config';
export const APICreateFirstUser = async () => {
  const query = `query {createFirstUser { success error } }`;
  const url = `${graphqlUrl}api/v1/test`;
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
    data: data,
  };
};
