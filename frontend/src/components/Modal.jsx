import React from 'react';

// Kullanıcıdan önemli bir eylem için onay almayı sağlıom
const Modal = ({ acikMi, baslik = 'Emin misiniz?', icerik, onOnay, onIptal }) => {
  if (!acikMi) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-kutu">
        <h3>{baslik}</h3>
        <p>{icerik}</p>
        <div className="modal-butonlar">
          <button onClick={onIptal} className="btn-ikincil">
            İptal
          </button>
          <button 
            onClick={onOnay} 
            className="btn-ana" 
            style={{ backgroundColor: 'var(--renk-hata)' }}
          >
            Evet, Sil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
