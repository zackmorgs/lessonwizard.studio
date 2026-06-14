import React from "react";
import { useParams } from "react-router-dom";

import Layout from "../../components/Layout";

export default function LessonsOnDate() {
	const { year, month, day } = useParams();

	return (
		<Layout>
			<section className="section">
				<div className="panel">
					<h1 className="h1">Lessons on {`${year}-${month}-${day}`}</h1>
				</div>
			</section>
		</Layout>
	);
}
