// src/app/data/ejercicios-catalogo.ts

// Definimos cómo se ve un ejercicio base
export interface EjercicioBase {
  nombre: string;
  imagenUrl: string;
  categoria: string;
  instrucciones?: string; // Opcional
}

// Este es tu catálogo maestro. ¡Aquí añadirás todos los ejercicios que ofreces!
export const CATALOGO_EJERCICIOS: EjercicioBase[] = [
  // --- PECHO ---
  {
    nombre: 'Press Banca Plano',
    categoria: 'Pecho',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Press+Banca',
    instrucciones: 'Barra al pecho, codos a 45 grados.'
  },
  {
    nombre: 'Aperturas con Mancuernas',
    categoria: 'Pecho',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Aperturas',
    instrucciones: 'Abre los brazos sintiendo el estiramiento.'
  },

  // --- ESPALDA ---
  {
    nombre: 'Jalón al Pecho',
    categoria: 'Espalda',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Jalon+Pecho',
    instrucciones: 'Lleva la barra a la parte superior del pecho.'
  },
  {
    nombre: 'Remo con Barra',
    categoria: 'Espalda',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Remo+Barra',
    instrucciones: 'Espalda recta, tira de la barra hacia el abdomen.'
  },

  // --- PIERNA ---
  {
    nombre: 'Sentadilla Libre',
    categoria: 'Pierna',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Sentadilla',
    instrucciones: 'Baja profundo manteniendo el talón apoyado.'
  },
  {
    nombre: 'Prensa de Piernas',
    categoria: 'Pierna',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Prensa',
    instrucciones: 'Empuja sin bloquear completamente las rodillas.'
  },
  
  // --- BRAZOS ---
   {
    nombre: 'Curl de Bíceps con Barra',
    categoria: 'Brazos',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Curl+Biceps',
    instrucciones: 'Sube la barra sin mover los codos del torso.'
  },
  {
    nombre: 'Extensiones de Tríceps en Polea',
    categoria: 'Brazos',
    imagenUrl: 'https://dummyimage.com/300x200/000/fff&text=Ext+Triceps',
    instrucciones: 'Baja la cuerda hasta extender los brazos.'
  }
];

// Extraemos la lista de categorías únicas para las pestañas (Tabs)
// Esto genera automáticamente: ['Pecho', 'Espalda', 'Pierna', 'Brazos']
export const CATEGORIAS_UNICAS = [...new Set(CATALOGO_EJERCICIOS.map(e => e.categoria))];