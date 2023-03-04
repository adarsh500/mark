import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const fetchBookmarks = async (param) => {
  const { email = '', collection } = param?.queryKey?.[1];
  console.log('ssr', email, collection);

  const res = await axios.get(
    `api/bookmarks?email=${email}&page=${param?.pageParam ?? 0}&limit=${28}${
      collection ? `&collection=${collection}` : ''
    }`
  );
  return res;
};

const useFetchBookmarks = (inputs) => {
  const { email, configs, page, collection } = inputs;
  return useInfiniteQuery(
    [
      'bookmarks',
      {
        email,
        page,
        collection,
      },
    ],
    fetchBookmarks,
    ...(configs || [])
  );
};

export { useFetchBookmarks };
