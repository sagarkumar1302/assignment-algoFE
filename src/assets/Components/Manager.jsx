import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";

const host = "https://assignment-algobe-production.up.railway.app";

const Manager = () => {
  const [form, setForm] = useState({ title: "", description: "", completed: false });
  const [tasks, setTasks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [idDel, setIdDel] = useState(null);
  const [editId, setEditId] = useState(null);

  const fetchTasks = async () => {
    try {
      const { data } = await axios.get(`${host}/api/user/`);
      setTasks(data);
    } catch {
      toast.error("Error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const saveTask = async () => {
    if (!form.title.trim() || !form.description.trim()) {
      toast.warn("Please fill all the fields");
      return;
    }

    try {
      if (editId) {
        await axios.put(`${host}/api/user/update/${editId}`, form);
        toast.success("Task updated successfully!");
      } else {
        await axios.post(`${host}/api/user/register`, form);
        toast.success("Task saved successfully!");
      }
      fetchTasks();
      setForm({ title: "", description: "", completed: false });
      setEditId(null);
    } catch {
      toast.error("Failed to save task!");
    }
  };

  const toggleCompletion = async (id) => {
    const task = tasks.find((t) => t._id === id);
    if (!task) return;

    try {
      await axios.put(`${host}/api/user/update/${id}`, {
        ...task,
        completed: !task.completed,
      });
      if(!task.completed){
        toast.success("Task marked as completed!");
      } else {
        toast.success("Task marked as incomplete!");
      }
      fetchTasks();
    } catch {
      toast.error("Failed to update task status!");
    }
  };

  const deleteHandler = async () => {
    try {
      await axios.delete(`${host}/api/user/delete/${idDel}`);
      fetchTasks();
      setIsModalOpen(false);
      toast.success("Task deleted successfully!");
    } catch {
      toast.error("Error deleting task");
    }
  };

  const editHandler = (id) => {
    const task = tasks.find((t) => t._id === id);
    if (task) {
      setForm({ title: task.title, description: task.description, completed: task.completed });
      setEditId(id);
    }
  };

  const handleDelete = (id) => {
    setIdDel(id);
    setIsModalOpen(true);
  };

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white rounded-lg shadow-lg">
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />
      <h1 className="text-4xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 animate-pulse">
        <span className="text-green-400">&lt;</span>Task Manager
        <span className="text-green-400">/&gt;</span>
      </h1>
      <div className="flex flex-col gap-6">
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          placeholder="Enter Task Title"
          className="p-3 rounded-lg border border-green-500 text-black focus:ring-2 focus:ring-green-400 transition-all"
        />
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          placeholder="Enter Task Description"
          className="p-3 rounded-lg border border-green-500 text-black focus:ring-2 focus:ring-green-400 transition-all"
        />
        <button
          onClick={saveTask}
          className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-black font-bold py-2 px-4 rounded-lg shadow-lg transform hover:scale-105 transition-all"
        >
          {editId ? "Update Task" : "Add Task"}
        </button>
        {tasks.length === 0 ? (
          <div className="text-center text-xl mt-4 animate-bounce">No Tasks Available</div>
        ) : (
          <div className="overflow-x-auto md:overflow-hidden">
            <table className="w-full bg-gray-700 rounded-lg shadow-lg">
              <thead className="bg-gradient-to-r from-green-500 to-blue-500 text-white">
                <tr>
                  <th className="py-3 px-4 text-left">Title</th>
                  <th className="py-3 px-4 text-left">Description</th>
                  <th className="py-3 px-4 text-center">Completed</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task) => (
                  <tr
                    key={task._id}
                    className="border-b border-gray-600 hover:bg-gray-600 transition-all"
                  >
                    <td
                      className={`py-3 px-4 ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </td>
                    <td
                      className={`py-3 px-4 ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.description}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleCompletion(task._id)}
                        className="transform scale-125"
                      />
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => editHandler(task._id)}
                        className="text-blue-400 hover:underline mr-4"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task._id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={deleteHandler}
        message="Are you sure you want to delete this task?"
      />
    </div>
  );
};

export default Manager;