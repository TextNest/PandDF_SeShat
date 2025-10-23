// /pages/api/users.ts
// 이 파일은 Next.js의 API 라우트입니다.
// /api/users 경로로 들어오는 HTTP 요청을 처리하여 DB의 가구 정보를 반환합니다.
// (파일 이름이 users인 것은 초기 설정일 수 있으며, furniture로 변경하는 것이 더 명확합니다.)

import { NextApiRequest, NextApiResponse } from "next";// Pages Router용 타입 임포트
import pool from '@/lib/db'; // 설정된 DB 연결 풀을 가져옵니다.

export default async function handler(req: NextApiRequest, res:NextApiResponse){
    // GET 요청만 처리하도록 제한합니다.
    if(req.method === 'GET'){
        try{
            // 연결 풀에서 새로운 연결을 하나 가져옵니다.
            const connection = await pool.getConnection();

            try{
                // SQL 쿼리를 실행하여 'dohun' 테이블에서 모든 데이터를 가져옵니다.
                // execute 메서드는 SQL Injection 공격을 방지하는 데 도움이 됩니다.
                const[rows] = await connection.execute("SELECT * FROM dohun");
                // 성공적으로 데이터를 가져오면 200 상태 코드와 함께 JSON 형태로 응답합니다.
                res.status(200).json(rows);
            }finally{
                // 쿼리 실행이 성공하든 실패하든, 사용한 연결은 반드시 풀에 반환해야 합니다.
                connection.release();
            }
        }catch(error){
            // DB 연결이나 쿼리 실행 중 오류가 발생하면 콘솔에 에러를 기록합니다.
            console.error("Database query error:", error);
            // 클라이언트에는 500 상태 코드와 함께 일반적인 에러 메시지를 보냅니다.
            res.status(500).json({error: "Internal Server Error"});
        }
    }else {
        // GET 이외의 다른 HTTP 메서드(POST, PUT, DELETE 등)로 요청이 오면
        // 405 Method Not Allowed 상태 코드로 응답합니다.
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}