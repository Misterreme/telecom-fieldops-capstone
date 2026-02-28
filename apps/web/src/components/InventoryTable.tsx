type InventoryRow = {
  id: string;
  productName: string;
  qtyAvailable: number;
  qtyReserved: number;
  updatedAt: string;
};

type Props = {
  rows: InventoryRow[];
};

export default function InventoryTable({ rows }: Props) {
  if (rows.length === 0) {
    return <p className="text-slate-400">No hay inventario para la sucursal seleccionada.</p>;
  }

  return (
    <div className="overflow-x-auto mt-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800">
            <th className="text-left px-4 py-2 text-[0.7rem] uppercase tracking-widest text-slate-500">Producto</th>
            <th className="text-right px-4 py-2 text-[0.7rem] uppercase tracking-widest text-slate-500">Disponible</th>
            <th className="text-right px-4 py-2 text-[0.7rem] uppercase tracking-widest text-slate-500">Reservado</th>
            <th className="text-right px-4 py-2 text-[0.7rem] uppercase tracking-widest text-slate-500">Actualizado</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id} className="border-b border-slate-800/60 hover:bg-slate-800/30 transition-colors">
              <td className="px-4 py-3 text-slate-200">{row.productName}</td>
              <td className="px-4 py-3 text-right">{row.qtyAvailable}</td>
              <td className="px-4 py-3 text-right">{row.qtyReserved}</td>
              <td className="px-4 py-3 text-right">{new Date(row.updatedAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
