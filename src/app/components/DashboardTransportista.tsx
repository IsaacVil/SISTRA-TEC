import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonaciones, Donacion } from '../context/DonacionContext';
import { useNavigate } from 'react-router';
import { LogOut, Package, Truck, Upload } from 'lucide-react';
import { TrazabilidadDonacion } from './TrazabilidadDonacion';

export const DashboardTransportista: React.FC = () => {
  const { user, logout } = useAuth();
  const { donaciones, actualizarEstadoDonacion } = useDonaciones();
  const navigate = useNavigate();
  const [donacionSeleccionada, setDonacionSeleccionada] = useState<Donacion | null>(null);
  const [mostrarModalEntregar, setMostrarModalEntregar] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const donacionesEnTransito = donaciones.filter(
    d => d.estadoActual === 'en_transito' && d.categoria !== 'fondos'
  );

  const donacionesEntregadas = donaciones.filter(
    d => d.estadoActual === 'entregado' && d.categoria !== 'fondos'
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Dashboard Transportista</h1>
            <p className="text-sm text-gray-600">
              Bienvenido, {user?.nombreCompleto}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-orange-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-orange-600">En Tránsito</p>
              <Truck className="text-orange-400" size={24} />
            </div>
            <p className="text-3xl text-orange-600">{donacionesEnTransito.length}</p>
            <p className="text-sm text-gray-600 mt-2">Pendientes de entrega</p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-green-600">Entregadas</p>
              <Package className="text-green-400" size={24} />
            </div>
            <p className="text-3xl text-green-600">{donacionesEntregadas.length}</p>
            <p className="text-sm text-gray-600 mt-2">Entregas completadas</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl">Donaciones en Tránsito</h2>
            <p className="text-sm text-gray-600 mt-1">
              Donaciones asignadas para entrega (solo no monetarias)
            </p>
          </div>

          {donacionesEnTransito.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No hay donaciones en tránsito en este momento
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">ID</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Objeto</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Cantidad</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Estado Artículo</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {donacionesEnTransito.map((donacion) => (
                    <tr key={donacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{donacion.id}</td>
                      <td className="px-6 py-4 capitalize">{donacion.categoria}</td>
                      <td className="px-6 py-4">{donacion.nombreObjeto}</td>
                      <td className="px-6 py-4">{donacion.cantidad}</td>
                      <td className="px-6 py-4 capitalize">{donacion.estadoArticulo || 'N/A'}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDonacionSeleccionada(donacion)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          Ver Detalle
                        </button>
                        <button
                          onClick={() => {
                            setDonacionSeleccionada(donacion);
                            setMostrarModalEntregar(true);
                          }}
                          className="text-green-600 hover:underline"
                        >
                          Entregar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl">Historial de Entregas</h2>
          </div>

          {donacionesEntregadas.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No has completado ninguna entrega todavía
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">ID</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Categoría</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Objeto</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Fecha Entrega</th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {donacionesEntregadas.map((donacion) => {
                    const eventoEntrega = donacion.trazabilidad.find(e => e.estado === 'entregado');
                    return (
                      <tr key={donacion.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">{donacion.id}</td>
                        <td className="px-6 py-4 capitalize">{donacion.categoria}</td>
                        <td className="px-6 py-4">{donacion.nombreObjeto}</td>
                        <td className="px-6 py-4">
                          {eventoEntrega
                            ? new Date(eventoEntrega.fecha).toLocaleDateString('es-CR')
                            : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDonacionSeleccionada(donacion)}
                            className="text-blue-600 hover:underline"
                          >
                            Ver Detalle
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {donacionSeleccionada && !mostrarModalEntregar && (
        <ModalDetalle
          donacion={donacionSeleccionada}
          onCerrar={() => setDonacionSeleccionada(null)}
        />
      )}

      {mostrarModalEntregar && donacionSeleccionada && (
        <ModalEntregar
          donacion={donacionSeleccionada}
          onCerrar={() => {
            setMostrarModalEntregar(false);
            setDonacionSeleccionada(null);
          }}
          onEntregar={actualizarEstadoDonacion}
          nombreUsuario={user?.nombreCompleto || 'Transportista'}
        />
      )}
    </div>
  );
};

const ModalDetalle: React.FC<{ donacion: Donacion; onCerrar: () => void }> = ({
  donacion,
  onCerrar,
}) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 pointer-events-none">
      <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl">Información de la Donación</h3>
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>
        <div className="p-6">
          <TrazabilidadDonacion donacion={donacion} />
        </div>
      </div>
    </div>
  );
};

const ModalEntregar: React.FC<{
  donacion: Donacion;
  onCerrar: () => void;
  onEntregar: (id: string, estado: any, descripcion: string, responsable: string, imagen?: string) => void;
  nombreUsuario: string;
}> = ({ donacion, onCerrar, onEntregar, nombreUsuario }) => {
  const [imagenEntrega, setImagenEntrega] = useState<string | null>(null);
  const [descripcion, setDescripcion] = useState('');

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenEntrega(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagenEntrega) {
      alert('Debe subir una imagen de comprobación de entrega');
      return;
    }
    onEntregar(donacion.id, 'entregado', descripcion, nombreUsuario, imagenEntrega);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 pointer-events-none">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl">Confirmar Entrega</h3>
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="mb-3">Información de la Donación</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span>{donacion.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Objeto:</span>
                <span>{donacion.nombreObjeto}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Cantidad:</span>
                <span>{donacion.cantidad}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Categoría:</span>
                <span className="capitalize">{donacion.categoria}</span>
              </div>
            </div>
          </div>

          {donacion.imagenObjeto && (
            <div>
              <h4 className="mb-2">Imagen del objeto donado:</h4>
              <img
                src={donacion.imagenObjeto}
                alt="Objeto donado"
                className="max-w-md rounded-lg border"
              />
            </div>
          )}

          <div>
            <label className="block mb-2">Descripción de la Entrega *</label>
            <textarea
              required
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
              placeholder="Ej: Entregado a familia beneficiaria en comunidad de..."
            />
          </div>

          <div>
            <label className="block mb-2">Imagen de Comprobación de Entrega *</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImagenChange}
                className="hidden"
                id="imagen-entrega"
                required
              />
              <label
                htmlFor="imagen-entrega"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload className="text-gray-400 mb-2" size={48} />
                <p className="text-sm text-gray-600">
                  Haga clic para subir una imagen de comprobación
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Esta imagen será visible públicamente
                </p>
              </label>
            </div>
            {imagenEntrega && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Vista previa:</p>
                <img
                  src={imagenEntrega}
                  alt="Vista previa comprobante"
                  className="max-w-md rounded-lg border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCerrar}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg"
            >
              Confirmar Entrega
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
