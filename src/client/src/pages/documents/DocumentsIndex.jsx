import React from  'react';

import Layout from './../../components/Layout';
import DocumentsList from './../../components/DocumentsList';


export default function DocumentsIndex() {
    return (
        <Layout>
            <header className="header">
                <h1 className="h1 text-xl text-center">Documents</h1>
            </header>
            <DocumentsList />
        </Layout>
    );
}