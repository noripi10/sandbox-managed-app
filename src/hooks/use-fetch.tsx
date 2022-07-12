import axios from 'axios';

const data = new Map<string, DataType>();
const baseUrl = 'https://jsonplaceholder.typicode.com/posts/';

const fetcher = async (key: string) => {
  const response = await axios.get<DataType>(baseUrl + key);
  const d = response.data;
  return d;
};

const useFetch = (key: string) => {
  if (!key || Number(key) > 100) {
    return { data: null };
  }
  const cacheData = data.get(key);
  if (!data.has(key) || !cacheData) {
    throw fetcher(key).then((d) => {
      data.set(key, d);
    });
  }

  const refetch = () => {
    fetcher(key).then((d) => {
      console.info('refetch', d);
      data.set(key, d);
    });
  };

  return { data: cacheData, refetch };
};

type DataType = typeof exampleData;
const exampleData = {
  userId: 1,
  id: 1,
  title: 'sunt aut facere repellat provident occaecati excepturi optio reprehenderit',
  body: 'quia et suscipit\nsuscipit recusandae consequuntur expedita et cum\nreprehenderit molestiae ut ut quas totam\nnostrum rerum est autem sunt rem eveniet architecto',
};

export { useFetch };
