import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { FiPlus, FiUser, FiX, FiLogOut } from 'react-icons/fi'; // Added Logout Icon
import Library from './components/Library';

import './App.css'; 

function App() {
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    // 1. App load hote hi check karein ki user pehle se login hai ya nahi
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // 2. Auth state changes ko live monitor karein (Login/Logout)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      // Agar login ho jaye toh modal band kar do
      if (session) setShowAuthModal(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.error('Error logging out:', error.message);
  };

  const handlePlusClick = () => {
    if (!session) {
      setShowAuthModal(true);
      alert("Please sign in to upload your novel.");
    } else {
       // Future: Yahan hum upload modal open karenge
       alert("Ready to upload your novel!");
    }
  };

  return (
    <div className="app-container">
      {/* --- Navigation Bar --- */}
      <nav className="navbar">
        <button className="nav-icon-btn left" onClick={handlePlusClick} title="Upload Book">
          <FiPlus size={24} color="var(--theme-dark-grey)"/>
        </button>
        
        <div className="nav-right-group">
          {!session ? (
             <button className="nav-btn" onClick={() => setShowAuthModal(true)}>
               Sign In / Sign Up
             </button>
          ) : (
             <>
               <button className="nav-icon-btn" onClick={handleLogout} title="Logout">
                  <FiLogOut size={22} color="var(--theme-dark-grey)"/>
               </button>
               <button className="nav-icon-btn" title="My Profile">
                  <FiUser size={24} color="var(--theme-dark-grey)"/>
               </button>
             </>
          )}
        </div>
      </nav>

      {/* --- Main 3-Column Layout --- */}
      <main className="main-layout">
       
        
        
        {/* Column 2: Center Content (Hero Section) */}
        <section className="center-content">
  {!session ? (
    /* Logged Out View (Puraana wala) */
    <div className="hero-text-box">
      <h1>Welcome to the 3D Flip Book Reader</h1>
      <p>Get started with uploading the book and reading them in the most interactive way.</p>
      <button className="cta-button" onClick={() => setShowAuthModal(true)}>
        Start Reading Now
      </button>
    </div>
  ) : (
    /* Logged In View (Naya Library Component) */
    <Library session={session} />
  )}
</section>
        
       
        
      </main>

      {/* --- Auth Modal (Supabase UI) --- */}
      {showAuthModal && !session && (
        <div className="auth-modal-overlay">
          <div className="auth-modal-content">
            <button className="close-modal" onClick={() => setShowAuthModal(false)}>
              <FiX size={20}/>
            </button>
            
             <Auth
                supabaseClient={supabase}
                appearance={{ 
                  theme: ThemeSupa,
                  variables: {
                    default: {
                      colors: {
                        brand: '#333336',
                        brandAccent: '#66666e',
                      }
                    }
                  }
                }}
                providers={['google']}
                theme="light"
             />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;