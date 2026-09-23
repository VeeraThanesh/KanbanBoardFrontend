import "./App.css";
import { BrowserRouter } from "react-router-dom";
import Routing from "./Routing/routing";
import CommonSnackbar from "./Components/CommonSnackbar/CommonSnackbar";

function App() {
  return (
    <BrowserRouter>
      <CommonSnackbar />
      <Routing />
    </BrowserRouter>
  );
}

export default App;
