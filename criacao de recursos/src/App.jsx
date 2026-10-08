import './App.css';
import './index.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import LessonBuilder from './pages/Builder/LessonBuilder';

function App() {
  return (
    <div className="absolute top-0 left-0 p-4 pt-[50px] w-full">
      <Routes>
        {/* ROTA PRINCIPAL: Construtor de Aulas — foco único desta branch */}
        <Route path="/" element={<LessonBuilder />} />
        <Route path="/construtor" element={<LessonBuilder />} />

        {/* Rota Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
