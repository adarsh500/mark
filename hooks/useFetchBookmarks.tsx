import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchBookmarks = async (param) => {
  const { user_id = '', collection_id, query } = param?.queryKey?.[1];

  const res = await axios.get(
    `api/bookmark/${user_id}?page=${param?.pageParam ?? 0}&limit=${28}${
      collection_id ? `&collection_id=${collection_id}` : ''
    }${query ? `&query=${query}` : ''}`
  );
  return res;
};

const useFetchBookmarks = (inputs) => {
  const { user_id, configs, page, collection_id, query } = inputs;
  return useInfiniteQuery(
    [
      'bookmarks',
      {
        user_id,
        page,
        collection_id,
        query,
      },
    ],
    fetchBookmarks,
    ...(configs || [])
  );
};

export { useFetchBookmarks };
