import React from "react";

import Accordion from "../components/Accordion";

let students_list = [
  {
    id: "1",
    name: "John Doe",
  },
  {
    id: "2",
    name: "Jane Doe",
  },
  {
    id: "3",
    name: "Emily Davis",
  },
  {
    id: "4",
    name: "Bob Brown",
  },
  {
    id: "4",
    name: "Mary Smith",
  },
  {
    id: "4",
    name: "Alice Johnson",
  },
];

export default function StudentList() {
  return (
    <div className="panel">
      <Accordion
        title={<h2 className="h2 mb-4">Students</h2>}
        defaultOpen={true}
      >
        {students_list.length > 0 ? (
          <div className="scrollable max-h-72">
            <div className="grid grid-cols-2 gap-4">
              {students_list.map((student) => (
                <div
                  key={student.id}
                  className="flex flex-col items-start justify-between gap-2 p-4 border rounded"
                >
                  <span className="text-center">{student.name}</span>
                  <button className="btn btn-secondary btn-sm">View</button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="well well-info">
            <p>No students found.</p>
          </div>
        )}
      </Accordion>
    </div>
  );
}
