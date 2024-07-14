import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';
import querystring from 'querystring';

const airtable = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN
});
const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

const USER_VIEW =
    'https://airtable.com/embed/appEomndGPlFkZpXE/shrNQoyXKLxpAS4Y7?';
const ADMIN_VIEW =
    'https://airtable.com/embed/appEomndGPlFkZpXE/shrmU1M0cLKnB8BDB?viewControls=on';

export default async function getAirtableUrl(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId } = req.query;

    try {
        const userRecord = await base('Users').find(userId as string);

        const role = userRecord.fields.Role;

        let viewUrl;

        let pharmacyRecords;
        if (role === 'Admin') {
            pharmacyRecords = await base('Pharmacies').select().all();
            viewUrl = ADMIN_VIEW;
        } else {
            const userRecord = await base('Users').find(userId as string);
            pharmacyRecords = await base('Pharmacies')
                .select({
                    filterByFormula: `FIND('${userRecord.fields.Id}', {Users})`
                })
                .all();
            viewUrl = USER_VIEW;
        }

        const pharmacyIds = pharmacyRecords.map((record) => record.fields.Id);

        const filterParams = pharmacyIds
            .map((id) => `filter_Pharmacy=${id}`)
            .join('&');

        const url = `${viewUrl}&${filterParams}&filterConjunction=or`;
        console.log(url);
        res.status(200).json({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to generate Airtable URL' });
    }
}
