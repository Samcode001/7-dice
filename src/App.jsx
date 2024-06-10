import GamePage from "./pages/GamePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/Signup";
import Login from "./pages/Login";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<GamePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignIn />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
