import React from "react";

// Footer.jsx
// Responsive footer component without Tailwind CSS

export default function Footer({ company = "Made by", names = ["Rishi Shinde", "Vaishnavi Koli", "Aniket Gosavi"], year = new Date().getFullYear() }) {
  return (
    <footer style={{ width: '100%', background: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'bottom',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 2l3 7h7l-5.5 4.5L20 21l-8-5-8 5 1.5-7.5L0 9h7l3-7z" />
          </svg>
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, fontWeight: 'bold' }}>{company}</p>
            <p style={{ margin: 0, fontSize: '0.9em', color: '#555' }}>{names.join(' • ')}</p>
          </div>
        </div>

        <div style={{ marginTop: '10px', fontSize: '0.9em', color: '#666', textAlign: 'center' }}>
          © {year} • All rights reserved.
        </div>

        <nav style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="#" style={{ fontSize: '0.9em', color: '#007bff', textDecoration: 'none' }}>Privacy</a>
          <a href="#" style={{ fontSize: '0.9em', color: '#007bff', textDecoration: 'none' }}>Terms</a>
          <a href="#" style={{ display: 'flex', alignItems: 'center' }} aria-label="github">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 .5a12 12 0 00-3.79 23.4c.6.11.82-.26.82-.58v-2.03c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.77-1.34-1.77-1.1-.75.08-.74.08-.74 1.22.09 1.86 1.26 1.86 1.26 1.08 1.86 2.83 1.32 3.52 1.01.11-.79.42-1.32.76-1.62-2.66-.3-5.46-1.33-5.46-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 016 0c2.28-1.55 3.29-1.23 3.29-1.23.66 1.65.24 2.87.12 3.17.77.84 1.23 1.91 1.23 3.22 0 4.61-2.8 5.63-5.47 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.22.7.83.58A12 12 0 0012 .5z" />
            </svg>
          </a>
        </nav>
      </div>
    </footer>
  );
}
