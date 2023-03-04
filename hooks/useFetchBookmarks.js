import axios from 'axios';
import { useInfiniteQuery } from 'react-query';

const useFetchBookmarks = (inputs) => {
  const { email, configs, page } = inputs;
  return useInfiniteQuery(
    [
      'bookmarks',
      {
        email,
        page,
      },
    ],
    async () => {
      const dataa = await fetchBookmarks({ email, page });
      console.log('dlak;sdjf', dataa);
      return dataa;
    },
    ...(configs || [])
  );
};
  const fetchBookmarks = async (param) => {
    console.log(param);
    const res = await axios.get(
      `api/bookmarks?email=${session?.user?.email}&page=${
        param?.pageParam ?? 0
      }&limit=30`
    );
    return res;
  };
export { useFetchBookmarks };
