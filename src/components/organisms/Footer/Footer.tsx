import { ShoppingBag } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex flex-col items-end gap-2 text-sm text-slate-600">
        <ShoppingBag className="h-6 w-6 text-indigo-600" aria-hidden="true" />
        <p>
          <strong className="text-slate-900">Fit My Space</strong>
        </p>
        <p className="text-slate-500 italic text-right">
          Find your perfect <br />
          home organization products
        </p>
      </div>
    </footer>
  );
}
