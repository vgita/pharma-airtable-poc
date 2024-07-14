import { useEffect, useState } from 'react';
import axios from 'axios';

const AirTableDashboard = () => {
    const [airtableUrl, setAirtableUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userId = localStorage.getItem('userId');

        const fetchEmbedUrl = async () => {
            try {
                const response = await axios.get(
                    `/api/getAirtableUrl?userId=${userId}`
                );
                setAirtableUrl(response.data.url);
            } catch (error) {
                console.error('Failed to fetch Airtable URL', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEmbedUrl();
    }, []);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="mb-6 text-3xl font-bold">Airtable Dashboard</h1>
            <div className="w-full max-w-4xl mb-8">
                <iframe
                    src={airtableUrl}
                    width="100%"
                    height="600"
                    style={{ border: 'none' }}
                ></iframe>
            </div>
        </div>
    );
};

export default AirTableDashboard;
