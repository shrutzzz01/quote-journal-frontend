import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom'; // Add this import
import API from '../services/api';

function Quotes() {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [hoveredQuoteId, setHoveredQuoteId] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

    // Get the tab from the URL, or default to 'all'
    const activeTab = searchParams.get('tab') || '';

    // Instead of setActiveTab, use this:
    const handleTabChange = (tabName) => {
      setSearchParams({ tab: tabName });
    };
  const [showForm, setShowForm] = useState(false);
  const [newQuote, setNewQuote] = useState({
    content: '',
    tag: '',
    isPublic: true,
  });

  const availableTags = ['MOTIVATION', 'LIFE', 'LOVE', 'WISDOM', 'HUMOR', 'INSPIRATION'];

  useEffect(() => {
    fetchQuotes();
  }, [activeTab]);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      let endpoint = '/quotes';
      if(activeTab === ''){
          endpoint = '/quotes';
          }
       else if (activeTab === 'public') {
               endpoint = '/quotes/public';
       } else if (activeTab === 'private') {
           endpoint = '/quotes/private';
       }
      const response = await API.get(endpoint);
      setQuotes(response.data);
    } catch (error) {
      console.error('Error fetching quotes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuote = async (e) => {
    e.preventDefault();
    try {
      await API.post('/quotes', newQuote);
      setNewQuote({ content: '', tag: '', isPublic: true });
      setShowForm(false);
      fetchQuotes();
    } catch (error) {
      console.error('Error creating quote:', error);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (window.confirm('Delete this quote?')) {
      try {
        await API.delete(`/quotes/${quoteId}`);
        fetchQuotes();
      } catch (error) {
        console.error('Error deleting quote:', error);
      }
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch = quote.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = !selectedTag || quote.tag === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div style={styles.container}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>Quotes Library</h1>
        <button onClick={() => setShowForm(!showForm)} style={showForm ? styles.cancelButton : styles.addButton}>
          {showForm ? 'Close Form' : '+ New Quote'}
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabsContainer}>
        {['my', 'public', 'private'].map((tab) => (
         <button
             key={tab}
             style={activeTab === tab ? styles.activeTab : styles.tab}
             onClick={() => handleTabChange(tab)} // Use the new handler
           >
             {tab.toUpperCase()} QUOTES
           </button>
        ))}
      </div>

      {/* New Quote Form */}
      {showForm && (
        <form onSubmit={handleCreateQuote} style={styles.form}>
          <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>Share a New Thought</h3>
          <textarea
            placeholder="What's on your mind?"
            value={newQuote.content}
            onChange={(e) => setNewQuote({ ...newQuote, content: e.target.value })}
            style={styles.textarea}
            required
          />
          <div style={styles.formRow}>
            <select
              value={newQuote.tag}
              onChange={(e) => setNewQuote({ ...newQuote, tag: e.target.value })}
              style={styles.input}
            >
              <option value="">Select a tag</option>
              {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
            </select>
            <label style={styles.checkbox}>
              <input
                type="checkbox"
                checked={newQuote.isPublic}
                onChange={(e) => setNewQuote({ ...newQuote, isPublic: e.target.checked })}
              />
              Public
            </label>
            <button type="submit" style={styles.submitButton}>Post Quote</button>
          </div>
        </form>
      )}

      {/* Search and Filter */}
      <div style={styles.filterBar}>
        <input
          type="text"
          placeholder="Search by keywords..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          style={styles.tagSelect}
        >
          <option value="">All Categories</option>
          {availableTags.map(tag => <option key={tag} value={tag}>{tag}</option>)}
        </select>
      </div>

      {/* Quotes List */}
      {loading ? (
        <div style={styles.loading}>Fetching quotes...</div>
      ) : (
        <div style={styles.quotesGrid}>
          {filteredQuotes.length === 0 ? (
            <p style={styles.emptyState}>No quotes found in this category.</p>
          ) : (
            filteredQuotes.map((quote) => (
              <div
                key={quote.quoteId}
                style={{
                    ...styles.quoteCard,
                    ...(hoveredQuoteId === quote.quoteId ? styles.quoteCardHover : {})
                }}
                onMouseEnter={() => setHoveredQuoteId(quote.quoteId)}
                onMouseLeave={() => setHoveredQuoteId(null)}
              >
                <p style={styles.quoteText}>“{quote.content}”</p>
                <div style={styles.cardFooter}>
                  <div style={styles.metaInfo}>
                    {quote.tag && <span style={styles.tagBadge}>{quote.tag}</span>}
                    <span style={styles.visibility}>
                      {quote.isPublic ? '🌍 Public' : '🔒 Private'}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteQuote(quote.quoteId)}
                    style={styles.deleteButton}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1100px',
    margin: '0 auto',
    padding: '2.5rem 1rem',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    color: '#2d3748',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  title: { margin: 0, fontSize: '2rem', fontWeight: '800' },
  tabsContainer: {
    display: 'flex',
    gap: '0.25rem',
    backgroundColor: '#edf2f7',
    padding: '0.4rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    width: 'fit-content',
  },
  tab: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '500',
    color: '#4a5568',
    transition: '0.2s',
  },
  activeTab: {
    padding: '0.6rem 1.2rem',
    border: 'none',
    background: 'white',
    color: '#2b6cb0',
    cursor: 'pointer',
    borderRadius: '6px',
    fontSize: '0.9rem',
    fontWeight: '600',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  },
  filterBar: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
  },
  searchInput: {
    flex: 2,
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  tagSelect: {
    flex: 1,
    padding: '0.75rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    backgroundColor: 'white',
  },
  addButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#2b6cb0',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: '600',
  },
  cancelButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#718096',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  form: {
    backgroundColor: '#fff',
    padding: '1.5rem',
    borderRadius: '12px',
    marginBottom: '2rem',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
  },
  formRow: { display: 'flex', gap: '1rem', alignItems: 'center' },
  textarea: {
    width: '100%',
    padding: '1rem',
    marginBottom: '1rem',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    minHeight: '80px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  },
  input: { flex: 1, padding: '0.6rem', border: '1px solid #e2e8f0', borderRadius: '6px' },
  checkbox: { fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' },
  submitButton: { padding: '0.6rem 1.5rem', backgroundColor: '#38a169', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' },
  quotesGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' },
  quoteCard: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    transition: 'all 0.3s ease',
  },
  quoteCardHover: {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 20px rgba(0,0,0,0.05)',
    borderColor: '#bee3f8',
  },
  quoteText: { fontSize: '1.15rem', lineHeight: '1.6', color: '#2d3748', margin: '0 0 1.5rem 0', fontWeight: '500' },
  cardFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f7fafc', paddingTop: '1rem' },
  metaInfo: { display: 'flex', alignItems: 'center', gap: '0.75rem' },
  tagBadge: { backgroundColor: '#ebf8ff', color: '#2b6cb0', padding: '0.2rem 0.6rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' },
  visibility: { fontSize: '0.75rem', color: '#a0aec0', fontWeight: '500' },
  deleteButton: { background: 'none', border: 'none', color: '#e53e3e', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', padding: '0.4rem' },
  loading: { textAlign: 'center', padding: '3rem', color: '#718096' },
  emptyState: { textAlign: 'center', gridColumn: '1/-1', padding: '3rem', color: '#a0aec0' }
};

export default Quotes;