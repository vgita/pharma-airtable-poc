import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const Index = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('userId');
        const checkAuth = async () => {
            if (userId) {
                try {
                    const response = await axios.get(
                        `/api/auth/checkAuth?userId=${userId}`
                    );
                    if (response.data.success) {
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                } catch (error) {
                    setIsAuthenticated(false);
                }
            }
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) return <p>Loading...</p>;

    return isAuthenticated ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-6 text-3xl font-bold">Dashboard</h1>
            <Link
                href="/dashboard"
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
                Go to Dashboard
            </Link>
            <button
                onClick={() => {
                    localStorage.removeItem('userId');
                    localStorage.removeItem('role');
                    router.reload();
                }}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
            >
                Logout
            </button>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="mb-6 text-3xl font-bold">Login</h1>
            <Link
                href="/auth/login"
                className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-700"
            >
                Login
            </Link>
            <p>
                <Link
                    href="/auth/register"
                    className="text-blue-500 hover:underline"
                >
                    Register
                </Link>
            </p>
        </div>
    );
};

export default Index;
