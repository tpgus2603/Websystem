const express = require('express');
const app = express();

// 첫 번째 미들웨어 - 모든 요청에 대해 실행
app.use(function(req, res, next) {   
    console.log("Start");
    next();  // 다음 미들웨어로 제어를 넘김
});

// 라우트 핸들러 - 루트 경로에 대한 GET 요청 처리
app.get('/', function(req, res, next) {
    res.send("Hello World!");  // 클라이언트에 "Hello World!" 메시지 전송
    console.log("Middle");
    next();  // (예외적인 경우로) 다음 미들웨어로 제어를 넘김
});

// 두 번째 미들웨어 - 루트 경로에 대해 실행되며 모든 메서드에 적용
app.use('/', function(req, res) {
    console.log("End");
});

// 서버 시작
app.listen(3000);