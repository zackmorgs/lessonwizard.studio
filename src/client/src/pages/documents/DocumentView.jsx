import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";

import Layout from "../../components/Layout";
import TagPicker from "../../components/TagPicker";
import { getDocumentById, deleteDocument } from "../../services/documentService";

export default function DocumentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doc, setDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getDocumentById(id)
      .then(setDoc)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!confirm(`Delete "${doc.title}"? This cannot be undone.`)) return;
    try {
      await deleteDocument(id);
      navigate("/documents");
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading)
    return (
      <Layout>
        <p className="p-6 text-sm text-gray-500">Loading...</p>
      </Layout>
    );

  if (error || !doc)
    return (
      <Layout>
        <p className="p-6 text-sm text-red-600">{error ?? "Document not found."}</p>
      </Layout>
    );

  return (
    <Layout>
      <div className="md:max-w-2xl mx-auto">
        <header>
          <div className="panel">
            <Link to="/documents" className="text-sm text-blue-600 hover:underline">
              &larr; All Documents
            </Link>
            <h1 className="h1 mt-2 text-3xl">{doc.title}</h1>
            {doc.description && (
              <p className="mt-1 text-gray-500">{doc.description}</p>
            )}
          </div>
        </header>

        <section className="section">
          <div className="panel flex flex-col gap-4">

            {/* Tags */}
            {doc.tagIds?.length > 0 && (
              <div className="flex flex-col gap-1">
                <label className="label">Tags</label>
                <TagPicker value={doc.tagIds} onChange={() => {}} disabled />
              </div>
            )}

            {/* PDF viewer */}
            {doc.pdfUrl ? (
              <div className="flex flex-col gap-1">
                <label className="label">PDF</label>
                <iframe
                  src={doc.pdfUrl}
                  title={doc.title}
                  className="w-full rounded border"
                  style={{ height: "70vh" }}
                />
                <a
                  href={doc.pdfUrl}
                  download
                  className="btn btn-secondary mt-2 self-start"
                >
                  Download PDF
                </a>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No PDF attached.</p>
            )}

            {/* Danger zone */}
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
              >
                Delete Document
              </button>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
