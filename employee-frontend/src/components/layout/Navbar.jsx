import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsMenuOpen(false);
    }, [location.pathname]);

    const navLinkClass = ({ isActive }) =>
        `rounded-md px-3 py-2 text-sm font-medium transition-colors ${
            isActive
                ? "bg-green-100 text-green-700"
                : "text-gray-700 hover:bg-gray-100 hover:text-green-700"
        }`;

    return (
        <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 shadow-sm backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
                <div className="text-lg font-bold text-green-700 sm:text-xl">
                    <NavLink to="/">MyCompany</NavLink>
                </div>

                <button
                    type="button"
                    onClick={() => setIsMenuOpen((prev) => !prev)}
                    className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 md:hidden"
                    aria-label="Toggle navigation"
                    aria-expanded={isMenuOpen}
                >
                    Menu
                </button>

                <div className="hidden items-center gap-2 md:flex">
                    <NavLink to="/" className={navLinkClass}>
                        Departments
                    </NavLink>
                    <NavLink to="/employees" className={navLinkClass}>
                        Employees
                    </NavLink>
                    <NavLink to="/projects" className={navLinkClass}>
                        Projects
                    </NavLink>
                    <NavLink to="/tasks" className={navLinkClass}>
                        Tasks
                    </NavLink>
                </div>
            </div>

            {isMenuOpen && (
                <div className="border-t border-gray-200 bg-white px-4 py-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        <NavLink to="/" className={navLinkClass}>
                            Departments
                        </NavLink>
                        <NavLink to="/employees" className={navLinkClass}>
                            Employees
                        </NavLink>
                        <NavLink to="/projects" className={navLinkClass}>
                            Projects
                        </NavLink>
                        <NavLink to="/tasks" className={navLinkClass}>
                            Tasks
                        </NavLink>
                    </div>
                </div>
            )}
        </nav>
    );
}
