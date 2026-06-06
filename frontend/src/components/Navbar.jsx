import React, { useContext } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { OturumBaglami } from '../context/OturumBaglami';
import { ChefHat, PlusCircle, User, LogOut, LogIn, UserPlus } from 'lucide-react';

const Navbar = () => {
  const { kullanici, cikis } = useContext(OturumBaglami);
  const navigate = useNavigate();

  const cikisYapHandler = () => {
    cikis();
    navigate('/giris');
  };

  return (
    <header className="navbar">
      <div className="nav-konteyner">
        {/* Logo Alanı */}
        <Link to="/" className="nav-logo">
          <ChefHat size={28} />
          tarifim<span>.</span>
        </Link>

        {/* Menü Linkleri */}
        <nav className="nav-menuler">
          <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link aktif' : 'nav-link'} end>
            Tarifler
          </NavLink>

          {/* Giriş Yapmış Kullanıcı Menüsü */}
          {kullanici ? (
            <div className="nav-kullanici">
              <NavLink to="/tarif-ekle" className={({ isActive }) => isActive ? 'nav-link aktif' : 'nav-link'}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <PlusCircle size={18} /> Tarif Ekle
                </span>
              </NavLink>
              
              <NavLink to="/profil" className={({ isActive }) => isActive ? 'nav-link aktif' : 'nav-link'}>
                <span className="nav-kullanici-bilgi">
                  <img src={kullanici.profilResmi} alt={kullanici.isim} className="nav-avatar" />
                  {kullanici.isim}
                </span>
              </NavLink>

              <button onClick={cikisYapHandler} className="btn-cikis" title="Çıkış Yap">
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            // Giriş Yapmamış Kullanıcı Menüsü
            <div className="nav-kullanici">
              <NavLink to="/giris" className={({ isActive }) => isActive ? 'nav-link aktif' : 'nav-link'}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <LogIn size={18} /> Giriş Yap
                </span>
              </NavLink>
              <NavLink to="/kayit" className={({ isActive }) => isActive ? 'nav-link aktif' : 'nav-link'}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <UserPlus size={18} /> Kayıt Ol
                </span>
              </NavLink>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
