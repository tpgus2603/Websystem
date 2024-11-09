const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

let courses = [
    { id: 1, name: '웹 시스템 설계', credits: 4, currentStudents: 40, maxStudents: 40 },
    { id: 2, name: '컴퓨터 프로그래밍', credits: 3, currentStudents: 20, maxStudents: 30 },
    { id: 3, name: '객체 지향 프로그래밍', credits: 4, currentStudents: 49, maxStudents: 50 },
    { id: 4, name: '기계 학습', credits: 3, currentStudents: 23, maxStudents: 25 },
    { id: 5, name: '공업 수학', credits: 3, currentStudents: 29, maxStudents: 30 },
    { id: 6, name: '수영', credits: 1, currentStudents: 5, maxStudents: 20 },
];

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.put('/api/courses/:id/enroll', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);

    if (course && course.currentStudents < course.maxStudents) {
        course.currentStudents += 1;
        res.status(200).send();
    } else {
        res.status(400).send({ error: '수강 인원 초과' });
    }
});

app.put('/api/courses/:id/cancel', (req, res) => {
    const courseId = parseInt(req.params.id);
    const course = courses.find(c => c.id === courseId);

    course.currentStudents -= 1;
    res.status(200).send();
});

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`수강 신청 서버 실행. Port : ${PORT}`);
});
