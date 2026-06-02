import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDonaciones, CategoriaDonacion } from '../context/DonacionContext';
import { Search, Heart, Package, DollarSign, Shirt } from 'lucide-react';
import { TrazabilidadDonacion } from './TrazabilidadDonacion';

export const PaginaPublica: React.FC = () => {
  const [vista, setVista] = useState<'inicio' | 'buscar' | 'donar' | 'confirmacion'>('inicio');
  const [idBusqueda, setIdBusqueda] = useState('');
  const [donacionEncontrada, setDonacionEncontrada] = useState<any>(null);
  const [errorBusqueda, setErrorBusqueda] = useState('');
  const [donacionConfirmacion, setDonacionConfirmacion] = useState<any>(null);
  const { buscarDonacion, crearDonacion } = useDonaciones();
  const navigate = useNavigate();

  const handleBuscar = () => {
    setErrorBusqueda('');
    if (!idBusqueda.trim()) {
      setErrorBusqueda('Por favor ingrese el número de donación (ej: DON-001) para continuar con la búsqueda');
      return;
    }

    const donacion = buscarDonacion(idBusqueda);
    if (donacion) {
      setDonacionEncontrada(donacion);
    } else {
      setErrorBusqueda(`No encontramos una donación con el número "${idBusqueda}". Verifique que ingresó el número correcto (ej: DON-001). Si tiene dudas, intente nuevamente.`);
      setDonacionEncontrada(null);
    }
  };

  if (vista === 'buscar') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => {
              setVista('inicio');
              setDonacionEncontrada(null);
              setIdBusqueda('');
              setErrorBusqueda('');
            }}
            className="mb-6 text-blue-600 hover:underline"
          >
            ← Volver
          </button>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl mb-6">Buscar Donación</h2>

            <div className="flex gap-4 mb-6">
              <input
                type="text"
                value={idBusqueda}
                onChange={(e) => setIdBusqueda(e.target.value)}
                placeholder="Ingrese el ID de su donación (ej: DON-001)"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleBuscar()}
              />
              <button
                onClick={handleBuscar}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
              >
                <Search size={20} />
                Buscar
              </button>
            </div>

            {errorBusqueda && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {errorBusqueda}
              </div>
            )}

            {donacionEncontrada && (
              <TrazabilidadDonacion donacion={donacionEncontrada} />
            )}
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'confirmacion' && donacionConfirmacion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                <Heart className="text-green-600" size={32} />
              </div>
              <h2 className="text-4xl font-bold text-green-700 mb-2">¡Donación Realizada!</h2>
              <p className="text-gray-600 text-lg">
                Tu donación ha sido registrada exitosamente en nuestro sistema
              </p>
            </div>

            <div className="bg-green-50 border-2 border-green-300 rounded-lg p-6 mb-6 text-center">
              <p className="text-sm text-gray-700 mb-3 font-semibold">Número de Donación:</p>
              <p className="text-5xl font-bold text-green-700 mb-4">{donacionConfirmacion.id}</p>
              <p className="text-sm text-gray-600">
                ✓ Guarda este número para rastrear tu donación en cualquier momento
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-sm mb-3">Resumen de Donación:</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Categoría:</span>
                  <span className="capitalize font-medium">{donacionConfirmacion.donacion.categoria}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Cantidad:</span>
                  <span className="font-medium">{donacionConfirmacion.donacion.cantidad}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Donante:</span>
                  <span className="font-medium">{donacionConfirmacion.donacion.donante.nombre}</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                setVista('inicio');
                setDonacionConfirmacion(null);
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors font-semibold text-lg"
            >
              Ir a la Página Principal
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (vista === 'donar') {
    return <FormularioDonacion onVolver={() => setVista('inicio')} onDonacionCreada={(donacion) => {
      setDonacionConfirmacion(donacion);
      setVista('confirmacion');
    }} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl mb-4">Sistra-TEC</h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto">
            Plataforma de Trazabilidad de Donaciones en Tiempo Real
          </p>
          <p className="text-gray-600 mt-2">
            Seguimiento transparente de donaciones para emergencias en Costa Rica
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
          <button
            onClick={() => setVista('buscar')}
            className="bg-white hover:shadow-xl transition-shadow rounded-lg p-8 text-left group"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
              <Search className="text-blue-600" size={32} />
            </div>
            <h3 className="text-2xl mb-2">Buscar Donación</h3>
            <p className="text-gray-600">
              Rastree su donación en tiempo real usando su ID único
            </p>
          </button>

          <button
            onClick={() => setVista('donar')}
            className="bg-white hover:shadow-xl transition-shadow rounded-lg p-8 text-left group"
          >
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-green-200 transition-colors">
              <Heart className="text-green-600" size={32} />
            </div>
            <h3 className="text-2xl mb-2">Realizar Donación</h3>
            <p className="text-gray-600">
              Contribuya con medicamentos, fondos o ropa para los afectados
            </p>
          </button>
        </div>

        <div className="text-center">
          <button
            onClick={() => navigate('/login')}
            className="text-gray-600 hover:text-gray-800 hover:underline"
          >
            Acceso para Administradores y Transportistas →
          </button>
        </div>
      </div>
    </div>
  );
};

