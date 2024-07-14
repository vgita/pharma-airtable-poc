import React from 'react';
import Head from 'next/head';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Head>
                <title>Pharma POC</title>
                <meta name="description" content="poc for pharma companies" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="bg-blue-500 text-white p-4">
                <h1>Pharma POC</h1>
            </header>
            <main className="p-4">{children}</main>
            <footer className="bg-gray-800 text-white p-4 text-center">
                <p>&copy; 2024 Pharma POC</p>
            </footer>
        </>
    );
};

export default Layout;
