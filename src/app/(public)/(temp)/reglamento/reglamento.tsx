import type { FC } from 'react';
import type { Metadata } from 'next/types';
import "./styles.css";
import { FaWhatsapp } from 'react-icons/fa6';

export const metadata: Metadata = {
  title: 'Reglamento',
  description: '',
  robots: 'index, follow',
};

export const ContactPage: FC = () => {
  return (
    <div className="wrapper justify-start dark:bg-gray-600/20!">
      <h1 className="level-1">REGLAMENTO</h1>

      <h2 className="level-2">REGLAS BÁSICAS</h2>

      <p className="text">
        El reglamento de juego será vigente de la federación mexicana de futbol,
        salvo las siguientes adecuaciones:
      </p>

      <ul className="list">
        <li>No existe el fuera de lugar.</li>
        <li>En las categorías femenil primaria mayor y menos 2016-17-18 kinder 2019 el saque de meta lo pueden realizar desde el piso o mediante un despeje aéreo.</li>
        <li>Los cambios son ilimitados.</li>
        <li>Los saques de manos en las categorías 2012 y menores se repetirán máximo 2 ocasiones, en caso de realizarlo de manera incorrecta por el mismo jugador, si lo realiza las dos ocasiones incorrectamente parará la posesión al otro equipo.</li>
        <li>Las faltas cometidas con la mano serán sancionadas en las categorías 2018 y menores si solo existe la <strong><i>INTENCIÓN DE TOMAR EL BALÓN</i></strong> (por ser etapa inicial existe el reflejo de levantar los brazos si existe contacto <strong><i>NO SERÁ MARCADA</i></strong> la falta por no ser intencionada).</li>
      </ul>

      <h2 className="level-2">SISTEMA DE COMPETENCIA</h2>

      <p className="text">Se jugará todos contra todos, hasta completar los juegos correspondientes por torneo.</p>

      <h3 className="level-3">Torneo: Septiembre - Enero</h3>

      <ul className="sub-list">
        <li>12 juegos máximo.</li>
        <li>15 juegos máximo.</li>
      </ul>

      <h3 className="level-3">Torneo: Febrero - Junio</h3>

      <ul className="sub-list">
        <li>12 juegos máximo.</li>
        <li>15 juegos máximo.</li>
      </ul>

      <p className="text">La cantidad de juegos será determinada por el número de equipos participantes.</p>

      <h2 className="level-2">DECRETOS</h2>

      <p className="text">Se decretará via app <span className="text-emerald-500 italic font-semibold">WhatsApp <FaWhatsapp className="inline" /></span>, mediante los grupos por categoría o vía telefónica con los delegados de categoría.</p>

      <p className="text">Se publicará los decretos, resultados y estadísticas en la app Winner y solicitamos enviar el aviso al decreto como mínimo 2 días previos al partido.</p>

      <p className="text">Si se da aviso del decreto el mismo día del partido, la liga <strong><i>NO ASIGNARÁ ARBITRO.</i></strong></p>

      <p className="text">Solo en caso de que el rival en turno no pueda jugar, se podrá adelantar jornada ó buscar otro rival, solo si no interfiere en el rol de otro equipo.</p>

      <h2 className="level-2">ROL DE JUEGOS</h2>

      <p className="text text-xl! font-semibold!">El número de localias ó visitas en el rol de juego de los equipos en la primera vuelta está determinado bajo los siguientes criterios:</p>

      <ul className="list">
        <li>Calidad de la sede (campo empastado ó sintético)</li>
        <li>Participación en la liga (ambigüedad)</li>
        <li>Pronto Pago</li>
        <li>Equipo que se niegue a visitar o que en un lapso no mayor a 3 jornadas no decrete un partido pendiente de jornada anterior, perderá por default 2-0.</li>
        <li>Equipo que modifique el decreto más de 2 veces en horario y día de juego perderá la localía y la sedera al equipo afectado.</li>
      </ul>

      <p className="text text-xl! font-semibold!">&quot;ES RESPONSABILIDAD DE LOS EQUIPOS DECRETAR SUS PARTIDOS EN TIEMPO Y FORMA&ldquo;</p>

      <h2 className="level-2">DURACIÓN</h2>

      <ul className="list">
        <li>La duración del juego será para la categoría 2015 y menores será de 20 minutos por cada tiempo y 5 minutos de descanso.</li>
        <li>La duración del juego para categoría 2014 y mayores será de 25 minutos por cada tiempo y minutos de descanso.</li>
        <li>El tiempo de espera para los equipos es de 15 minutos, después de ese tiempo se perderá el juego con marcador de 2 goles a cero.</li>
        <li>En caso de inicial el partido en el margen de los 15 minutos de espera no habrá descanso, solo hidratación y cambio de cancha.</li>
        <li>En caso de que el equipo llegue después de los 15 minutos de tolerancia se contará como tiempo perdido y se jugará a un solo tiempo si está dentro del parámetros de la duración de juego y no contará el resultado y solo si el equipo que esperó lo considera prudente.</li>
      </ul>

      <h2 className="level-2">BALÓN DE JUEGO</h2>

      <p className="text text-xl! font-semibold!">Los balones de juego para las categorías son:</p>

      <ul className="list">
        <li>N° 3 y 4 Categoría Kinder 2019 y 2018</li>
        <li>N° 4 y 5 Categoría 2017, 2016 y 2015</li>
        <li>N° 5 Categoría 2014, 2013, 2012, 2011 y 2010</li>
        <li>Cada equipo deberá presentar un balón en condiciones aptas para juego con las medidas antes señaladas.</li>
      </ul>

      <h2 className="level-2">EMPATES</h2>

      <ul className="list">
        <li>Terminando el tiempo reglamentario y al permanecer empatados, los dos equipos se concederán 3 tiros penales por equipo para el desempate.</li>
        <li>Si continúa el empate pasaran a muerte súbita hasta que exista un ganador.</li>
        <li>Solo podrán tirar penales los niños que terminaron jugando el partido.</li>
        <li>Podrán hacer cambio de portero en los tiros penales.</li>
      </ul>

      <h2 className="level-2">SUSPENSIÓN DE JUEGO</h2>

      <ul className="list">
        <li>Solo se podrá cancelar el juego autorizado por la liga con 2 días como mínimo previas al juego, notificando primeramente al equipo rival y posteriormente a la liga, asi pues, reprogramándolo en un lapso no mayor a 15 días.<br />Tomando en cuenta que se pierde la localía en caso dde ser el local quien cancele el partido y no lo decrete nuevamente en ese lapso.</li>
        <li>Si el equipo visitante ó local cancela el mismo día del juego, perderá el partido y contará como jugado. <small><i>(a consideración del equipo afectado su reprogramación.)</i></small></li>
        <li>En caso de lluvia abundante ó prolongada el día anterior por cuidado del pasto natural ó el mismo día de partido se suspenderá el juego a consideración del equipo local y dependiendo de las condiciones en que se encuentre la cancha, así pues se renueva ese día ó si se reprograma en otra fecha.</li>
        <li>En caso de inicial el partido y suspenderlo por lluvia abundante por decisión de entrenadores y árbitro antes de los 15 minutos de juego <strong>NO</strong> contará como jugado y se volverá a reprograma.</li>
      </ul>

      <h2 className="level-2">SUSPENSIÓN DE JUEGO</h2>

      <ul className="list">
        <li>En caso de inicial el partido y suspenderlo por lluvia abundante por decisión de entrenadores y árbitros después de los 15 minutos de juego el partido contará como jugado y se respetará el marcador hasta el momento, si es empate se repartirá 1 punto a cada equipo.</li>
        <li>El tiempo de espera para reanudar un partido en caso de lluvia abundante es de 10 minutos.</li>
        <li>La liga determinará suspensión de juego solo en caso de fenómenos naturales o situaciones ajenas que afecten la integridad y seguridad. (sismos, contingencia ambiental, etc.)<br />Notificando de manera oficial mediante comunicado.</li>
      </ul>

      <h2 className="level-2">SEDES</h2>

      <p className="text">Es responsabilidad de los equipo participantes presentar cancha de futbol en condiciones aceptables y medidas aptas para juego de acuerdo a la categoría que compute.</p>

      <p className="text">Así como también si es pasto natural ó pasto artificial, con los señalamientos correspondientes:</p>

      <ul className="list">
        <li>Líneas de meta</li>
        <li>Líneas laterales</li>
        <li>Área de penal</li>
        <li>Línea media cancha y punto de saque inicial</li>
        <li>Así como porterías con medidas para las edades de juego, con redes debidamente instaladas.</li>
        <li>En caso de <strong>NO</strong> contar con lo antes señalado la liga determinará el no seguir asignando el derecho como sede a dicha cancha de fútbol.</li>
      </ul>

      <p className="text">La liga menor se reserva el derecho de admisión ó baja del torneo basándose en el mal comportamiento de entrenadores, jugadores ó porra de los equipos.</p>

      <p className="text text-center">LAS DESICIONES TOMADAS POR EL ARBITRO son INAPELABLES.</p>

      <p className="text text-center">EL COMITÉ ORGANIZADOR DETERMINARÁ LAS SANCIONES Y VARIABLES QUE SE PRESENTEN.</p>

      <h2 className="level-2">EXTRAS</h2>

      <p className="text">La distancia entre el balón y el jugador en caso de saque inicial, saque de meta ó falta, será de 7 pasos en caso de no tener un señalamiento basado en líneas y serán determinados por el árbitro, solo así se reanudará el balón en juego nuevamente.</p>

      <p className="text">En formato 7 vs 7 todas las faltas son tiros libres directos.</p>

      <p className="text">Las tarjetas amarillas no son acumulables, en caso de existir expulsado, podrá jugar el siguiente juego solo si es por doble amarilla.</p>

      <p className="text">En caso de existir roja directa por agresión ó insultos tendrá dos partidos de suspensión.</p>
    </div>
  );
};

export default ContactPage;
