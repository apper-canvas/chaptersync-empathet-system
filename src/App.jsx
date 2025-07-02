import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import Layout from '@/components/organisms/Layout'
import CurrentRead from '@/components/pages/CurrentRead'
import Discussions from '@/components/pages/Discussions'
import Schedule from '@/components/pages/Schedule'
import Voting from '@/components/pages/Voting'
import Members from '@/components/pages/Members'

function App() {
  return (
    <div className="min-h-screen bg-background font-body">
      <Layout>
        <Routes>
          <Route path="/" element={<CurrentRead />} />
          <Route path="/current-read" element={<CurrentRead />} />
          <Route path="/discussions" element={<Discussions />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/voting" element={<Voting />} />
          <Route path="/members" element={<Members />} />
        </Routes>
      </Layout>
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  )
}

export default App