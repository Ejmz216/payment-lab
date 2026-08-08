import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/routes/Dashboard'
import { FastPaymentsHome } from '@/routes/learn/FastPaymentsHome'
import { LessonPage } from '@/routes/learn/LessonPage'
import { AtlasHome } from '@/routes/atlas/AtlasHome'
import { MessageCatalog } from '@/routes/atlas/MessageCatalog'
import { MessagePage } from '@/routes/atlas/MessagePage'
import { LabHome } from '@/routes/lab/LabHome'
import { Simulator } from '@/routes/lab/Simulator'
import { Debugger } from '@/routes/lab/Debugger'
import { IdentifierLab } from '@/routes/lab/IdentifierLab'
import { RejectVsReturn } from '@/routes/lab/RejectVsReturn'
import { PracticeHome } from '@/routes/practice/PracticeHome'
import { ScenarioTrainer } from '@/routes/practice/ScenarioTrainer'
import { Quiz } from '@/routes/practice/Quiz'
import { Glossary } from '@/routes/Glossary'
import { Confusions } from '@/routes/Confusions'
import { Progress } from '@/routes/Progress'
import { NotFound } from '@/routes/NotFound'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/learn/fast-payments" element={<FastPaymentsHome />} />
        <Route path="/learn/fast-payments/:lessonId" element={<LessonPage />} />

        <Route path="/atlas" element={<AtlasHome />} />
        <Route path="/atlas/messages" element={<MessageCatalog />} />
        <Route path="/atlas/messages/:messageId" element={<MessagePage />} />

        <Route path="/lab" element={<LabHome />} />
        <Route path="/lab/simulator" element={<Simulator />} />
        <Route path="/lab/debugger" element={<Debugger />} />
        <Route path="/lab/identifiers" element={<IdentifierLab />} />
        <Route path="/lab/reject-return" element={<RejectVsReturn />} />

        <Route path="/practice" element={<PracticeHome />} />
        <Route path="/practice/scenarios" element={<ScenarioTrainer />} />
        <Route path="/practice/quiz" element={<Quiz />} />

        <Route path="/glossary" element={<Glossary />} />
        <Route path="/confusions" element={<Confusions />} />
        <Route path="/progress" element={<Progress />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
