const DashboardCards = () => {
    return (
        <div className="flex justify-center space-x-4 mt-8">
            <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center">
                <h2 className="text-xl font-bold mb-4">Go To Dashboard</h2>
                <a
                    href="/dashboard"
                    className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Go
                </a>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 w-64 text-center">
                <h2 className="text-xl font-bold mb-4">Go to Airtable</h2>
                <a
                    href="/air-tbl-dashboard"
                    className="inline-block px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-700"
                >
                    Go
                </a>
            </div>
        </div>
    );
};

export default DashboardCards;
