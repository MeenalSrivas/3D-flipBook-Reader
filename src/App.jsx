import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { FiPlus, FiUser, FiX, FiLogOut } from 'react-icons/fi'; // Added Logout Icon
import Library from './components/Library';
import NavbarWrapper from './components/NabarWrapper';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'; 
import BookReader from './components/BookReader';

function App() {
  const [session, setSession] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null)
  
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
    <Router>
    <div className="app-container">
      {/* --- Navigation Bar --- */}
      <NavbarWrapper 
          session={session} 
          handleLogout={handleLogout} 
          
        />  

      {/* --- Main 3-Column Layout --- */}
      <main className="main-layout">
        <Routes>
          <Route 
          path='/'
          element={<section className="center-content">
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
    <Library session={session} onSelectBook={(book) => setSelectedBook(book)} />
  )}
</section>}
          
          />

          <Route path="/reader/:bookId" element={<BookReader book={selectedBook} onback={()=> Navigate('/')} />} />
        </Routes>
        
        
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
    </Router>
  );
}

export default App;