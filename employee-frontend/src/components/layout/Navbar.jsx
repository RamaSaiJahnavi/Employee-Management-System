import React from "react";
import { NavLink } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto flex items-center justify-between p-4">
                {/* Logo / Brand */}
                <div className="text-xl font-bold text-green-700">
                    <NavLink to="/">MyCompany</NavLink>
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-6">

                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive
                                ? "text-green-600 font-semibold"
                                : "text-gray-700 hover:text-green-600 font-medium"
                        }
                    >
                        Departments
                    </NavLink>
                    <NavLink
                        to="/employees"
                        className={({ isActive }) =>
                            isActive
                                ? "text-green-600 font-semibold"
                                : "text-gray-700 hover:text-green-600 font-medium"
                        }
                    >
                        Employees
                    </NavLink>
                    <NavLink
                        to="/projects"
                        className={({ isActive }) =>
                            isActive
                                ? "text-green-600 font-semibold"
                                : "text-gray-700 hover:text-green-600 font-medium"
                        }
                    >
                        Projects
                    </NavLink>
                    <NavLink
                        to="/tasks"
                        className={({ isActive }) =>
                            isActive
                                ? "text-green-600 font-semibold"
                                : "text-gray-700 hover:text-green-600 font-medium"
                        }
                    >
                        Tasks
                    </NavLink>
                </div>
            </div>
        </nav>
    );
}