import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import AdminInbox from "./pages/AdminInbox";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bounties from "./pages/Bounties";

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/home" element={<Dashboard />} />
          <Route path="/inbox" element={<Messages />} />
          <Route path="/admin/inbox" element={<AdminInbox />} />
          <Route path="/admin/bounties" element={<Bounties />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
