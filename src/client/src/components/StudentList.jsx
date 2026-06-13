import React from "react";
import { Link } from "react-router-dom";

import Accordion from "../components/Accordion";


export default function StudentList({ studentList }) {
  return (
    <section id="student_list" className="section">
      <Accordion title={<h2 className="h2 flex flex-row"><img src="/assets/svg/icon-person.svg" alt="Students" className="mr-4" /><span>Students</span></h2>} defaultOpen={false}>
        {studentList.length > 0 ? (
          <div className="scrollable max-h-72">
            <div className="grid grid-cols-2 gap-4">
              {studentList.map((student) => (
                <div
                  key={student.id}
                  className="student-item flex flex-col items-center justify-between gap-2 p-4"
                >
                  <svg className="icon-student" xmlns="http://www.w3.org/2000/svg" height="2.5rem" viewBox="0 -960 960 960" width="2.5rem" fill="currentColor"><path d="M234-276q51-39 114-61.5T480-360q69 0 132 22.5T726-276q35-41 54.5-93T800-480q0-133-93.5-226.5T480-800q-133 0-226.5 93.5T160-480q0 59 19.5 111t54.5 93Zm146.5-204.5Q340-521 340-580t40.5-99.5Q421-720 480-720t99.5 40.5Q620-639 620-580t-40.5 99.5Q539-440 480-440t-99.5-40.5ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm100-95.5q47-15.5 86-44.5-39-29-86-44.5T480-280q-53 0-100 15.5T294-220q39 29 86 44.5T480-160q53 0 100-15.5ZM523-537q17-17 17-43t-17-43q-17-17-43-17t-43 17q-17 17-17 43t17 43q17 17 43 17t43-17Zm-43-43Zm0 360Z"/></svg>
                  <span className="text-center">{student.name}</span>
                  <Link to={`/students/${student.id}`} className="btn btn-sm btn-grey">View</Link>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="well well-info">
            <p>No students found.</p>
          </div>
        )}
        <Link to="/students/new" className="btn btn-success mt-4">
          <svg className="icon" xmlns="http://www.w3.org/2000/svg" height="1.5rem" viewBox="0 -960 960 960" width="1.5rem" fill="currentColor"><path d="M720-400v-120H600v-80h120v-120h80v120h120v80H800v120h-80ZM247-527q-47-47-47-113t47-113q47-47 113-47t113 47q47 47 47 113t-47 113q-47 47-113 47t-113-47ZM40-160v-112q0-34 17.5-62.5T104-378q62-31 126-46.5T360-440q66 0 130 15.5T616-378q29 15 46.5 43.5T680-272v112H40Zm80-80h480v-32q0-11-5.5-20T580-306q-54-27-109-40.5T360-360q-56 0-111 13.5T140-306q-9 5-14.5 14t-5.5 20v32Zm296.5-343.5Q440-607 440-640t-23.5-56.5Q393-720 360-720t-56.5 23.5Q280-673 280-640t23.5 56.5Q327-560 360-560t56.5-23.5ZM360-640Zm0 400Z"/></svg>
          <span className="btn-text btn-success">Add Student</span>
        </Link>
      </Accordion>
      {/* <div className="panel">
        <hr className="rule-sm" />
        
      </div> */}
    </section>
  );
}
