import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  useEffect(() => {
    fetchMetrics();
  }, []);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/reservations/metrics`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setMetrics(data);
    } catch (err) {
      console.error("Erro ao buscar métricas:", err);
      setError("Não foi possível carregar as métricas do dashboard.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <p className="text-center text-lg mt-8 text-gray-600">Carregando métricas...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 text-lg mt-8">{error}</p>;
  }

  return (
    <div className="p-4 container">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Dashboard de Reservas</h1>

      {metrics ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="card text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Total de Reservas</h2>
              <p className="text-5xl font-bold text-blue-600">{metrics.totalReservations}</p>
            </div>
            <div className="card text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Valor Total das Reservas</h2>
              <p className="text-5xl font-bold text-blue-600">R$ {metrics.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="card text-center">
              <h2 className="text-xl font-bold mb-2 text-gray-800">Média de Hóspedes/Reserva</h2>
              <p className="text-5xl font-bold text-blue-600">{metrics.averageGuestsPerReservation.toFixed(1)}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Reservas por Canal</h2>
              <ul className="list-disc list-inside">
                {Object.entries(metrics.reservationsByChannel).map(([channel, count]) => (
                  <li key={channel} className="text-gray-700">
                    <span className="capitalize">{channel}</span>: {count}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Reservas por Apartamento</h2>
              <ul className="list-disc list-inside">
                {Object.entries(metrics.reservationsByApartment).map(([apartmentTitle, count]) => (
                  <li key={apartmentTitle} className="text-gray-700">
                    {apartmentTitle}: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="card mt-8">
            <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Principais Contatos (Reservas)</h2>
            <ul className="list-disc list-inside">
              {metrics.topContacts.map(contact => (
                <li key={contact.contact_id} className="text-gray-700">
                  {contact.contact_name} ({contact.contact_email}) - {contact.reservation_count} reserva(s)
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <p className="text-center text-gray-600 text-lg">Nenhuma métrica disponível.</p>
      )}
    </div>
  );
};

export default Dashboard;