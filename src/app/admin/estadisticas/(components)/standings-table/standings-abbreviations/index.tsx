import styles from './styles.module.css';

export const StandingsAbbreviations = () => {
  return (
    <section className={styles.standingsAbbreviations}>
      <div>
        <div className={styles.data}>
          <span className={styles.dataHead}>JJ</span>
          <span className={styles.dataCell}>Juegos Jugados</span>
        </div>
        <div className={styles.data}>
          <span className={styles.dataHead}>JG</span>
          <span className={styles.dataCell}>Juegos Ganados</span>
        </div>
      </div>
      <div>
        <div className={styles.data}>
          <span className={styles.dataHead}>JG</span>
          <span className={styles.dataCell}>Juegos Empatados</span>
        </div>
        <div className={styles.data}>
          <span className={styles.dataHead}>JP</span>
          <span className={styles.dataCell}>Juegos Perdidos</span>
        </div>
      </div>
      <div>
        <div className={styles.data}>
          <span className={styles.dataHead}>GF</span>
          <span className={styles.dataCell}>Goles a Favor</span>
        </div>
        <div className={styles.data}>
          <span className={styles.dataHead}>GC</span>
          <span className={styles.dataCell}>Goles en Contra</span>
        </div>
      </div>
      <div>
        <div className={styles.data}>
          <span className={styles.dataHead}>DIF</span>
          <span className={styles.dataCell}>Diferencia de Goles</span>
        </div>
        <div className={styles.data}>
          <span className={styles.dataHead}>PTS</span>
          <span className={styles.dataCell}>Puntos</span>
        </div>
      </div>
      <div>
        <div className={styles.data}>
          <span className={styles.dataHead}>PTA</span>
          <span className={styles.dataCell}>Puntos Adicionales</span>
        </div>
        <div className={styles.data}>
          <span className={styles.dataHead}>PTT</span>
          <span className={styles.dataCell}>Puntos Totales</span>
        </div>
      </div>
    </section>
  );
};
