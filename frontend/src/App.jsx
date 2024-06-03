import { useState } from "react";
import "./App.css";

import Dashboard from "./components/dashboard";
import Login from "./components/dashboard";

function App() {
  const [user, setUser] = useState({ auth: false, name: "" });
  return (
    <div className="App">
      <h1>Hello Devteams bg</h1>
      {user.auth ? <Dashboard user={user} setUser={setUser} /> : <Login />}
    </div>
  );
}

export default App;
