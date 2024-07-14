import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';
import bcrypt from 'bcryptjs';

const airtable = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN
});

const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export default async function register(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const { email, password } = req.body;

        try {
            const existingRecords = await base('Users')
                .select({
                    filterByFormula: `{Email} = '${email}'`
                })
                .firstPage();

            if (existingRecords.length > 0) {
                res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await base('Users').create([
                {
                    fields: {
                        Email: email,
                        Password: hashedPassword,
                        Role: 'User'
                    }
                }
            ]);

            res.status(201).json({
                success: true,
                userId: newUser[0].id
            });
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
