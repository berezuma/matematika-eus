import { Link } from 'react-router-dom';
import useDocumentTitle from '../hooks/useDocumentTitle';

export default function NotFound() {
  useDocumentTitle('Orria ez da aurkitu');
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-indigo-600 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Orrialdea ez da aurkitu</h2>
        <p className="text-slate-500 mb-8">Bilatzen duzun orrialdea ez da existitzen.</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
        >
          Hasierara itzuli
        </Link>
      </div>
    </div>
  );
}
