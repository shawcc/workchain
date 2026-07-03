import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AppShell } from "@/components/AppShell";
import Actions from "@/pages/Actions";
import ContextWorkspace from "@/pages/ContextWorkspace";
import Decisions from "@/pages/Decisions";
import FocusedWork from "@/pages/FocusedWork";
import GoalEntry from "@/pages/GoalEntry";
import GraphView from "@/pages/GraphView";
import KnowledgeBase from "@/pages/KnowledgeBase";
import SubGoals from "@/pages/SubGoals";
import Understanding from "@/pages/Understanding";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<ContextWorkspace />} />
          <Route path="/focused" element={<FocusedWork />} />
          <Route path="/decisions" element={<Decisions />} />
          <Route path="/knowledge" element={<KnowledgeBase />} />
          <Route path="/new" element={<GoalEntry />} />
          <Route path="/understanding" element={<Understanding />} />
          <Route path="/sub-goals" element={<SubGoals />} />
          <Route path="/graph" element={<GraphView />} />
          <Route path="/actions" element={<Actions />} />
        </Route>
      </Routes>
    </Router>
  );
}
