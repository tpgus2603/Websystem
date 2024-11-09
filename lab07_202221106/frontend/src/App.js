// src/App.js
import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [totalCredits, setTotalCredits] = useState(0);

  useEffect(() => {
    // 서버에서 강의 목록 가져오기
    fetch('/api/courses', {
    })
      .then(response => response.json())
      .then(data => setCourses(data))
      .catch(error=>console.error('Error fetching courses: ',error));
  }, []);

  const handleEnroll = (course) => {
    fetch(`/api/courses/${course.id}/enroll`, {
      method: 'PUT',
    })
      .then(response => {
        if (response.ok) {
          // 강의 정보 업데이트
          const updatedCourses = courses.map(c => {
            if (c.id === course.id) {
              return { ...c, currentStudents: c.currentStudents + 1 };
            }
            return c;
          });
          setCourses(updatedCourses);

          // 신청한 강의에 추가
          setEnrolledCourses([...enrolledCourses, course]);

          // 총 학점 증가
          setTotalCredits(totalCredits + course.credits);
        } else {
          // 정원 초과 시 alert 창 표시
          response.json().then(data => {
            alert(data.error);
          });
        }
      })
      .catch(error => {
        console.error('Error enrolling course:', error);
      });
  };

  const handleCancel = (course) => {
    fetch(`/api/courses/${course.id}/cancel`, {
      method: 'PUT',
    })
      .then(response => {
        if (response.ok) {
          // 강의 정보 업데이트
          const updatedCourses = courses.map(c => {
            if (c.id === course.id) {
              return { ...c, currentStudents: c.currentStudents - 1 };
            }
            return c;
          });
          setCourses(updatedCourses);

          // 신청한 강의에서 제거
          setEnrolledCourses(enrolledCourses.filter(c => c.id !== course.id));

          // 총 학점 감소
          setTotalCredits(totalCredits - course.credits);
        } else {
          console.error('Error cancelling course');
        }
      })
      .catch(error => {
        console.error('Error cancelling course:', error);
      });
  };

  const isEnrolled = (courseId) => {
    return enrolledCourses.some(c => c.id === courseId);
  };

  return (
    <div className="container">
      <h1 className="title">강의 목록</h1>
      <ul className="course-list">
        {courses.map(course => (
          <li key={course.id} className="course-item">
            <div>
              <span className="course-name">{course.name}</span>
              <span className="course-info">
                ({course.credits}학점 / {course.currentStudents}명 / {course.maxStudents}명)
              </span>
            </div>
            <button
              className={isEnrolled(course.id) ? "cancel-button" : "enroll-button"}
              onClick={() => isEnrolled(course.id) ? handleCancel(course) : handleEnroll(course)}
            >
              {isEnrolled(course.id) ? "취소" : "신청"}
            </button>
          </li>
        ))}
      </ul>
      
      <h2 className="subtitle">신청한 강의 목록</h2>
      <ul className="enrolled-list">
        {enrolledCourses.map(course => (
          <li key={course.id} className="enrolled-item">
            <span>{course.name} ({course.credits}학점)</span>
          </li>
        ))}
      </ul>
      <div className="total-credits">
        <p>총 학점: {totalCredits}</p>
      </div>
    </div>
  );
}

export default App;
