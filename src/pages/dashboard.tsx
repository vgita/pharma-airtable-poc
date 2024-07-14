import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface PharmacyData {
    pharmacyId: string;
    pharmacyName: string;
    sales: { date: string; value: number }[];
}

const Dashboard = () => {
    const [data, setData] = useState<PharmacyData[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('');
    const router = useRouter(); // import and use useRouter

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const userRole = localStorage.getItem('role');

        if (!userId || !userRole) {
            router.push('/');
            return;
        }

        setRole(userRole);

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `/api/data?userId=${userId}&role=${userRole}`
                );
                const data = response.data;

                setData(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            {data.map((pharmacy) => (
                <div
                    key={pharmacy.pharmacyId}
                    className="w-full max-w-4xl mb-8"
                >
                    <h2 className="text-2xl font-bold mb-4">
                        {pharmacy.pharmacyName}
                    </h2>
                    <Line
                        data={{
                            labels: pharmacy.sales.map((sale) => sale.date),
                            datasets: [
                                {
                                    label: 'Daily Sales',
                                    data: pharmacy.sales.map(
                                        (sale) => sale.value
                                    ),
                                    fill: false,
                                    backgroundColor: 'rgba(75,192,192,0.6)',
                                    borderColor: 'rgba(75,192,192,1)'
                                }
                            ]
                        }}
                    />
                </div>
            ))}
        </div>
    );
};

export default Dashboard;
