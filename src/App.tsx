import { lazy, Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { Dashboard } from '@/routes/Dashboard'
import { FastPaymentsHome } from '@/routes/learn/FastPaymentsHome'
import { LessonPage } from '@/routes/learn/LessonPage'
import { SpiDominicanaStudy } from '@/routes/learn/SpiDominicanaStudy'
import { AtlasHome } from '@/routes/atlas/AtlasHome'
import { DomainOverview } from '@/routes/atlas/DomainOverview'
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
import { PracticeSession } from '@/routes/practice/PracticeSession'
import { Glossary } from '@/routes/Glossary'
import { Confusions } from '@/routes/Confusions'
import { Progress } from '@/routes/Progress'
import { Saved } from '@/routes/Saved'
import { NotFound } from '@/routes/NotFound'

// Monaco-backed labs are code-split and only fetched when visited, so the
// heavy editor bundle never loads on the main path.
const XmlLab = lazy(() => import('@/routes/lab/XmlLab').then((m) => ({ default: m.XmlLab })))
const BreakMessage = lazy(() => import('@/routes/lab/BreakMessage').then((m) => ({ default: m.BreakMessage })))
const InfoExtra = lazy(() => import('@/routes/learn/InfoExtra').then((m) => ({ default: m.InfoExtra })))

function LazyFallback() {
  return <div className="py-24 text-center text-sm text-muted">Loading…</div>
}

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route path="/" element={<Dashboard />} />

        <Route path="/learn/fast-payments" element={<FastPaymentsHome />} />
        <Route path="/learn/fast-payments/:lessonId" element={<LessonPage />} />
        <Route path="/learn/spi-dominicana" element={<SpiDominicanaStudy />} />
        <Route path="/learn/info-extra" element={<Suspense fallback={<LazyFallback />}><InfoExtra /></Suspense>} />

        <Route path="/atlas" element={<AtlasHome />} />
        <Route path="/atlas/domains/:domainId" element={<DomainOverview />} />
        <Route path="/atlas/messages" element={<MessageCatalog />} />
        <Route path="/atlas/messages/:messageId" element={<MessagePage />} />

        <Route path="/lab" element={<LabHome />} />
        <Route path="/lab/simulator" element={<Simulator />} />
        <Route path="/lab/debugger" element={<Debugger />} />
        <Route path="/lab/identifiers" element={<IdentifierLab />} />
        <Route path="/lab/reject-return" element={<RejectVsReturn />} />
        <Route path="/lab/xml" element={<Suspense fallback={<LazyFallback />}><XmlLab /></Suspense>} />
        <Route path="/lab/break-message" element={<Suspense fallback={<LazyFallback />}><BreakMessage /></Suspense>} />

        <Route path="/practice" element={<PracticeHome />} />
        <Route path="/practice/scenarios" element={<ScenarioTrainer />} />
        <Route path="/practice/quiz" element={<Quiz />} />
        <Route path="/practice/session" element={<PracticeSession />} />

        <Route path="/glossary" element={<Glossary />} />
        <Route path="/confusions" element={<Confusions />} />
        <Route path="/progress" element={<Progress />} />
        <Route path="/saved" element={<Saved />} />

        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
