import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../config/api";

function Project() {

    const API = apiUrl("/projects");
    const EMP_API = apiUrl("/employees");

    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [showEmpDropdown, setShowEmpDropdown] = useState(false);
    const [search, setSearch] = useState("");

    const dropdownRef = useRef(null);

    const [form, setForm] = useState({
        id: null,
        title: "",
        deadline: "",
        employees: []
    });

    useEffect(() => {
        fetchProjects();
        fetchEmployees();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowEmpDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            alert(err.message);
        }
    };

    const fetchEmployees = async () => {
        try {
            const res = await fetch(EMP_API);
            if (!res.ok) throw new Error(`Failed to fetch employees: ${res.statusText}`);
            const data = await res.json();
            setEmployees(data);
        } catch (err) {
            alert(err.message);
        }
    };

    const searchProjects = async () => {
        try {
            if (!search) {
                fetchProjects();
                return;
            }

            if (!isNaN(search)) {
                const res = await fetch(`${API}/${search}`);
                if (!res.ok) throw new Error("Project not found");
                const data = await res.json();
                setProjects([data]);
            } else {
                const res = await fetch(`${API}/search/${search}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setProjects(data);
            }
        } catch (err) {
            setProjects([]);
            alert(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            employees: form.employees.map((id) => ({ id: Number(id) }))
        };

        try {
            let res;
            if (form.id) {
                res = await fetch(`${API}/${form.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            } else {
                res = await fetch(API, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
            }

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Operation failed");
            }

            alert(form.id ? "Project updated successfully" : "Project added successfully");
            setForm({ id: null, title: "", deadline: "", employees: [] });
            fetchProjects();

        } catch (err) {
            alert(err.message);
        }
    };

    const handleEdit = (p) => {
        setForm({
            ...p,
            employees: p.employees?.map((e) => e.id) || []
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this project?")) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }

            alert("Project deleted successfully");
            fetchProjects();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">

            <h2 className="mb-6 text-center text-3xl font-bold text-green-700">
                Project Management
            </h2>

            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">

                <input
                    placeholder="Search by ID or Title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 sm:w-80"
                />

                <button
                    onClick={searchProjects}
                    className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                    Search
                </button>

                <button
                    onClick={() => { setSearch(""); fetchProjects(); }}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                    Reset
                </button>

            </div>

            <form
                onSubmit={handleSubmit}
                className="mb-8 grid grid-cols-1 items-end gap-4 rounded-lg bg-white p-4 shadow-md sm:p-6 md:grid-cols-4"
            >

                <input
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Project Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                    type="date"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={form.deadline}
                    onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                />

                <div className="relative w-full" ref={dropdownRef}>
                    <div
                        onClick={() => setShowEmpDropdown(!showEmpDropdown)}
                        className="flex cursor-pointer items-center justify-between rounded border border-gray-300 bg-white px-3 py-2"
                    >
                        <span>
                            {form.employees.length ? `${form.employees.length} Selected` : "Select Employees"}
                        </span>
                        <span className={`transition-transform ${showEmpDropdown ? "rotate-180" : ""}`}>
                            v
                        </span>
                    </div>

                    {showEmpDropdown && (
                        <div className="absolute z-10 mt-1 max-h-40 w-full overflow-y-auto rounded border bg-white shadow">
                            {employees.map((emp) => (
                                <label
                                    key={emp.id}
                                    className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100"
                                >
                                    <input
                                        type="checkbox"
                                        checked={form.employees.includes(emp.id)}
                                        onChange={() => {
                                            if (form.employees.includes(emp.id)) {
                                                setForm({ ...form, employees: form.employees.filter((id) => id !== emp.id) });
                                            } else {
                                                setForm({ ...form, employees: [...form.employees, emp.id] });
                                            }
                                        }}
                                    />
                                    {emp.name}
                                </label>
                            ))}
                        </div>
                    )}

                </div>

                <button
                    type="submit"
                    className="w-full rounded bg-green-700 px-4 py-2 text-white md:w-auto"
                >
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            <div className="grid gap-6">
                {projects.map((p) => (
                    <div key={p.id} className="rounded-lg bg-white p-4 shadow-md">

                        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <h3 className="text-lg font-semibold">{p.title} (ID: {p.id})</h3>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(p)}
                                    className="rounded bg-yellow-400 px-3 py-2 text-white"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    className="rounded bg-red-500 px-3 py-2 text-white"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>

                        <p>Deadline: {p.deadline || "Not set"}</p>
                        <p>Employees: {p.employees?.length ? p.employees.map((e) => e.name).join(", ") : "None"}</p>
                        <p>Tasks: {p.tasks?.length ? p.tasks.map((t) => t.title).join(", ") : "None"}</p>

                    </div>
                ))}
            </div>

        </div>
    );
}

export default Project;
