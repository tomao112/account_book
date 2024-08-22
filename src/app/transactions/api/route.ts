import { supabase } from "@/app/lib/supabaseClient";

export async function GET(req: Request) {
	const allTransactions = await supabase
		.from('transactions')
		.select()
}
// import type { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
// 	if(req.method === 'POST') {
// 		const { user_id, amount, category, type, date, note } = req.body;
// 		const { data, error } = await supabase
// 			.from('transactions')
// 			.insert([{ user_id, amount, category, type, date, note }]);

// 			if(error)
// 				return res.status(400).json({ error: error.message});
// 				return res.status(200).json({ data });
// 		}
// 			return res.status(405).json({ error: 'Method not allowed' });
// 	}