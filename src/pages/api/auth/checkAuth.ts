import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';

const airtable = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN
});

const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export default async function checkAuth(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'GET') {
        const { userId } = req.query;

        try {
            const record = await base('Users').find(userId as string);
            if (record) {
                res.status(200).json({ success: true });
            } else {
                res.status(401).json({ success: false });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    } else {
        res.status(405).end();
    }
}
