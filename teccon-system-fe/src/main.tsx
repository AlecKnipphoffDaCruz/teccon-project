import "./utils/AxiosConfig";
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './components/pages/LoginPage';
import DashBoard from './components/pages/DashBoardPage';
import { Routes, Route, BrowserRouter } from "react-router-dom";
import AnalisePage from './components/pages/AnalisePage';
import ColetaPage from './components/pages/CollectionPage';
import './index.css'
import WorkPage from './components/pages/WorkPage';
import CriarClientePage from "./components/pages/ClientCreatePage";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashBoard />} />
        <Route path="/analise" element={<AnalisePage />} />
        <Route path="/analise/:id" element={<AnalisePage />} />
        <Route path="/coleta" element={<ColetaPage />} />
        <Route path="/obras" element={<WorkPage />} />
        <Route path="/clientes" element={<CriarClientePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)