import mysql from 'mysql2/promise';

if (!process.env.DB_HOST || !process.env.DB_PORT || !process.env.DB_USER) {
    throw new Error("DB 연결 정보가 .env.local 파일에 설정되지 않았습니다.");
}

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT),

});

export default pool;