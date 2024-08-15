import { PrimeReactProvider } from 'primereact/api';
import Auth from './components/Auth';
import './App.css';
import './components/Admin'

export default function App() {
    return (
        <PrimeReactProvider>
                    <h1>Welcome to Suggesto</h1>
                    <Auth />
                    
              
        </PrimeReactProvider>
    );
}
