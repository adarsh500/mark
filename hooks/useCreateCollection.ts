import axios from 'axios';
import { useMutation } from 'react-query';

type CreateCollectionInputs = {
  email: string;
  collection: string;
  parent?: string;
};

const createCollection = async (inputs: CreateCollectionInputs) => {
  const { email, collection, parent = '' } = inputs;
  const response = await axios.post('api/collections', {
    email,
    collection,
    parent,
  });
  return response;
};

const useCreateCollection = (inputs) => {
  const { configs = [] } = inputs;
  return useMutation(
    (input: CreateCollectionInputs) =>
      createCollection({
        ...input,
      }),
    ...configs
  );
};

export { useCreateCollection };
