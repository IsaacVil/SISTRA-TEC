import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useDonaciones, Donacion, EstadoDonacion, EstadoArticulo } from '../context/DonacionContext';
import { useNavigate } from 'react-router';
import { LogOut, Package, Truck, CheckCircle, Filter, Search, FileCheck } from 'lucide-react';
import { TrazabilidadDonacion } from './TrazabilidadDonacion';

export const DashboardAdmin: React.FC = () => {
  const { user, logout } = useAuth();
  const { donaciones, actualizarEstadoDonacion, clasificarDonacion } = useDonaciones();
  const navigate = useNavigate();
  const [filtroEstado, setFiltroEstado] = useState<EstadoDonacion | 'todas'>('todas');
  const [donacionSeleccionada, setDonacionSeleccionada] = useState<Donacion | null>(null);
  const [mostrarModalClasificar, setMostrarModalClasificar] = useState(false);
  const [searchId, setSearchId] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const donacionesFiltradas = filtroEstado === 'todas'
    ? donaciones
    : donaciones.filter(d => d.estadoActual === filtroEstado);

  const donacionesBuscadas = searchId
    ? donacionesFiltradas.filter(d => d.id.toLowerCase().includes(searchId.toLowerCase()))
    : donacionesFiltradas;

  const estadisticas = {
    total: donaciones.length,
    recibidas: donaciones.filter(d => d.estadoActual === 'recibido').length,
    clasificadas: donaciones.filter(d => d.estadoActual === 'clasificado').length,
    enTransito: donaciones.filter(d => d.estadoActual === 'en_transito').length,
    entregadas: donaciones.filter(d => d.estadoActual === 'entregado').length,
  };

  const getProximoEstado = (estadoActual: EstadoDonacion): EstadoDonacion | null => {
    if (estadoActual === 'recibido') return 'clasificado';
    if (estadoActual === 'clasificado') return 'en_transito';
    if (estadoActual === 'en_transito') return 'entregado';
    return null;
  };

  const getBotonTexto = (estadoActual: EstadoDonacion): string => {
    if (estadoActual === 'recibido') return 'Clasificar';
    if (estadoActual === 'clasificado') return 'Poner en Tránsito';
    if (estadoActual === 'en_transito') return 'Marcar Entregado';
    return '';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl">Dashboard Administrador</h1>
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
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-gray-600">Total</p>
              <Package className="text-gray-400" size={24} />
            </div>
            <p className="text-3xl">{estadisticas.total}</p>
          </div>

          <div className="bg-blue-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-blue-600">Recibidas</p>
              <Package className="text-blue-400" size={24} />
            </div>
            <p className="text-3xl text-blue-600">{estadisticas.recibidas}</p>
          </div>

          <div className="bg-purple-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-purple-600">Clasificadas</p>
              <FileCheck className="text-purple-400" size={24} />
            </div>
            <p className="text-3xl text-purple-600">{estadisticas.clasificadas}</p>
          </div>

          <div className="bg-orange-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-orange-600">En Tránsito</p>
              <Truck className="text-orange-400" size={24} />
            </div>
            <p className="text-3xl text-orange-600">{estadisticas.enTransito}</p>
          </div>

          <div className="bg-green-50 rounded-lg shadow p-6">
            <div className="flex justify-between items-start mb-2">
              <p className="text-green-600">Entregadas</p>
              <CheckCircle className="text-green-400" size={24} />
            </div>
            <p className="text-3xl text-green-600">{estadisticas.entregadas}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl">Gestión de Donaciones</h2>
              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                <div className="flex items-center gap-2">
                  <Search size={20} className="text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por ID..."
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter size={20} className="text-gray-400" />
                  <select
                    value={filtroEstado}
                    onChange={(e) => setFiltroEstado(e.target.value as any)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todas">Todas</option>
                    <option value="recibido">Recibidas</option>
                    <option value="clasificado">Clasificadas</option>
                    <option value="en_transito">En Tránsito</option>
                    <option value="entregado">Entregadas</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">ID</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Objeto</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Donante</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Estado</th>
                  <th className="px-6 py-3 text-left text-xs uppercase text-gray-600">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {donacionesBuscadas.map((donacion) => {
                  const proximoEstado = getProximoEstado(donacion.estadoActual);
                  const esMonetaria = donacion.categoria === 'fondos';

                  return (
                    <tr key={donacion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">{donacion.id}</td>
                      <td className="px-6 py-4 capitalize">{donacion.categoria}</td>
                      <td className="px-6 py-4">{donacion.nombreObjeto}</td>
                      <td className="px-6 py-4">{donacion.donante.nombre}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            donacion.estadoActual === 'recibido'
                              ? 'bg-blue-100 text-blue-700'
                              : donacion.estadoActual === 'clasificado'
                              ? 'bg-purple-100 text-purple-700'
                              : donacion.estadoActual === 'en_transito'
                              ? 'bg-orange-100 text-orange-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {donacion.estadoActual === 'recibido' && 'Recibido'}
                          {donacion.estadoActual === 'clasificado' && 'Clasificado'}
                          {donacion.estadoActual === 'en_transito' && 'En Tránsito'}
                          {donacion.estadoActual === 'entregado' && 'Entregado'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setDonacionSeleccionada(donacion)}
                          className="text-blue-600 hover:underline mr-3"
                        >
                          Ver
                        </button>
                        {proximoEstado && !esMonetaria && (
                          <button
                            onClick={() => {
                              setDonacionSeleccionada(donacion);
                              if (donacion.estadoActual === 'recibido') {
                                setMostrarModalClasificar(true);
                              } else {
                                actualizarEstadoDonacion(
                                  donacion.id,
                                  proximoEstado,
                                  `Cambiado a estado: ${proximoEstado}`,
                                  user?.nombreCompleto || 'Admin'
                                );
                              }
                            }}
                            className="text-green-600 hover:underline"
                          >
                            {getBotonTexto(donacion.estadoActual)}
                          </button>
                        )}
                        {esMonetaria && donacion.estadoActual === 'recibido' && (
                          <span className="text-gray-400 text-sm">Monetaria (no se reparte)</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {donacionSeleccionada && !mostrarModalClasificar && (
        <ModalDetalle
          donacion={donacionSeleccionada}
          onCerrar={() => setDonacionSeleccionada(null)}
        />
      )}

      {mostrarModalClasificar && donacionSeleccionada && (
        <ModalClasificar
          donacion={donacionSeleccionada}
          onCerrar={() => {
            setMostrarModalClasificar(false);
            setDonacionSeleccionada(null);
          }}
          onClasificar={clasificarDonacion}
          nombreUsuario={user?.nombreCompleto || 'Admin'}
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
          <h3 className="text-xl">Detalle de Donación</h3>
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

const ModalClasificar: React.FC<{
  donacion: Donacion;
  onCerrar: () => void;
  onClasificar: (id: string, estadoArticulo: EstadoArticulo, responsable: string) => void;
  nombreUsuario: string;
}> = ({ donacion, onCerrar, onClasificar, nombreUsuario }) => {
  const [estadoArticulo, setEstadoArticulo] = useState<EstadoArticulo>('bueno');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClasificar(donacion.id, estadoArticulo, nombreUsuario);
    onCerrar();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 pointer-events-none">
      <div className="bg-white rounded-lg max-w-md w-full pointer-events-auto">
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl">Clasificar Donación</h3>
          <button onClick={onCerrar} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-600 mb-1">Donación: {donacion.id}</p>
            <p className="text-sm text-gray-600">Objeto: {donacion.nombreObjeto}</p>
          </div>

          <div>
            <label className="block mb-2">Estado del Artículo</label>
            <select
              value={estadoArticulo}
              onChange={(e) => setEstadoArticulo(e.target.value as EstadoArticulo)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="excelente">Excelente estado</option>
              <option value="bueno">Buen estado</option>
              <option value="normal">Normal estado</option>
              <option value="malo">Mal estado</option>
            </select>
            <p className="text-sm text-gray-500 mt-2">
              Una vez clasificado, estará listo para que un transportista asuma la entrega
            </p>
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
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
            >
              Clasificar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
