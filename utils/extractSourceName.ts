const extractSourceName = (source: string): string => {
  const sourceName = source.slice(8).split('/').pop();
  return sourceName;
};

export { extractSourceName };