const FormularioDonacion: React.FC<{ onVolver: () => void; onDonacionCreada: (donacion: any) => void }> = ({ onVolver, onDonacionCreada }) => {
  const [formData, setFormData] = useState({
    categoria: 'medicamentos' as CategoriaDonacion,
    nombreObjeto: '',
    cantidad: '',
    descripcion: '',
    estadoArticulo: 'bueno' as any,
    nombreDonante: '',
    cedulaDonante: '',
    emailDonante: '',
    telefonoDonante: '',
  });
  const [imagenObjeto, setImagenObjeto] = useState<string | null>(null);
  const [erroresValidacion, setErroresValidacion] = useState<Record<string, string>>({});
  const { crearDonacion } = useDonaciones();

  const validarFormulario = (): boolean => {
    const errores: Record<string, string> = {};

    if (!formData.nombreObjeto.trim()) {
      errores.nombreObjeto = 'El nombre del objeto es obligatorio';
    }

    if (!formData.cantidad.trim()) {
      errores.cantidad = 'La cantidad es obligatoria';
    } else if (formData.categoria === 'fondos') {
      const cantidad = parseFloat(formData.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        errores.cantidad = 'La cantidad debe ser un número mayor a 0';
      }
    } else {
      const cantidad = parseInt(formData.cantidad);
      if (isNaN(cantidad) || cantidad <= 0) {
        errores.cantidad = 'La cantidad debe ser un número entero mayor a 0';
      }
    }

    if (!formData.descripcion.trim()) {
      errores.descripcion = 'La descripción es obligatoria';
    }

    if (formData.categoria !== 'fondos' && !formData.estadoArticulo) {
      errores.estadoArticulo = 'El estado del artículo es obligatorio';
    }

    if (!formData.nombreDonante.trim()) {
      errores.nombreDonante = 'El nombre es obligatorio';
    }

    if (!formData.cedulaDonante.trim()) {
      errores.cedulaDonante = 'La cédula es obligatoria';
    } else if (!/^\d-\d{4}-\d{4}$/.test(formData.cedulaDonante)) {
      errores.cedulaDonante = 'Formato inválido. Use: 1-1234-5678';
    }

    if (formData.emailDonante.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.emailDonante)) {
      errores.emailDonante = 'El correo electrónico no es válido';
    }

    if (formData.telefonoDonante.trim() && !/^\d{4}-\d{4}$/.test(formData.telefonoDonante)) {
      errores.telefonoDonante = 'Formato inválido. Use: 8888-8888';
    }

    setErroresValidacion(errores);
    return Object.keys(errores).length === 0;
  };

  const handleImagenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagenObjeto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const nuevaDonacion = crearDonacion({
      categoria: formData.categoria,
      nombreObjeto: formData.nombreObjeto,
      cantidad: formData.cantidad,
      descripcion: formData.descripcion,
      estadoArticulo: formData.categoria !== 'fondos' ? formData.estadoArticulo : undefined,
      imagenObjeto: imagenObjeto || undefined,
      donante: {
        nombre: formData.nombreDonante,
        cedula: formData.cedulaDonante,
        email: formData.emailDonante || undefined,
        telefono: formData.telefonoDonante || undefined,
      },
    });

    onDonacionCreada({ id: nuevaDonacion.id, donacion: nuevaDonacion });
  };

  const categoriaIcons = {
    medicamentos: Package,
    fondos: DollarSign,
    ropa: Shirt,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="max-w-2xl mx-auto">
        <button onClick={onVolver} className="mb-6 text-blue-600 hover:underline">
          ← Volver
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl mb-6">Realizar Donación</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2">Categoría de Donación</label>
              <div className="grid grid-cols-3 gap-4">
                {(['medicamentos', 'fondos', 'ropa'] as CategoriaDonacion[]).map((cat) => {
                  const Icon = categoriaIcons[cat];
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setFormData({ ...formData, categoria: cat })}
                      className={`p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-colors ${
                        formData.categoria === cat
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Icon size={32} />
                      <span className="text-sm capitalize">{cat}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block font-medium">Nombre del Objeto *</label>
                <span title="Nombre específico de lo que está donando" className="text-gray-400 cursor-help">ⓘ</span>
              </div>
              <input
                type="text"
                required
                value={formData.nombreObjeto}
                onChange={(e) => setFormData({ ...formData, nombreObjeto: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  erroresValidacion.nombreObjeto
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={
                  formData.categoria === 'fondos'
                    ? 'ej: Donación monetaria'
                    : formData.categoria === 'medicamentos'
                    ? 'ej: Analgésicos, Antibióticos'
                    : 'ej: Ropa de abrigo, Calzado'
                }
              />
              {erroresValidacion.nombreObjeto && (
                <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.nombreObjeto}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block font-medium">Cantidad *</label>
                <span title="Número de unidades que está donando (ej: 10 cajas, 50 prendas, 100000 colones)" className="text-gray-400 cursor-help">ⓘ</span>
              </div>
              <input
                type="text"
                required
                value={formData.cantidad}
                onChange={(e) => setFormData({ ...formData, cantidad: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                  erroresValidacion.cantidad
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder={
                  formData.categoria === 'fondos'
                    ? 'ej: 50000'
                    : 'ej: 10, 20, 50'
                }
              />
              {erroresValidacion.cantidad && (
                <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.cantidad}</p>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <label className="block font-medium">Descripción *</label>
                <span title="Cuéntenos más detalles sobre lo que está donando para que otros puedan identificarlo" className="text-gray-400 cursor-help">ⓘ</span>
              </div>
              <textarea
                required
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 h-24 ${
                  erroresValidacion.descripcion
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
                placeholder="Ej: Caja de medicamentos para gripe. Incluye paracetamol, ibuprofeno y vitamina C."
              />
              {erroresValidacion.descripcion && (
                <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.descripcion}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">Ayuda: Sea específico para que otros entiendan bien qué está donando</p>
            </div>

            {formData.categoria !== 'fondos' && (
              <>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block font-medium">Estado del Artículo *</label>
                    <span title="Seleccione cómo se encuentra el artículo que está donando" className="text-gray-400 cursor-help">ⓘ</span>
                  </div>
                  <select
                    required
                    value={formData.estadoArticulo}
                    onChange={(e) => setFormData({ ...formData, estadoArticulo: e.target.value as any })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      erroresValidacion.estadoArticulo
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                  >
                    <option value="excelente">Excelente - Nuevo o como nuevo</option>
                    <option value="bueno">Buen estado - Funciona perfectamente</option>
                    <option value="normal">Normal - Tiene uso, pero está en buen estado</option>
                    <option value="malo">Mal estado - Necesita reparación</option>
                  </select>
                  {erroresValidacion.estadoArticulo && (
                    <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.estadoArticulo}</p>
                  )}
                </div>

                <div>
                  <label className="block mb-2">Imagen del Objeto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImagenChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {imagenObjeto && (
                    <div className="mt-2">
                      <img
                        src={imagenObjeto}
                        alt="Vista previa"
                        className="max-w-xs rounded-lg border"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            <div className="border-t pt-6">
              <h3 className="mb-2 font-semibold">Información del Donante</h3>
              <p className="text-sm text-gray-600 mb-4">Estos datos nos ayudan a registrar su donación y mantener contacto con usted para confirmar entrega</p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block font-medium">Nombre Completo *</label>
                    <span title="Su nombre tal como aparece en su cédula" className="text-gray-400 cursor-help">ⓘ</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.nombreDonante}
                    onChange={(e) => setFormData({ ...formData, nombreDonante: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      erroresValidacion.nombreDonante
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="Juan Pérez García"
                  />
                  {erroresValidacion.nombreDonante && (
                    <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.nombreDonante}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block font-medium">Cédula *</label>
                    <span title="Use el formato: 1-1234-5678 (necesaria para identificar al donante)" className="text-gray-400 cursor-help">ⓘ</span>
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.cedulaDonante}
                    onChange={(e) => setFormData({ ...formData, cedulaDonante: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      erroresValidacion.cedulaDonante
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="1-1234-5678"
                  />
                  {erroresValidacion.cedulaDonante && (
                    <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.cedulaDonante}</p>
                  )}
                  {!erroresValidacion.cedulaDonante && (
                    <p className="text-xs text-gray-500 mt-1">Formato: número-números-números</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block font-medium">Correo Electrónico (opcional)</label>
                    <span title="Nos permite enviarle actualizaciones sobre su donación" className="text-gray-400 cursor-help">ⓘ</span>
                  </div>
                  <input
                    type="email"
                    value={formData.emailDonante}
                    onChange={(e) => setFormData({ ...formData, emailDonante: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      erroresValidacion.emailDonante
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="ejemplo@correo.com"
                  />
                  {erroresValidacion.emailDonante && (
                    <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.emailDonante}</p>
                  )}
                  {!erroresValidacion.emailDonante && (
                    <p className="text-xs text-gray-500 mt-1">Ayuda: Agregue su email para recibir actualizaciones</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <label className="block font-medium">Teléfono (opcional)</label>
                    <span title="Un número de contacto en caso de necesitar confirmar información" className="text-gray-400 cursor-help">ⓘ</span>
                  </div>
                  <input
                    type="tel"
                    value={formData.telefonoDonante}
                    onChange={(e) => setFormData({ ...formData, telefonoDonante: e.target.value })}
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 ${
                      erroresValidacion.telefonoDonante
                        ? 'border-red-500 focus:ring-red-500'
                        : 'border-gray-300 focus:ring-blue-500'
                    }`}
                    placeholder="8888-8888"
                  />
                  {erroresValidacion.telefonoDonante && (
                    <p className="text-red-600 text-sm mt-1">⚠ {erroresValidacion.telefonoDonante}</p>
                  )}
                  {!erroresValidacion.telefonoDonante && (
                    <p className="text-xs text-gray-500 mt-1">Formato: 8888-8888</p>
                  )}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition-colors"
            >
              Registrar Donación
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
