import React, { useState, useEffect } from 'react';
import ReservationCard from '../components/ReservationCard';

const ReservationsList = () => {
  const [reservations, setReservations] = useState([]);
  const [filteredReservations, setFilteredReservations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchReservations();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [reservations, searchTerm, startDate, endDate, cityFilter]);

  const fetchReservations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reservations`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setReservations(data);
      setFilteredReservations(data); // Inicialmente, todas as reservas são filtradas
    } catch (err) {
      console.error("Erro ao buscar reservas:", err);
      setError("Não foi possível carregar as reservas. Tente novamente mais tarde.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let tempReservations = [...reservations];

    // Filter by search term (apartment title, contact name, channel, city, state)
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      tempReservations = tempReservations.filter(res =>
        res.apartment_title.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.contact_name.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.channel.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.apartment_city.toLowerCase().includes(lowerCaseSearchTerm) ||
        res.apartment_state.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    // Filter by date range (using checkin_date)
    if (startDate && endDate) {
      tempReservations = tempReservations.filter(res => {
        const checkin = new Date(res.checkin_date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return checkin >= start && checkin <= end;
      });
    } else if (startDate) {
        tempReservations = tempReservations.filter(res => {
            const checkin = new Date(res.checkin_date);
            const start = new Date(startDate);
            return checkin >= start;
        });
    } else if (endDate) {
        tempReservations = tempReservations.filter(res => {
            const checkin = new Date(res.checkin_date);
            const end = new Date(endDate);
            return checkin <= end;
        });
    }


    // Filter by city
    if (cityFilter) {
      const lowerCaseCityFilter = cityFilter.toLowerCase();
      tempReservations = tempReservations.filter(res =>
        res.apartment_city.toLowerCase().includes(lowerCaseCityFilter)
      );
    }

    tempReservations.sort((a, b) => a.id - b.id);
    setFilteredReservations(tempReservations);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStartDate('');
    setEndDate('');
    setCityFilter('');
    setFilteredReservations(reservations); // Reset to all original reservations
  };

  if (loading) {
    return <p className="text-center text-lg mt-8 text-gray-600">Carregando reservas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-8">{error}</p>;
  }

  return (
    <div className="p-4 container">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Lista de Reservas</h1>

      <div className="card mb-8">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Filtrar Reservas</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="form-group">
            <label htmlFor="searchTerm" className="form-label">Buscar (Título, Contato, Canal, Cidade, Estado):</label>
            <input
              type="text"
              id="searchTerm"
              className="form-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Ex: Apartamento, João, airbnb, Curitiba"
            />
          </div>
          <div className="form-group">
            <label htmlFor="startDate" className="form-label">Data Check-in (Início):</label>
            <input
              type="date"
              id="startDate"
              className="form-input"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="endDate" className="form-label">Data Check-in (Fim):</label>
            <input
              type="date"
              id="endDate"
              className="form-input"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
                <label htmlFor="cityFilter" className="form-label">Filtrar por Cidade:</label>
                <input
                    type="text"
                    id="cityFilter"
                    className="form-input"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    placeholder="Ex: Curitiba"
                />
            </div>
            <div className="form-group flex items-end"> {/* Use flexbox to align button at the bottom */}
                <button
                    onClick={handleClearFilters}
                    className="btn btn-filter w-full md:w-auto mt-auto" // mt-auto for alignment
                >
                    Limpar Filtros
                </button>
            </div>
        </div>
      </div>

      {filteredReservations.length === 0 && !loading && !error ? (
        <p className="text-center text-gray-600 text-lg">Nenhuma reserva encontrada com os filtros aplicados.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReservations.map(reservation => (
            <ReservationCard key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ReservationsList;