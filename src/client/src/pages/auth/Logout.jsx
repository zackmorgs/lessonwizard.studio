import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Layout from "../../components/Layout";
import { useAuth } from "../../contexts/AuthContext";
import { logout } from "../../services/authService";

const REDIRECT_DELAY_MS = 1500;

export default function Logout() {
	const navigate = useNavigate();
	const { setUser } = useAuth();

	useEffect(() => {
		logout();
		setUser(null);

		const timeoutId = window.setTimeout(() => {
			navigate("/", { replace: true });
		}, REDIRECT_DELAY_MS);

		return () => window.clearTimeout(timeoutId);
	}, [navigate, setUser]);

	return (
		<Layout>
			<section className="section">
				<div className="panel max-w-md mx-auto mt-10 text-center">
					<h1 className="h1 mb-2">Signed out</h1>
					<p className="text-sm text-gray-600">
						You have been logged out. Redirecting to the home page...
					</p>
				</div>
			</section>
		</Layout>
	);
}
