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
                <section class="p-4 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} zoilerplate. All rights reserved.</p>
                </section>
            </footer>
        </div>
    );
}