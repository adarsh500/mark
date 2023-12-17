import Layout from '@/components/core/Layout';
import React from 'react';

const layout = (props) => {
  const { children } = props;
  return <Layout>{children}</Layout>;
};

export default layout;
