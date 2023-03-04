import axios from 'axios';
import { useMutation } from 'react-query';

const createCollection = async (inputs) => {
  const { email, collection, children = [], parentId = '' } = inputs;
  const response = await axios.post('api/collections', {
    email,
    collection,
    children,
    parentId,
  });
  return response;
};

const useCreateCollection = (inputs) => {
  const { configs = [] } = inputs;
  return useMutation(
    (input) =>
      createCollection({
        ...input,
      }),
    ...configs
  );
};

export { useCreateCollection };
