import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';
import bcrypt from 'bcryptjs';

const airtable = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN
});

const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export default async function login(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const records = await base('Users')
                .select({
                    filterByFormula: `{Email} = '${email}'`
                })
                .firstPage();

            if (records.length > 0) {
                const user = records[0].fields as {
                    Password: string;
                    Role: string;
                };
                const isPasswordValid = await bcrypt.compare(
                    password,
                    user.Password
                );

                if (isPasswordValid) {
                    res.status(200).json({
                        success: true,
                        role: user.Role,
                        userId: records[0].id
                    });
                } else {
                    res.status(401).json({
                        success: false,
                        message: 'Invalid password'
                    });
                }
            } else {
                res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
