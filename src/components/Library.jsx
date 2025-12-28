import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FiUploadCloud, FiBookOpen } from 'react-icons/fi';

const Library = ({ session }) => {
  const [books, setBooks] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 1. Pehle se uploaded books fetch karna
  useEffect(() => {
    fetchBooks();
  }, [session]);

  const fetchBooks = async () => {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching books:', error);
    else setBooks(data);
  };

  // 2. Nayi PDF upload karne ka logic
  const handleUpload = async (event) => {
    try {
      setUploading(true);
      const file = event.target.files[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${session.user.id}/${fileName}`;

      // A. Storage mein file bhejna
      const { error: uploadError } = await supabase.storage
        .from('novels')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Database mein record save karna
      const { error: dbError } = await supabase
        .from('books')
        .insert({
          user_id: session.user.id,
          title: file.name,
          storage_path: filePath,
        });

      if (dbError) throw dbError;

      alert('Book uploaded successfully!');
      fetchBooks(); // List update karein
    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="library-container">
      <div className="library-header">
        <h1>Start uploading the novels to read them in the most interactive way</h1>
        
        <label className="upload-btn">
          {uploading ? 'Uploading...' : <><FiUploadCloud /> Upload Your Novel</>}
          <input 
            type="file" 
            accept="application/pdf" 
            onChange={handleUpload} 
            disabled={uploading}
            hidden 
          />
        </label>
      </div>

      <div className="books-grid">
        {books.length > 0 ? (
          books.map((book) => (
            <div key={book.id} className="book-item">
              <div className="book-icon"><FiBookOpen size={40} /></div>
              <p className="book-title">{book.title}</p>
              <button className="read-btn">Read Now</button>
            </div>
          ))
        ) : (
          <p className="empty-msg">No novels uploaded yet. Your first book will appear here!</p>
        )}
      </div>
    </div>
  );
};

export default Library;