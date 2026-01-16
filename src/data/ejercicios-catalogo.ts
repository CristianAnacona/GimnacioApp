// src/app/data/ejercicios-catalogo.ts

import { D } from "@angular/cdk/keycodes";

// Definimos cómo se ve un ejercicio base
export interface EjercicioBase {
  nombre: string;
  imagenUrl: string;
  categoria: string;
  gifUrl?: string;
  descripcion?: string;
  instrucciones?: string;
  tip?: string;
}
 export interface diasRutina {
  lunes: string;
  martes: string;
  miercoles: string;
  jueves: string;
  viernes: string;
  sabado: string;
  domingo: string;
}

export const DIAS_RUTINA: diasRutina = {
  lunes: 'Lunes',
  martes: 'Martes',
  miercoles: 'Miércoles',
  jueves: 'Jueves',
  viernes: 'Viernes',
  sabado: 'Sábado',
  domingo: 'Domingo'
};

// Este es tu catálogo maestro. ¡Aquí añadirás todos los ejercicios que ofreces!
export const CATALOGO_EJERCICIOS: EjercicioBase[] = [
  // --- PECHO ---
  {
    nombre: 'Press Banca Plano',
    categoria: 'Pecho',
    imagenUrl: 'ejercicios/pechoImagenes/press.jpeg',
    gifUrl: 'ejercicios/pechoGif/press-plano.gif',
    descripcion: 'Acuéstate en un banco plano, baja la barra al pecho y empuja hacia arriba...',
    tip: 'Mantén los pies firmes en el suelo para mayor estabilidad.'

  },
  {
  nombre: 'Press Inclinado con Mancuernas',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/press_inclinado-mancuernas.jpeg',
  gifUrl: 'ejercicios/pechoGif/press_inclinado-mancuernas.gif',
  descripcion: 'Acuéstate en un banco inclinado entre 30 y 45 grados, sosteniendo una mancuerna en cada mano a la altura del pecho. Empuja las mancuernas hacia arriba siguiendo una trayectoria ligeramente diagonal hasta que los brazos estén casi extendidos. Baja de forma controlada manteniendo tensión constante en el pecho superior.',
  tip: 'Evita juntar completamente las mancuernas arriba para no perder tensión en el pecho.'
},
  {
    nombre: 'Aperturas con Mancuernas',
    categoria: 'Pecho',
    imagenUrl: 'ejercicios/pechoImagenes/aperturas-mancuernas.jpeg',
    gifUrl: 'ejercicios/pechoGif/aperturas-mancuernas.gif',
    descripcion: 'Acuéstate en un banco plano con una mancuerna en cada mano, abre los brazos y empuja  hacia arriba...',
    tip: 'No bloquees los codos al final del movimiento.'
  },
{
  nombre: 'Aperturas en Máquina',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/aperturas-maquina.jpeg',
  gifUrl: 'ejercicios/pechoGif/aperturas-maquina.gif',
  descripcion: 'Siéntate en la máquina con la espalda completamente apoyada en el respaldo. Coloca los brazos en las almohadillas y junta lentamente las palancas al frente contrayendo el pecho. Regresa de forma controlada hasta sentir un estiramiento cómodo en los pectorales.',
  tip: 'Concéntrate en apretar el pecho al final del movimiento, no en empujar con los brazos.'
},
{
  nombre: 'Press Plano con Mancuernas',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/press-plano-mancuernas.jpeg',
  gifUrl: 'ejercicios/pechoGif/press-plano-mancuernas.gif',
  descripcion: 'Acuéstate en un banco plano con una mancuerna en cada mano apoyada a los lados del pecho. Empuja las mancuernas hacia arriba hasta casi extender los brazos y baja lentamente manteniendo el control del movimiento durante todo el recorrido.',
  tip: 'Mantén los hombros retraídos y apoyados en el banco para proteger la articulación.'
},
{
  nombre: 'Fondos en Paralelas',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/fondos-paralelas.jpeg',
  gifUrl: 'ejercicios/pechoGif/fondos-paralelas.gif',
  descripcion: 'Colócate en las paralelas con los brazos extendidos. Flexiona los codos bajando el cuerpo ligeramente inclinado hacia adelante hasta que sientas un estiramiento en el pecho. Empuja hacia arriba activando los pectorales para regresar a la posición inicial.',
  tip: 'Inclina el torso hacia adelante para enfatizar el trabajo en el pecho y no en los tríceps.'
},
{
  nombre: 'Press Inclinado en Máquina Smith',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/press-inclinado-smith.jpeg',
  gifUrl: 'ejercicios/pechoGif/press-inclinado-smith.gif',
  descripcion: 'Ajusta el banco inclinado bajo la barra de la máquina Smith. Baja la barra de forma controlada hasta la parte superior del pecho y empuja hacia arriba siguiendo el recorrido guiado de la máquina, manteniendo siempre el control del movimiento.',
  tip: 'Coloca los pies firmes en el suelo y evita bloquear los codos al subir.'
},
{
  nombre: 'Press Plano en Máquina',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/press-plano-maquina.jpeg',
  gifUrl: 'ejercicios/pechoGif/press-plano-maquina.gif',
  descripcion: 'Siéntate en la máquina de press plano con la espalda completamente apoyada en el respaldo y los pies firmes en el suelo. Sujeta las empuñaduras a la altura del pecho y empuja hacia adelante hasta casi extender los brazos. Regresa lentamente a la posición inicial controlando el movimiento y manteniendo la tensión constante en los músculos pectorales.',
  tip: 'No bloquees los codos al final del recorrido y mantén los hombros apoyados para evitar sobrecargas.'
},
{
  nombre: 'Press Inclinado en Máquina',
  categoria: 'Pecho',
  imagenUrl: 'ejercicios/pechoImagenes/press-inclinado-maquina.jpeg',
  gifUrl: 'ejercicios/pechoGif/press-inclinado-maquina.gif',
  descripcion: 'Ajusta el asiento de la máquina para que las empuñaduras queden alineadas con la parte superior del pecho. Empuja los brazos hacia adelante y ligeramente hacia arriba hasta casi extenderlos. Baja de forma controlada, enfocándote en el trabajo del pecho superior durante todo el movimiento.',
  tip: 'Mantén el pecho elevado y la espalda bien apoyada para una mejor activación del pectoral superior.'
},
// FIN PECHO

  // --- ESPALDA ---
  {
    nombre: 'Jalón al Pecho',
    categoria: 'Espalda',
    imagenUrl: 'ejercicios/espaldaImagenes/jalon-pecho.jpeg',
    gifUrl: 'ejercicios/espaldaGif/jalon-pecho.gif',
    descripcion: 'Siéntate en la máquina de jalones con las rodillas aseguradas bajo los soportes. Agarra la barra con un agarre amplio y tira de ella hacia la parte superior del pecho, manteniendo la espalda recta y los codos apuntando hacia abajo. Regresa lentamente a la posición inicial controlando el movimiento.',
    tip: 'Evita balancear el cuerpo para maximizar el trabajo en los dorsales.'
  },
  {
    nombre: 'Remo con Barra',
    categoria: 'Espalda',
    imagenUrl: 'ejercicios/espaldaImagenes/remo-barra.jpeg',
    gifUrl: 'ejercicios/espaldaGif/remo-barra.gif',
    descripcion: 'Agarra una barra con un agarre cerrado y tira de ella hacia el abdomen manteniendo la espalda recta. Asegúrate de que los codos estén apuntando hacia atrás durante todo el movimiento.',
    tip: 'Mantén la espalda recta y evita mover el cuerpo para enfocar el trabajo en los dorsales.'
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
