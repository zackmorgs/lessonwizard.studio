import React from 'react';
import NavMenu from './NavMenu';

export default function Layout({ children }) {
    return (
        <div className="relative">
            <NavMenu />
            <main>
                {children}
            </main>
            <footer id="footer_main">
                <section className="p-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} lessonwizard.studio - All rights reserved.</p>
                </section>
            </footer>
        </div>
    );
}