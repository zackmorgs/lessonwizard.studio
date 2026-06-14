import React from "react";
import { useParams } from "react-router-dom";

import { getLessonsOnDate } from "../../services/lessonService";

import Layout from "../../components/Layout";
import LessonList from "../../components/LessonList";

export default function LessonsOnDate() {
	const { year, month, day } = useParams();
    const [lessons, setLessons] = React.useState([]);

    React.useEffect(() => {
		const selectedDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

		getLessonsOnDate(selectedDate)
            .then(setLessons)
            .catch(() => setLessons([]));
    }, [year, month, day]);

	return (
		<Layout>
			<section className="section">
				<div className="panel">
					<h1 className="h1">Lessons on {`${year}-${month}-${day}`}</h1>
				</div>
			</section>
            <LessonList lessons={lessons} />
		</Layout>
	);
}
