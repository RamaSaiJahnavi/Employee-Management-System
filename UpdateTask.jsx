import { useState,useEffect } from "react"
import { useParams,useNavigate } from "react-router-dom"

export default function UpdateTask(){

    const { id }=useParams()
    const nav=useNavigate()

    const [task,setTask]=useState({
        title:"",
        description:"",
        priority:"LOW"
    })

    useEffect(()=>{
        fetch(`http://localhost:8080/tasks/${id}`)
            .then(res=>res.json())
            .then(setTask)
    },[id])

    const change=e=>{
        setTask({...task,[e.target.name]:e.target.value})
    }

    const submit=e=>{
        e.preventDefault()

        fetch(`http://localhost:8080/tasks/${id}`,{
            method:"PUT",
            headers:{ "Content-Type":"application/json" },
            body:JSON.stringify(task)
        }).then(()=>nav(-1))
    }

    return(
        <div className="container">
            <h3>Update Task</h3>

            <form onSubmit={submit}>
                <input name="title"
                       value={task.title}
                       onChange={change}
                />

                <input name="description"
                       value={task.description}
                       onChange={change}
                />

                <select name="priority"
                        value={task.priority}
                        onChange={change}>
                    <option>LOW</option>
                    <option>MEDIUM</option>
                    <option>HIGH</option>
                </select>

                <button>Update</button>
            </form>
        </div>
    )
}