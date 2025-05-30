import React from 'react';

const ReservationCard = ({ reservation }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-4 border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-2">
        Reserva #{reservation.id} - {reservation.apartment_title} ({reservation.apartment_city}, {reservation.apartment_state})
      </h3>
      <p className="text-gray-700">
        <span className="font-medium">Hóspede:</span> {reservation.contact_name} ({reservation.contact_email})
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Período:</span> {new Date(reservation.checkin_date).toLocaleDateString()} - {new Date(reservation.checkout_date).toLocaleDateString()}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Hóspedes:</span> {reservation.guests}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Valor Total:</span> R$ {reservation.total_price ? reservation.total_price.toFixed(2) : 'N/A'}
      </p>
      <p className="text-gray-700">
        <span className="font-medium">Canal:</span> <span className="capitalize">{reservation.channel}</span>
      </p>
    </div>
  );
};

export default ReservationCard;