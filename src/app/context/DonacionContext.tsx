import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type CategoriaDonacion = 'medicamentos' | 'fondos' | 'ropa';

export type EstadoDonacion = 'recibido' | 'clasificado' | 'en_transito' | 'entregado';

export type EstadoArticulo = 'excelente' | 'bueno' | 'normal' | 'malo';

export interface EventoTrazabilidad {
  id: string;
  fecha: string;
  estado: EstadoDonacion;
  descripcion: string;
  ubicacion?: string;
  responsable?: string;
  imagenEntrega?: string;
}

export interface Donacion {
  id: string;
  categoria: CategoriaDonacion;
  nombreObjeto: string;
  cantidad: string;
  descripcion: string;
  estadoArticulo?: EstadoArticulo;
  imagenObjeto?: string;
  donante: {
    nombre: string;
    cedula: string;
    email?: string;
    telefono?: string;
  };
  fechaCreacion: string;
  estadoActual: EstadoDonacion;
  trazabilidad: EventoTrazabilidad[];
}

interface DonacionContextType {
  donaciones: Donacion[];
  crearDonacion: (donacion: Omit<Donacion, 'id' | 'fechaCreacion' | 'estadoActual' | 'trazabilidad'>) => Donacion;
  buscarDonacion: (id: string) => Donacion | undefined;
  actualizarEstadoDonacion: (id: string, nuevoEstado: EstadoDonacion, descripcion: string, responsable: string, imagenEntrega?: string) => void;
  clasificarDonacion: (id: string, estadoArticulo: EstadoArticulo, responsable: string) => void;
}

const DonacionContext = createContext<DonacionContextType | undefined>(undefined);

