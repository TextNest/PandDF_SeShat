import { NextApiRequest, NextApiResponse } from "next";// Pages Router용 타입 임포트
import pool from '@/lib/db';

export default async function handler(req: NextApiRequest, res:NextApiResponse){
    if(req.method === 'GET'){
        try{
            const connection = await pool.getConnection(); // 연결 풀에서 연결 가져오기

            try{//pool.excute()를 사용하여 'dohun' 테이블에서 모든 데이터 가져오기
                const[rows] = await connection.execute("SELECT * FROM dohun");
                res.status(200).json(rows);
            }finally{
                connection.release(); // 사용한 연결 반환
            }
        }catch(error){
            console.error("Database query error:", error);
            res.status(500).json({error: "Internal Server Error"});
        }
    }else {//GET 요청 외의 다른 HTTP 메서드에 대한 처리
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
