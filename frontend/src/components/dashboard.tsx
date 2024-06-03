import React from "react";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CreateNoteForm from "./createNote";

interface Note {
  id: number;
  title: string;
  content: string;
}

function Dashboard() {
  const [notes, setNotes] = useState<Note[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/notes", {
        withCredentials: true,
      });
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/logout",
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response);
      navigate("/");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (notes == null) {
    return <div> no notes</div>;
  }

  return (
    <div>
      <div className="container flex items-center mt-8">
        <CreateNoteForm />
        <div className="container w-[500px] mt-4">
          <div className="bg-gray-100 p-4 rounded-md">
            {notes.length === 0 ? (
              <div className="text-gray-600">No notes</div>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="mb-4 p-4 bg-white rounded-md shadow-md">
                  <h2 className="text-lg font-semibold mb-2">{note.title}</h2>
                  <p className="text-gray-700">{note.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center m-10">
        <button
          onClick={handleLogout}
          className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:bg-red-600 transition duration-300 ease-in-out transform hover:scale-105">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
