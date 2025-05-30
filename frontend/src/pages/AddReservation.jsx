import React, { useState, useEffect } from 'react';

const AddReservation = () => {
  const [apartmentId, setApartmentId] = useState('');
  const [contactId, setContactId] = useState('');
  const [checkinDate, setCheckinDate] = useState('');
  const [checkoutDate, setCheckoutDate] = useState('');
  const [guests, setGuests] = useState('');
  const [channel, setChannel] = useState('');

  // Estados para adicionar um novo contato
  const [newContactName, setNewContactName] = useState('');
  const [newContactEmail, setNewContactEmail] = useState('');
  const [newContactPhone, setNewContactPhone] = useState('');
  const [creatingNewContact, setCreatingNewContact] = useState(false); // Alterna entre selecionar existente ou criar novo

  const [apartments, setApartments] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const [error, setError] = useState(null); // Estado de erro para fetches iniciais

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        await fetchApartments();
        await fetchContacts();
      } catch (err) {
        setError("Erro ao carregar dados iniciais: " + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchApartments = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/apartments`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setApartments(data);
    } catch (err) {
      console.error("Erro ao buscar apartamentos:", err);
      throw err; // Propaga o erro para o fetchData
    }
  };

  const fetchContacts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/contacts`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setContacts(data);
    } catch (err) {
      console.error("Erro ao buscar contatos:", err);
      throw err; // Propaga o erro para o fetchData
    }
  };

  const handleCreateNewContact = async () => {
    setMessage('');
    setMessageType('');
    if (!newContactName || !newContactEmail) {
      setMessage("Nome e email são obrigatórios para o novo contato.");
      setMessageType("error");
      return null;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newContactName, email: newContactEmail, phone: newContactPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      await fetchContacts(); // Atualiza a lista de contatos para incluir o novo
      setContactId(data.id.toString()); // Seleciona o novo contato no select
      setCreatingNewContact(false); // Volta para a visualização de seleção
      setMessage("Novo contato criado e selecionado com sucesso!");
      setMessageType("success");
      setNewContactName(''); // Limpa campos do novo contato
      setNewContactEmail('');
      setNewContactPhone('');
      return data.id; // Retorna o ID do novo contato
    } catch (err) {
      console.error("Erro ao criar novo contato:", err);
      setMessage(`Erro ao criar novo contato: ${err.message}`);
      setMessageType('error');
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    let finalContactId = contactId;

    if (creatingNewContact) {
      finalContactId = await handleCreateNewContact();
      if (!finalContactId) {
        return; // Parar se a criação do novo contato falhou
      }
    }

    // Validação básica para a reserva
    if (!apartmentId || !finalContactId || !checkinDate || !checkoutDate || !guests || !channel) {
      setMessage("Por favor, preencha todos os campos obrigatórios da reserva.");
      setMessageType("error");
      return;
    }

    // Validação de datas
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    if (checkin >= checkout) {
        setMessage("A data de check-in deve ser anterior à data de check-out.");
        setMessageType("error");
        return;
    }

    const newReservation = {
      apartment_id: parseInt(apartmentId),
      contact_id: parseInt(finalContactId),
      checkin_date: checkinDate,
      checkout_date: checkoutDate,
      guests: parseInt(guests),
      channel: channel,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reservations`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newReservation),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }

      setMessage('Reserva criada com sucesso!');
      setMessageType('success');
      // Limpar campos do formulário
      setApartmentId('');
      setContactId('');
      setCheckinDate('');
      setCheckoutDate('');
      setGuests('');
      setChannel('');
      setNewContactName('');
      setNewContactEmail('');
      setNewContactPhone('');

    } catch (err) {
      console.error("Erro ao criar reserva:", err);
      setMessage(`Erro ao criar reserva: ${err.message}`);
      setMessageType('error');
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Carregando formulário...</div>;
  }

  if (error) {
    return <div className="p-4 bg-red-100 text-red-700 rounded text-center mt-8">{error}</div>;
  }

  return (
    <div className="container">
      <div className="page-title-section">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Criar Nova Reserva</h1>
      </div>

      <div className="p-4 mx-auto card">
        {message && (
          <div className={`p-3 mb-4 rounded ${messageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label htmlFor="apartment" className="form-label">Apartamento:</label>
            <select
              id="apartment"
              className="form-select"
              value={apartmentId}
              onChange={(e) => setApartmentId(e.target.value)}
              required
            >
              <option value="">Selecione um apartamento</option>
              {apartments.map(apt => (
                <option key={apt.id} value={apt.id}>
                  {apt.title} ({apt.city}, {apt.state}) - R${apt.daily_rate ? apt.daily_rate.toFixed(2) : 'N/A'}/noite
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="contact" className="form-label">Contato:</label>
            {creatingNewContact ? (
              <div className="space-y-2">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Nome do Novo Contato"
                  value={newContactName}
                  onChange={(e) => setNewContactName(e.target.value)}
                  required={creatingNewContact}
                />
                <input
                  type="email"
                  className="form-input"
                  placeholder="Email do Novo Contato"
                  value={newContactEmail}
                  onChange={(e) => setNewContactEmail(e.target.value)}
                  required={creatingNewContact}
                />
                <input
                  type="text"
                  className="form-input"
                  placeholder="Telefone do Novo Contato (Opcional)"
                  value={newContactPhone}
                  onChange={(e) => setNewContactPhone(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => {
                      setCreatingNewContact(false);
                      setMessage('');
                      setContactId('');
                      setNewContactName(''); // Limpar ao cancelar
                      setNewContactEmail('');
                      setNewContactPhone('');
                  }}
                  className="btn btn-secondary w-full"
                >
                  Selecionar Contato Existente
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                  <select
                      id="contact"
                      className="form-select"
                      value={contactId}
                      onChange={(e) => setContactId(e.target.value)}
                      required={!creatingNewContact}
                  >
                      <option value="">Selecione um contato</option>
                      {contacts.map(contact => (
                      <option key={contact.id} value={contact.id}>
                          {contact.name} ({contact.email})
                      </option>
                      ))}
                  </select>
                  <button
                      type="button"
                      onClick={() => {
                          setCreatingNewContact(true);
                          setContactId('');
                          setMessage('');
                      }}
                      className="btn btn-secondary w-full"
                  >
                      Adicionar Novo Contato
                  </button>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="checkin_date" className="form-label">Data de Check-in:</label>
            <input
              type="date"
              id="checkin_date"
              className="form-input"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="checkout_date" className="form-label">Data de Check-out:</label>
            <input
              type="date"
              id="checkout_date"
              className="form-input"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="guests" className="form-label">Número de Hóspedes:</label>
            <input
              type="number"
              id="guests"
              className="form-input"
              value={guests}
              onChange={(e) => setGuests(e.target.value)}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="channel" className="form-label">Canal:</label>
            <select
              id="channel"
              className="form-select"
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
              required
            >
              <option value="">Selecione o canal</option>
              <option value="airbnb">Airbnb</option>
              <option value="booking.com">Booking.com</option>
              <option value="direto">Direto</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary w-full">
            {creatingNewContact ? 'Criar Contato e Reserva' : 'Criar Reserva'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReservation;