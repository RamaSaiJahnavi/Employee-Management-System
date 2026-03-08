import { useEffect, useState } from "react";
import { apiUrl } from "../config/api";

function Task() {

    const API = apiUrl("/tasks");
    const PROJECT_API = apiUrl("/projects");

    const [tasks, setTasks] = useState([]);
    const [projects, setProjects] = useState([]);
    const [search, setSearch] = useState("");

    const [form, setForm] = useState({
        id: null,
        title: "",
        priority: "",
        dueDate: "",
        project: { id: "" }
    });

    useEffect(() => {
        fetchTasks();
        fetchProjects();
    }, []);

    // ---------- Fetch Tasks ----------
    const fetchTasks = async () => {
        try {
            const res = await fetch(API);
            if (!res.ok) throw new Error(`Failed to fetch tasks: ${res.statusText}`);
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Fetch Projects ----------
    const fetchProjects = async () => {
        try {
            const res = await fetch(PROJECT_API);
            if (!res.ok) throw new Error(`Failed to fetch projects: ${res.statusText}`);
            const data = await res.json();
            setProjects(data);
        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Search Tasks ----------
    const searchTasks = async () => {
        try {
            if (!search) {
                fetchTasks();
                return;
            }

            if (!isNaN(search)) {
                const res = await fetch(`${API}/${search}`);
                if (!res.ok) throw new Error("Task not found");
                const data = await res.json();
                setTasks([data]);
            } else {
                const res = await fetch(`${API}/search/${search}`);
                if (!res.ok) throw new Error("Search failed");
                const data = await res.json();
                setTasks(data);
            }
        } catch (err) {
            setTasks([]);
            alert(err.message);
        }
    };

    // ---------- Handle Submit ----------
    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            ...form,
            priority: Number(form.priority),
            project: { id: Number(form.project.id) }
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

            const message = form.id ? "Task updated successfully" : "Task added successfully";
            alert(message);

            setForm({ id: null, title: "", priority: "", dueDate: "", project: { id: "" } });
            fetchTasks();

        } catch (err) {
            alert(err.message);
        }
    };

    // ---------- Handle Edit ----------
    const handleEdit = (task) => {
        setForm({
            ...task,
            project: { id: task.project?.id || "" }
        });
    };

    // ---------- Handle Delete ----------
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const res = await fetch(`${API}/${id}`, { method: "DELETE" });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Delete failed");
            }

            alert("Task deleted successfully");
            fetchTasks();
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6">

            <h2 className="text-3xl font-bold text-center mb-6 text-green-700">
                Task Management
            </h2>

            {/* SEARCH BAR */}
            <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:justify-center">

                <input
                    placeholder="Search by ID or Title..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2 sm:w-80"
                />

                <button
                    onClick={searchTasks}
                    className="rounded bg-green-700 px-4 py-2 text-white hover:bg-green-800"
                >
                    Search
                </button>

                <button
                    onClick={() => { setSearch(""); fetchTasks(); }}
                    className="rounded bg-gray-600 px-4 py-2 text-white hover:bg-gray-700"
                >
                    Reset
                </button>

            </div>

            {/* TASK FORM */}
            <form
                onSubmit={handleSubmit}
                className="mb-8 grid grid-cols-1 items-end gap-4 rounded-lg bg-white p-4 shadow-md sm:p-6 md:grid-cols-5"
            >

                <input
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    placeholder="Title"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                />

                <input
                    type="number"
                    placeholder="Priority (1-5)"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                />

                <input
                    type="date"
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={form.dueDate}
                    onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                />

                <select
                    className="w-full rounded border border-gray-300 px-3 py-2"
                    value={form.project.id}
                    onChange={(e) => setForm({ ...form, project: { id: e.target.value } })}
                >
                    <option value="">Select Project</option>
                    {projects.map(p => (
                        <option key={p.id} value={p.id}>
                            {p.title}
                        </option>
                    ))}
                </select>

                <button
                    type="submit"
                    className="w-full rounded bg-green-700 px-4 py-2 text-white md:w-auto"
                >
                    {form.id ? "Update" : "Add"}
                </button>

            </form>

            {/* TASK LIST */}
            <div className="grid gap-6">

                {tasks.map(t => (
                    <div key={t.id} className="bg-white shadow-md rounded-lg p-4">

                        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

                            <h3 className="font-semibold text-lg">
                                {t.title} (ID: {t.id})
                            </h3>

                            <div className="flex gap-2">

                                <button
                                    onClick={() => handleEdit(t)}
                                    className="rounded bg-yellow-400 px-3 py-2 text-white"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => handleDelete(t.id)}
                                    className="rounded bg-red-500 px-3 py-2 text-white"
                                >
                                    Delete
                                </button>

                            </div>

                        </div>

                        <p>Priority: {t.priority}</p>
                        <p>Due Date: {t.dueDate || "Not set"}</p>
                        <p>Project: {t.project?.title || "None"}</p>

                    </div>
                ))}

            </div>

        </div>
    );
}

export default Task;
