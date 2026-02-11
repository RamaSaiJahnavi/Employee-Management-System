import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function AddEmployee() {

    const [emp, setEmp] = useState({
        name: "",
        department: "",
        salary: ""
    })

    const nav = useNavigate()

    const change = e => {
        setEmp({ ...emp, [e.target.name]: e.target.value })
    }

    const submit = e => {
        e.preventDefault()

        fetch("http://localhost:8080/employees", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(emp)
        }).then(() => nav("/"))
    }

    return (
        <div className="container">
            <h3>Add Employee</h3>

            <form onSubmit={submit}>
                <input name="name" placeholder="Name" onChange={change}/>
                <input name="department" placeholder="Department" onChange={change}/>
                <input name="salary" placeholder="Salary" onChange={change}/>
                <button>Add Employee</button>
            </form>
        </div>
    )
}