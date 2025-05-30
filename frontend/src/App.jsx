import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ReservationsList from './pages/ReservationsList';
import AddReservation from './pages/AddReservation';
import Dashboard from './pages/Dashboard';
import Footer from './components/Footer'; // Importe o componente Footer

function App() {
  return (
    <Router>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<ReservationsList />} />
          <Route path="/nova-reserva" element={<AddReservation />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Adicione outras rotas aqui se tiver mais páginas */}
        </Routes>
      </div>
      <Footer /> {/* Adicione o Footer aqui */}
    </Router>
  );
}

export default App;