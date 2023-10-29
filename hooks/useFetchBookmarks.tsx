import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';

const fetchBookmarks = async (param) => {
  const {
    user_id = '',
    collection_id,
    query,
    favourite,
  } = param?.queryKey?.[1];

  const res = await axios.get(
    `/api/bookmark/${user_id}?page=${param?.pageParam ?? 0}&limit=${8}${
      collection_id ? `&collection_id=${collection_id}` : ''
    }${query ? `&query=${query}` : ''}${!!favourite ? `&favourite=true` : ''}`
  );
  return res;
};

const useFetchBookmarks = (inputs) => {
  const { user_id, configs, page, collection_id, query, favourite } = inputs;

  return useInfiniteQuery(
    [
      'bookmarks',
      {
        user_id,
        page,
        collection_id,
        query,
        favourite,
      },
    ],
    fetchBookmarks,
    ...(configs || [])
  );
};

export { useFetchBookmarks };
