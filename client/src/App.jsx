import { BrowserRouter as Router, Routes } from "react-router-dom";
import Landingroutes from "./Landingroutes";
import UserRoutes from "./UserRoutes";
import UserLoginRoutes from "./UserLoginRoutes";
import AdminRoutes from "./AdminRoutes";
import AdminLoginRoutes from "./AdminLoginRoutes";

function App() {
  return (
    <Router>
      <Routes>
        {Landingroutes()}
        {UserLoginRoutes()}
        {UserRoutes()}
        {AdminRoutes()}
        {AdminLoginRoutes()}
      </Routes>
    </Router>
  );
}

export default App;
