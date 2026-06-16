import React from "react";

import { useParams } from 'react-router';

import Layout from './../../components/Layout';

export default function TagPage() {
  const { name } = useParams();
  return (
    <Layout>
      <div>
        <h1>Tag: {name}</h1>
      </div>
    </Layout>
  );
}