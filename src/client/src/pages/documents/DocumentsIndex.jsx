import React, { useState, useEffect } from 'react';

import Layout from './../../components/Layout';
import Breadcrumbs from "./../../components/Breadcrumbs";

import DocumentsList from './../../components/DocumentsList';
import { getDocuments } from '../../services/documentService';


export default function DocumentsIndex() {
    const [documents, setDocuments] = useState([]);

    useEffect(() => {
        getDocuments()
            .then(setDocuments)
            .catch(() => {});
    }, []);

    return (
        <Layout>
            <Breadcrumbs to="/" label="Dashboard" />
            <header className="header mb-4">
                <h1 className="h1 text-xl text-center">Documents</h1>
            </header>
            <div className="md:max-w-2xl mx-auto">
                <DocumentsList documents={documents} defaultOpen={true} showControls={true} />
            </div>
        </Layout>
    );
}