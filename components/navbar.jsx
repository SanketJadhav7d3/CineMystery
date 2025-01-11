
import React from 'react';
import '../styles/navbar.css';
import Link from 'next/link'; 

export default function NavBar() {
    return (
        <nav className="navbar">
            <div className="navbar-logo">CineMystery</div>
            <ul className="navbar-links">
                <li>
                    <Link href="/">
                        Home
                    </Link>
                </li>
                <li>
                    <Link href="/help">
                        Help
                    </Link>
                </li>
                <li>
                    <Link href="/about">
                        About
                    </Link>
                </li>

            </ul>
        </nav>
    )
}