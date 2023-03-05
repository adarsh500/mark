import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const fetchBookmarks = async (param) => {
  const { email = '', collection, query } = param?.queryKey?.[1];

  const res = await axios.get(
    `api/bookmarks?email=${email}&page=${param?.pageParam ?? 0}&limit=${28}${
      collection ? `&collection=${collection}` : ''
    }${query ? `&query=${query}` : ''}`
  );
  return res;
};

const useFetchBookmarks = (inputs) => {
  const { email, configs, page, collection, query } = inputs;
  return useInfiniteQuery(
    [
      'bookmarks',
      {
        email,
        page,
        collection,
        query,
      },
    ],
    fetchBookmarks,
    ...(configs || [])
  );
};

export { useFetchBookmarks };
