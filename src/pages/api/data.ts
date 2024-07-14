import { NextApiRequest, NextApiResponse } from 'next';
import Airtable from 'airtable';

const airtable = new Airtable({
    apiKey: process.env.NEXT_PUBLIC_AIRTABLE_API_TOKEN
});

const base = airtable.base(process.env.NEXT_PUBLIC_AIRTABLE_BASE_ID!);

export default async function getData(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { userId, role } = req.query;

    try {
        let pharmacyRecords;
        if (role === 'Admin') {
            pharmacyRecords = await base('Pharmacies').select().all();
        } else {
            const userRecord = await base('Users').find(userId as string);
            pharmacyRecords = await base('Pharmacies')
                .select({
                    filterByFormula: `FIND('${userRecord.fields.Id}', {Users})`
                })
                .all();
        }

        const pharmacyIds = pharmacyRecords.map((record) => record.fields.Id);

        const pharmaciesWithSales = await Promise.all(
            pharmacyIds.map(async (id) => {
                const sales = await base('Sales')
                    .select({
                        //  filterByFormula: `{Pharmacy} = '${id}'`
                        filterByFormula: `FIND('${id}', {Pharmacy})`
                    })
                    .all();

                const pharmacyRecord = pharmacyRecords.find(
                    (record) => record.fields.Id === id
                );

                return {
                    pharmacyId: id,
                    pharmacyName: pharmacyRecord?.fields.Name,
                    sales: sales.map((sale) => ({
                        id: sale.id,
                        date: sale.fields.Date,
                        value: sale.fields.Amount
                    }))
                };
            })
        );

        res.status(200).json(pharmaciesWithSales);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
}
