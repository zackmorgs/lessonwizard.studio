import React from  'react';

import Layout from './../../components/Layout';
import DocumentsList from './../../components/DocumentsList';


export default function DocumentsIndex() {
    return (
        <Layout>
            <header className="header mb-4">
                <h1 className="h1 text-xl text-center">Documents</h1>
            </header>
            <div className="md:max-w-2xl mx-auto">
                <DocumentsList  defaultOpen={true} />
            </div>
        </Layout>
    );
}