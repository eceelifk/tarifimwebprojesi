import React from 'react';

const YuklenmeBelirteci = ({ mesaj = 'Yükleniyor...' }) => {
  return (
    <div className="yukleniyor-kapsayici">
      <div className="spinner"></div>
      <p style={{ fontWeight: 500, color: 'var(--renk-yazi-ikincil)' }}>{mesaj}</p>
    </div>
  );
};

export default YuklenmeBelirteci;
