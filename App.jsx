import "./App.css"
import { Routes, Route, Link } from "react-router-dom"
import Employees from "./pages/Employees"
import AddEmployee from "./pages/AddEmployee"
import Tasks from "./pages/Task"
import AddTask from "./pages/AddTask"
import UpdateEmployee from "./pages/UpdateEmployee"
import UpdateTask from "./pages/UpdateTask"

export default function App() {
    return (
        <div>

            <h2>Employee Task System</h2>

            <nav>
                <center><Link to="/" className="nav-btn">Employees</Link></center>
            </nav>

            <Routes>
                <Route path="/" element={<Employees />} />
                <Route path="/add" element={<AddEmployee />} />
                <Route path="/tasks/:id" element={<Tasks />} />
                <Route path="/addtask/:id" element={<AddTask />} />
                <Route path="/update/:id" element={<UpdateEmployee/>}/>
                <Route path="/updatetask/:id" element={<UpdateTask/>}/>
            </Routes>

        </div>
    )
}