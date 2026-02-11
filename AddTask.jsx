import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

export default function AddTask() {

    const { id } = useParams()
    const nav = useNavigate()

    const [task, setTask] = useState({
        title: "",
        description: "",
        priority: ""
    })

    const change = e => {
        setTask({ ...task, [e.target.name]: e.target.value })
    }

    const submit = e => {
        e.preventDefault()

        fetch(`http://localhost:8080/employees/${id}/tasks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(task)
        }).then(() => nav(`/tasks/${id}`))
    }

    return (
        <div className="container">
            <h3>Add Task</h3>

            <form onSubmit={submit}>
                <input name="title" placeholder="Title" onChange={change}/>
                <input name="description" placeholder="Description" onChange={change}/>
                <input name="priority" placeholder="Priority" onChange={change}/>
                <button>Add Task</button>
            </form>
        </div>
    )
}