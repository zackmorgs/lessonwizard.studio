import React, { useEffect, useState } from "react";

import { Link } from 'react-router';

import Layout from './../../components/Layout';
import { getTags, getTagCounts, createTag } from './../../services/tagService';
import Tags from "../../components/Tags";

export default function TagsIndex() {
  const [tags, setTags] = useState([]);
  const [counts, setCounts] = useState({});
  const [newTagName, setNewTagName] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    getTags().then(setTags).catch(() => {});
    getTagCounts().then(setCounts).catch(() => {});
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    try {
      const created = await createTag(newTagName.trim());
      setTags((prev) => [...prev, created]);
      setNewTagName("");
    } catch (err) {
      setError(err.message);
    }
  };

  const sorted = [...tags].sort((a, b) => {
    const diff = (counts[b.name] ?? 0) - (counts[a.name] ?? 0);
    return diff !== 0 ? diff : a.name.localeCompare(b.name);
  });

  return (
    <Layout>
      <section className="section">
        <div className="panel">
          <Tags defaultOpen={true} />
        </div>
      </section>
    </Layout>
  );
}