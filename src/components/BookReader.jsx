import React, { useState, useEffect, useCallback, useRef } from 'react';
import HTMLPageFlip from 'react-pageflip';
import * as pdfjsLib from 'pdfjs-dist';
import { supabase } from '../supabaseClient';
import { FiX, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import pdfWorker from 'pdfjs-dist/build/pdf.worker.mjs?url';
import { useNavigate } from 'react-router-dom';
import NabarWrapper from './NabarWrapper';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorker;
import { useParams } from 'react-router-dom';
// Vite mein PDF.js worker set up karna zaroori hai

const BookReader = ({ book }) => {
  const navigate = useNavigate();
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentBook, setCurrentBook] = useState(propBook);
  const [initialPage, setInitialPage] = useState(0);
  const [isDataReady, setIsDataReady] = useState(false);
  const flipBookRef = useRef(null);

  const fetchBookAndProgress = useCallback(async () => {
    try {
      let tempBook = currentBook;

      // Agar page reload hua hai toh book data fetch karein
      if (!tempBook) {
        const { data: bookData } = await supabase
          .from('books')
          .select('*')
          .eq('id', bookId)
          .single();
        tempBook = bookData;
        setCurrentBook(bookData);
      }

      // Progress fetch karein
      if (session?.user) {
        const { data: progressData } = await supabase
          .from('user_progress')
          .select('current_page')
          .eq('book_id', bookId)
          .eq('user_id', session.user.id)
          .single();

        if (progressData) {
          setInitialPage(progressData.current_page);
        }
      }
      setIsDataReady(true);
    } catch (err) {
      console.error("Error fetching initial data:", err);
    }
  }, [book, currentBook, session]);

  const loadPDF = useCallback(async () => {
    if (!book) return;
    try {
      // 1. Supabase se temporary URL lena (kyuki bucket private hai)
      const { data, error } = await supabase.storage
        .from('novels')
        .createSignedUrl(book.storage_path, 60 * 60); // 1 hour validity
      

      if (error) throw error;

      // 2. PDF Load karna
      const loadingTask = pdfjsLib.getDocument(data.signedUrl);
      const pdf = await loadingTask.promise;
      const totalPages = pdf.numPages;
      const renderedPages = [];

      // 3. Har page ko image (DataURL) mein convert karna
      for (let i = 1; i <= totalPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.height = viewport.height;
        canvas.width = viewport.width;

        await page.render({ canvasContext: context, viewport: viewport }).promise;
        renderedPages.push(canvas.toDataURL('image/png'));
      }

      setPages(renderedPages);
    } catch (err) {
      console.error("Error loading PDF:", err);
      alert("Could not load PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [book]);

  useEffect(() => {
    if (book){
        loadPDF();
    }
    
  }, [book,loadPDF]);

  if (loading) return <div className="reader-loading">Magic is happening... Generating your 3D Book 📖</div>;

  return (
    <div className="full-page-reader">
      <header className="reader-header">
        <div className="reader-title">
          <h2>{book?.title}</h2>
        </div>
        
        <div className="reader-exit">
          <button className="close-x-btn" onClick={() => navigate('/')} title="Close Book">
            <FiX size={28} />
          </button>
        </div>
      </header>

      <div className="flipbook-container">
        <HTMLPageFlip 
          width={400} 
          height={550} 
          showCover={true}
          className="flip-book"
          ref={flipBookRef}
        >
          {pages.map((image, index) => (
            <div key={index} className="page">
              <img src={image} alt={`Page ${index + 1}`} />
              <div className="page-number">{index + 1}</div>
            </div>
          ))}
        </HTMLPageFlip>
      </div>

      <div className="reader-controls">
         <button onClick={() => flipBookRef.current.pageFlip().flipPrev()}>Previous</button>
         <button onClick={() => flipBookRef.current.pageFlip().flipNext()}>Next</button>
      </div>
    </div>
  );
};

export default BookReader;