export const DonacionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [donaciones, setDonaciones] = useState<Donacion[]>([]);

  useEffect(() => {
    const savedDonaciones = localStorage.getItem('sistra-donaciones');
    if (savedDonaciones) {
      setDonaciones(JSON.parse(savedDonaciones));
    } else {
      // Datos de ejemplo
      const ejemploDonaciones: Donacion[] = [
        {
          id: 'DON-001',
          categoria: 'medicamentos',
          nombreObjeto: 'Medicamentos varios',
          cantidad: '50',
          descripcion: 'Analgésicos y antibióticos',
          estadoArticulo: 'excelente',
          donante: {
            nombre: 'María Rodríguez',
            cedula: '1-1234-5678',
            email: 'maria@example.com',
            telefono: '8888-8888',
          },
          fechaCreacion: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          estadoActual: 'entregado',
          trazabilidad: [
            {
              id: '1',
              fecha: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
              estado: 'recibido',
              descripcion: 'Donación recibida en centro de acopio',
              ubicacion: 'San José Centro',
              responsable: 'Sistema',
            },
            {
              id: '2',
              fecha: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              estado: 'clasificado',
              descripcion: 'Su objeto donado ha sido clasificado, está listo para que un mensajero asuma la entrega. Puede seguir consultado para estar informado de su donación',
              ubicacion: 'San José Centro',
              responsable: 'Admin Principal',
            },
            {
              id: '3',
              fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              estado: 'en_transito',
              descripcion: 'En camino a zona afectada',
              ubicacion: 'Ruta 32',
              responsable: 'Carlos Transportista',
            },
            {
              id: '4',
              fecha: new Date().toISOString(),
              estado: 'entregado',
              descripcion: 'Entregado a beneficiarios en Limón',
              ubicacion: 'Limón',
              responsable: 'Carlos Transportista',
            },
          ],
        },
        {
          id: 'DON-002',
          categoria: 'ropa',
          nombreObjeto: 'Ropa de abrigo',
          cantidad: '100',
          descripcion: 'Ropa de abrigo y calzado',
          estadoArticulo: 'bueno',
          donante: {
            nombre: 'Juan Pérez',
            cedula: '2-2345-6789',
            telefono: '7777-7777',
          },
          fechaCreacion: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          estadoActual: 'en_transito',
          trazabilidad: [
            {
              id: '1',
              fecha: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              estado: 'recibido',
              descripcion: 'Donación recibida en centro de acopio',
              ubicacion: 'Cartago',
              responsable: 'Sistema',
            },
            {
              id: '2',
              fecha: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
              estado: 'clasificado',
              descripcion: 'Su objeto donado ha sido clasificado, está listo para que un mensajero asuma la entrega. Puede seguir consultado para estar informado de su donación',
              ubicacion: 'Cartago',
              responsable: 'Admin Principal',
            },
            {
              id: '3',
              fecha: new Date().toISOString(),
              estado: 'en_transito',
              descripcion: 'En ruta hacia Guanacaste',
              ubicacion: 'Autopista General Cañas',
              responsable: 'Ana Transportista',
            },
          ],
        },
        {
          id: 'DON-003',
          categoria: 'fondos',
          nombreObjeto: 'Donación monetaria',
          cantidad: '50000',
          descripcion: 'Aporte para compra de alimentos',
          donante: {
            nombre: 'Carlos Jiménez',
            cedula: '3-3456-7890',
            email: 'carlos@example.com',
          },
          fechaCreacion: new Date().toISOString(),
          estadoActual: 'recibido',
          trazabilidad: [
            {
              id: '1',
              fecha: new Date().toISOString(),
              estado: 'recibido',
              descripcion: 'Donación monetaria recibida',
              responsable: 'Sistema',
            },
          ],
        },
      ];
      setDonaciones(ejemploDonaciones);
      localStorage.setItem('sistra-donaciones', JSON.stringify(ejemploDonaciones));
    }
  }, []);

  const crearDonacion = (donacion: Omit<Donacion, 'id' | 'fechaCreacion' | 'estadoActual' | 'trazabilidad'>): Donacion => {
    const nuevoId = `DON-${String(donaciones.length + 1).padStart(3, '0')}`;
    const fechaCreacion = new Date().toISOString();

    const nuevaDonacion: Donacion = {
      ...donacion,
      id: nuevoId,
      fechaCreacion,
      estadoActual: 'recibido',
      trazabilidad: [
        {
          id: '1',
          fecha: fechaCreacion,
          estado: 'recibido',
          descripcion: 'Donación registrada en el sistema',
          ubicacion: 'Centro de Acopio Principal',
          responsable: 'Sistema',
        },
      ],
    };

    const nuevasDonaciones = [...donaciones, nuevaDonacion];
    setDonaciones(nuevasDonaciones);
    localStorage.setItem('sistra-donaciones', JSON.stringify(nuevasDonaciones));

    return nuevaDonacion;
  };

  const buscarDonacion = (id: string): Donacion | undefined => {
    return donaciones.find(d => d.id.toLowerCase() === id.toLowerCase());
  };

  const actualizarEstadoDonacion = (
    id: string,
    nuevoEstado: EstadoDonacion,
    descripcion: string,
    responsable: string,
    imagenEntrega?: string
  ) => {
    const donacionIndex = donaciones.findIndex(d => d.id === id);
    if (donacionIndex === -1) return;

    const donacionActualizada = { ...donaciones[donacionIndex] };
    donacionActualizada.estadoActual = nuevoEstado;

    const nuevoEvento: EventoTrazabilidad = {
      id: String(donacionActualizada.trazabilidad.length + 1),
      fecha: new Date().toISOString(),
      estado: nuevoEstado,
      descripcion,
      responsable,
      imagenEntrega,
    };

    donacionActualizada.trazabilidad.push(nuevoEvento);

    const nuevasDonaciones = [...donaciones];
    nuevasDonaciones[donacionIndex] = donacionActualizada;

    setDonaciones(nuevasDonaciones);
    localStorage.setItem('sistra-donaciones', JSON.stringify(nuevasDonaciones));
  };

  const clasificarDonacion = (id: string, estadoArticulo: EstadoArticulo, responsable: string) => {
    const donacionIndex = donaciones.findIndex(d => d.id === id);
    if (donacionIndex === -1) return;

    const donacionActualizada = { ...donaciones[donacionIndex] };
    donacionActualizada.estadoArticulo = estadoArticulo;
    donacionActualizada.estadoActual = 'clasificado';

    const nuevoEvento: EventoTrazabilidad = {
      id: String(donacionActualizada.trazabilidad.length + 1),
      fecha: new Date().toISOString(),
      estado: 'clasificado',
      descripcion: 'Su objeto donado ha sido clasificado, está listo para que un mensajero asuma la entrega. Puede seguir consultado para estar informado de su donación',
      responsable,
    };

    donacionActualizada.trazabilidad.push(nuevoEvento);

    const nuevasDonaciones = [...donaciones];
    nuevasDonaciones[donacionIndex] = donacionActualizada;

    setDonaciones(nuevasDonaciones);
    localStorage.setItem('sistra-donaciones', JSON.stringify(nuevasDonaciones));
  };

  return (
    <DonacionContext.Provider
      value={{
        donaciones,
        crearDonacion,
        buscarDonacion,
        actualizarEstadoDonacion,
        clasificarDonacion,
      }}
    >
      {children}
    </DonacionContext.Provider>
  );
};

export const useDonaciones = () => {
  const context = useContext(DonacionContext);
  if (context === undefined) {
    throw new Error('useDonaciones debe usarse dentro de DonacionProvider');
  }
  return context;
};
