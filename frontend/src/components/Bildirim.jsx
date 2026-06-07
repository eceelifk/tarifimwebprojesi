import React, { useEffect } from 'react';

// Kullanıcya bilgi için açılan bildirim kutusu
const Bildirim = ({ mesaj, tip = 'basari', onClose }) => {
  useEffect(() => {
    if (mesaj) {
      // 3 sn sonra bildirimi kapat
      const zamanlayici = setTimeout(() => {
        onClose();
      }, 3000);

      // ekrandan giderse zamanlayıcıyı temizle
      return () => clearTimeout(zamanlayici);
    }
  }, [mesaj, onClose]);

  if (!mesaj) return null;

  return (
    <div className="toast-kapsayici">
      <div className={`toast ${tip}`}>
        {/* Bildirimin tipine göre başlık rengi ve ikonu değişir */}
        <span style={{ fontSize: '1.2rem' }}>
          {tip === 'basari' ? '✨' : tip === 'hata' ? '⚠️' : 'ℹ️'}
        </span>
        <span>{mesaj}</span>
      </div>
    </div>
  );
};

export default Bildirim;
