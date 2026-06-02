import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { useNavigate } from 'react-router';
import { Eye, EyeOff } from 'lucide-react';

export const Registro: React.FC = () => {
  const [formData, setFormData] = useState({
    nombreCompleto: '',
    correoElectronico: '',
    telefono: '',
    contraseña: '',
    confirmarContraseña: '',
    rol: 'admin' as UserRole,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.nombreCompleto || !formData.correoElectronico || !formData.telefono || !formData.contraseña || !formData.confirmarContraseña) {
      setError('Por favor complete todos los campos');
      return;
    }

    if (formData.contraseña !== formData.confirmarContraseña) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.contraseña.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    const success = await register({
      nombreCompleto: formData.nombreCompleto,
      correoElectronico: formData.correoElectronico,
      telefono: formData.telefono,
      contraseña: formData.contraseña,
      rol: formData.rol,
    });

    if (success) {
      navigate('/dashboard');
    } else {
      setError('El correo electrónico ya está registrado');
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl mb-2">Sistra-TEC</h1>
          <p className="text-gray-600">Crear Cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block mb-2">Tipo de Usuario</label>
            <select
              value={formData.rol}
              onChange={(e) => handleChange('rol', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="admin">Administrador</option>
              <option value="transportista">Transportista</option>
            </select>
          </div>

          <div>
            <label className="block mb-2">Nombre Completo</label>
            <input
              type="text"
              value={formData.nombreCompleto}
              onChange={(e) => handleChange('nombreCompleto', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Juan Pérez García"
            />
          </div>

          <div>
            <label className="block mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={formData.correoElectronico}
              onChange={(e) => handleChange('correoElectronico', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ejemplo@correo.com"
            />
          </div>

          <div>
            <label className="block mb-2">Teléfono</label>
            <input
              type="tel"
              value={formData.telefono}
              onChange={(e) => handleChange('telefono', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="8888-8888"
            />
          </div>

          <div>
            <label className="block mb-2">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.contraseña}
                onChange={(e) => handleChange('contraseña', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2">Confirmar Contraseña</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={formData.confirmarContraseña}
                onChange={(e) => handleChange('confirmarContraseña', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg transition-colors"
          >
            Crear Cuenta
          </button>

          <div className="text-center space-y-2">
            <p className="text-gray-600">¿Ya tienes cuenta?</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-blue-600 hover:underline"
            >
              Iniciar sesión
            </button>
          </div>

          <div className="text-center pt-4 border-t">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-green-600 hover:underline"
            >
              Volver a la página principal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
