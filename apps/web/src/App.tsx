import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-w-screen min-h-screen" style={{ backgroundColor: '#f5faff' }}>
      <header style={{ backgroundColor: '#007bff', padding: '0.75rem' }}>
        <a
          href="/inventory"
          style={{ color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '1.1rem' }}
        >
          Inventario por sucursal
        </a>
      </header>
      <Outlet />
    </div>
  );
}

export default App;