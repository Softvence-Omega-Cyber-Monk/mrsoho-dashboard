import './App.css';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import DashboardTable from './components/DashboardTable';
import ContactDetail from './components/ContactDetail';

// Wrapper component to extract id from URL params and pass it to ContactDetail
const ContactDetailWrapper: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  return <ContactDetail id={id || ''} />; // Provide a default empty string if id is undefined
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardTable />} />
        <Route path="/contact/:id" element={<ContactDetailWrapper />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
