import "./App.css";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  BrowserRouter,
} from "react-router-dom";
import Routing from "./Routing/routing";

function Home() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000").then((res) => {
      console.log(res);
      setData(res.data);
    });
  }, []);

  return (
    <div>
      <h1>Welcome to Kanban Board</h1>
      <p>{JSON.stringify(data)}</p>
    </div>
  );
}

function About() {
  return <h2>This is the About Page</h2>;
}

function Tasks() {
  return <h2>Task list will go here</h2>;
}

function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <nav>
    //       <Link to="/">Home</Link> | <Link to="/about">About</Link> |{" "}
    //       <Link to="/tasks">Tasks</Link>
    //     </nav>

    //     <Routes>
    //       <Route path="/" element={<Home />} />
    //       <Route path="/about" element={<About />} />
    //       <Route path="/tasks" element={<Tasks />} />
    //     </Routes>
    //   </div>
    // </Router>
    <BrowserRouter>
      <Routing />
    </BrowserRouter>
  );
}

export default App;
