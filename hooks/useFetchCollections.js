import axios from 'axios';
import { useQuery } from 'react-query';

const useFetchCollections = (inputs) => {
  const { email, configs } = inputs;
  return useQuery(
    [
      'fetch-collections',
      {
        email,
      },
    ],
    async () => {
      const res = await axios.get(`api/collections/${email}`);
      return res;
    },
    ...(configs || [])
  );
};

export { useFetchCollections };
