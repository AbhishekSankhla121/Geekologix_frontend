import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./components/Navbar.";
import toast, { Toaster } from 'react-hot-toast';
export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");

  useEffect(() => {
    getData();
  }, []);

  // Function to fetch tasks from the server
  const getData = async () => {
    try {
      const response = await axios.get("/api/v1/task");

      setTasks(response.data.tasks);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error(error)
    }
  };


  const addTask = async (e) => {
    e.preventDefault();
    if (!title) return toast.error("Task Cannot be empty!");

    try {
      const res = await axios.post("/api/v1/task", { title, completed: false }, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success(res.data.message)
      setTitle("");
      getData();
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };


  const deleteTask = async (id) => {
    try {
      const res = await axios.delete(`/api/v1/task/${id}`);
      toast.success(res.data.message)
      getData();
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };


  const updateTask = async (id, completed) => {
    try {
      await axios.put(`/api/v1/task/${id}`, { completed: !completed });
      getData();
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  return (
    <>
      <Navbar />
      <Toaster />
      <div className="container mt-4">
        <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">To-Do App</span>
        </nav>

        {/* Task Form */}
        <form onSubmit={addTask} className="mb-4">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Add new task"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Add Task
            </button>
          </div>
        </form>

        {/* Task List */}
        <div>
          {tasks && tasks.length > 0 ? (
            tasks.map((task) => (
              <div className="card mb-2" key={task.id}>
                <div className="card-body d-flex justify-content-between align-items-center">
                  <div>
                    <h5 className={`card-title ${task.completed ? "text-decoration-line-through" : ""}`}>
                      {task.title}
                    </h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {task.completed ? "Completed" : "Pending"}
                    </h6>
                  </div>
                  <div>
                    <button
                      onClick={() => updateTask(task.id, task.completed)}
                      className="btn btn-secondary btn-sm me-2"
                    >
                      {task.completed ? "Undo" : "Complete"}
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="btn btn-danger btn-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>No tasks available.</p>
          )}
        </div>
      </div>
    </>

  );
}
