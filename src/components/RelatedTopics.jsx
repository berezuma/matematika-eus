import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { RESOURCES, CATEGORIES } from '../data/resources';

export default function RelatedTopics({ currentId }) {
  const related = useMemo(() => {
    const current = RESOURCES.find(r => r.id === currentId);
    if (!current) return [];
    const sameCat = RESOURCES.filter(
      r => r.id !== currentId && r.category === current.category && r.link && r.link !== '#'
    );
    // Fisher-Yates shuffle
    const shuffled = [...sameCat];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, 3);
  }, [currentId]);

  if (related.length === 0) return null;

  return (
    <section className="max-w-4xl mx-auto px-4 py-12">
      <h2 className="text-lg font-bold text-slate-700 mb-6">Gai erlazionatuak</h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {related.map(r => (
          <Link
            key={r.id}
            to={r.link}
            className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg hover:border-transparent transition-all duration-300"
          >
            <div className={`h-1 ${r.color}`} />
            <div className="p-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {CATEGORIES.find(c => c.id === r.category)?.label}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-1 mb-1 group-hover:text-indigo-600 transition-colors">
                {r.title}
              </h3>
              <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 mb-2">{r.description}</p>
              <span className="flex items-center text-indigo-600 text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                Ikusi <ArrowRight className="w-3 h-3" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
