import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Messages from "./pages/Messages";
import AdminInbox from "./pages/AdminInbox";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Bounties from "./pages/Bounties";
import Submissions from "./pages/Submissions";
import { GoogleOAuthProvider } from "@react-oauth/google";
import AdminDashboard from "./pages/AdminDashboard";
import ErrorPage from "./pages/ErrorPage";
import MySubmissions from "./pages/MySubmissions";
import MyBounties from "./pages/MyBounties";
import Bounty from "./pages/Bounty";
import AdminBounty from "./pages/AdminBounty";
import Submission from "./pages/Submission";
import AdminSubmission from "./pages/AdminSubmission";
import Companies from "./pages/Companies";
import CreateCompany from "./pages/CreateCompany";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_OAUTH_ID;

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/home" element={<Dashboard />} />
            <Route path="/notifications" element={<Messages />} />
            <Route path="/submissions" element={<MySubmissions />} />
            <Route path="/bounties" element={<MyBounties />} />
            <Route path="/bounties/:id" element={<Bounty />} />
            <Route path="/submissions/:id" element={<Submission />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/inbox" element={<AdminInbox />} />
            <Route path="/admin/bounties" element={<Bounties />} />
            <Route path="/admin/companies" element={<Companies />} />
            <Route path="/admin/bounties/:id" element={<AdminBounty />} />
            <Route path="/admin/submissions" element={<Submissions />} />
            <Route path="/admin/create-company" element={<CreateCompany />} />
            <Route
              path="/admin/submissions/:id"
              element={<AdminSubmission />}
            />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
