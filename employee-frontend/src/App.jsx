import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Department from "./components/Department";
import Employee from "./components/Employee";
import Project from "./components/Project";
import Task from "./components/Task";
import Navbar from "./components/layout/Navbar.jsx";

import './App.css';

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-slate-100">
                <Navbar />

                <Routes>
                    <Route path="/" element={<Department />} />
                    <Route path="/employees" element={<Employee />} />
                    <Route path="/projects" element={<Project />} />
                    <Route path="/tasks" element={<Task />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
