import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import AdminInbox from "./pages/AdminInbox";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/home" element={<Dashboard />} />
        <Route path="/inbox" element={<Messages />} />
        <Route path="/admin/inbox" element={<AdminInbox />} />
      </Routes>
    </Router>
  );
}

export default App;
