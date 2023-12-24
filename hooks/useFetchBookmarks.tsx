import axios from 'axios';
import { useInfiniteQuery } from '@tanstack/react-query';

const useFetchBookmarks = (inputs) => {
  const {
    user_id,
    configs,
    page,
    collection_id,
    query,
    favourite,
    sort_by,
    order,
  } = inputs;

  return useInfiniteQuery(
    [
      'bookmarks',
      {
        user_id,
        page,
        collection_id,
        query,
        favourite,
        sort_by,
        order,
      },
    ],
    fetchBookmarks,
    ...(configs || [])
  );
};

const fetchBookmarks = async (param) => {
  const {
    user_id = '',
    collection_id,
    query,
    favourite,
    sort_by,
    order,
  } = param?.queryKey?.[1];

  const res = await axios.get(
    `/api/bookmark/${user_id}?page=${param?.pageParam ?? 0}&limit=${8}${
      collection_id ? `&collection_id=${collection_id}` : ''
    }${query ? `&query=${query}` : ''}${
      !!favourite ? `&favourite=true` : ''
    }&sort_by=${sort_by}&order=${order}`
  );
  return res;
};

export { useFetchBookmarks };
