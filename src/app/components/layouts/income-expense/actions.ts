// 'use server'

// import { createClient } from '../../../utils/supabase/server'

// /**
//  * データ挿入
//  * @param formData - フォームデータ
//  */
// export async function insertData(formData: FormData) {
//   // Supabaseクライアントを作成
//   const supabase = await createClient()

//   // フォームから入力値を取得
//   const inputs = {
//     amount: formData.get('amount') as string,      // 数値として扱いたい場合は Number() を使用
//     category: formData.get('category') as string,
//     date: formData.get('date') as string,
//     type: formData.get('type') as string,
//     note: formData.get('note') as string,
//   }

//   // データ挿入
//   const { error } = await supabase
//     .from('transactions')  // transactionsテーブルに
//     .insert([{                // 入力されたデータを挿入
//       user_id: '1',          // ここでは user_id は静的な値として指定
//       amount: Number(inputs.amount),  // 数値として挿入する
//       category: inputs.category,
//       date: inputs.date,
//       type: inputs.type,
//       note: inputs.note
//     }])

//   // エラーが発生した場合
//   if (error) {
//     console.error('Error inserting data:', error.message)
//     // エラーハンドリング
//   }
// }
