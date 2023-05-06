const extractSourceName = (source: string): string => {
  const sourceArr = source.slice(8).split('.');
  const sourceName = sourceArr[0] + '.' + sourceArr[1];
  return sourceName;
};

export { extractSourceName };
