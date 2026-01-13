'use client';

import { useEffect, type FC } from 'react';
import { redirect } from 'next/navigation';
import "./styles.css";
import Link from 'next/link';

type Props = Readonly<{
  tournament?: string;
  category?: string;
  format?: string;
}>;

export const MatchesTable: FC<Props> = ({
  tournament,
  category,
  format,
}) => {
  if (!tournament || !category || !format) {
    redirect(`/resultados?error=${encodeURIComponent('¡ El torneo, categoría y formato son obligatorios !')}`);
  }

  // const { ok, message, matches } = await fetchResultsAction(tournament, category, format);

  // if (!ok) {
  //   redirect(`/resultados?error=${encodeURIComponent(message)}`);
  // }

  useEffect(() => {
    const cells = document.querySelectorAll('table tbody td[data-match]:not([data-match=""])');

    cells.forEach(cell => {
      cell.addEventListener('mouseenter', () => {
        const matchId = cell.getAttribute('data-match');
        if (matchId) {
          const allMatchCells = document.querySelectorAll(`table tbody td[data-match="${matchId}"]`);
          allMatchCells.forEach(c => {
            c.classList.add('highlight-match');
            // Add underline to both team names
            const row = c.closest('tr');
            if (row) {
              const teamLabel = row.querySelector('td[data-row-label]');
              if (teamLabel) {
                teamLabel.classList.add('highlight-team');
              }
            }
          });
        }
      });

      cell.addEventListener('mouseleave', () => {
        const matchId = cell.getAttribute('data-match');
        if (matchId) {
          const allMatchCells = document.querySelectorAll(`table tbody td[data-match="${matchId}"]`);
          allMatchCells.forEach(c => {
            c.classList.remove('highlight-match');
            // Remove underline from both team names
            const row = c.closest('tr');
            if (row) {
              const teamLabel = row.querySelector('td[data-row-label]');
              if (teamLabel) {
                teamLabel.classList.remove('highlight-team');
              }
            }
          });
        }
      });
    });
  }, []);

  return (
    <div className="table-scroll">
      <table>
        <thead>
          <tr>
            <th>Equipos</th>
            <th>&nbsp;</th>
            <th>1</th>
            <th>2</th>
            <th>3</th>
            <th>4</th>
            <th>5</th>
            <th>6</th>
            <th>7</th>
            <th>8</th>
            <th>9</th>
            <th>10</th>
          </tr>
        </thead>
        <tbody>
          <tr data-row="1" data-team="1">
            <td data-row-label>
              <Link href="#" target="_blank">
                Colegio Guadalajara
              </Link>
            </td>
            <td className="position">1</td>
            <td data-col="1" className="empty"></td>
            <td data-col="2" data-match="1-2" className="status-finished">2 - 0</td>
            <td data-col="3" data-match="1-3" className="status-finished">3 - 2</td>
            <td data-col="4" data-match="1-4" className="status-finished">2 - 2</td>
            <td data-col="5" data-match="1-5" className="status-finished">2 - 0</td>
            <td data-col="6" data-match="1-6" className="status-finished">2 - 1</td>
            <td data-col="7" data-match="1-7" className="status-finished">0 - 2</td>
            <td data-col="8" data-match="1-8" className="status-finished">4 - 2</td>
            <td data-col="9" data-match="1-9" className="status-finished">0 - 3</td>
            <td data-col="10" data-match="1-10" className="status-finished">2 - 2</td>
          </tr>
          <tr data-row="2" data-team="2">  
            <td data-row-label>
              <Link href="#" target="_blank">
                Colegio Altamira
              </Link>
            </td>
            <td className="position">2</td>
            <td data-col="1" data-match="1-2" className="status-finished">0 - 2</td>
            <td data-col="2" className="empty"></td>
            <td data-col="3" data-match="2-3" className="status-finished">3 - 2</td>
            <td data-col="4" data-match="2-4" className="status-finished">1 - 0</td>
            <td data-col="5" data-match="2-5" className="status-finished">5 - 2</td>
            <td data-col="6" data-match="2-6" className="status-finished">4 - 3</td>
            <td data-col="7" data-match="2-7" className="status-finished">2 - 2</td>
            <td data-col="8" data-match="2-8" className="status-finished">3 - 2</td>
            <td data-col="9" data-match="2-9" className="status-finished">0 - 1</td>
            <td data-col="10" data-match="2-10" className="status-finished">2 -3</td>
          </tr>
          <tr data-row="3" data-team="3">
            <td data-row-label>
              <Link href="#" target="_blank">
                Club Warriors
              </Link>
            </td>
            <td className="position">3</td>
            <td data-col="1" data-match="1-3" className="status-finished">2 - 3</td>
            <td data-col="2" data-match="2-3" className="status-finished">2 - 3</td>
            <td data-col="3" className="empty"></td>
            <td data-col="4" data-match="3-4" className="status-finished">5 - 2</td>
            <td data-col="5" data-match="3-5" className="status-finished">4 - 0</td>
            <td data-col="6" data-match="3-6" className="status-finished">2 - 3</td>
            <td data-col="7" data-match="3-7" className="status-finished">0 - 1</td>
            <td data-col="8" data-match="3-8" className="status-finished">1 - 1</td>
            <td data-col="9" data-match="3-9" className="status-finished">0 - 2</td>
            <td data-col="10" data-match="3-10" className="status-finished">2 - 3</td>
          </tr>
          <tr data-row="4" data-team="4">
            <td data-row-label>
              <Link href="#" target="_blank">
                Leones Negros
              </Link>
            </td>
            <td className="position">4</td>
            <td data-col="1" data-match="1-4" className="status-finished">2 - 2</td>
            <td data-col="2" data-match="2-4" className="status-finished">0 - 1</td>
            <td data-col="3" data-match="3-4" className="status-finished">2 - 5</td>
            <td data-col="4" className="empty"></td>
            <td data-col="5" data-match="4-5" className="status-finished">3 - 3</td>
            <td data-col="6" data-match="4-6" className="status-finished">2 -5</td>
            <td data-col="7" data-match="4-7" className="status-finished">1 - 2</td>
            <td data-col="8" data-match="4-8" className="status-finished">4 - 2</td>
            <td data-col="9" data-match="4-9" className="status-finished">2 - 0</td>
            <td data-col="10" data-match="4-10" className="status-finished">1 - 1</td>
          </tr>
          <tr data-row="5" data-team="5">
            <td data-row-label>
              <Link href="#" target="_blank">
                Cimarrones
              </Link>
            </td>
            <td className="position">5</td>
            <td data-col="1" data-match="1-5" className="status-finished">0 - 2</td>
            <td data-col="2" data-match="2-5" className="status-finished">2 - 5</td>
            <td data-col="3" data-match="3-5" className="status-finished">0 - 4</td>
            <td data-col="4" data-match="4-5" className="status-finished">3 - 3</td>
            <td data-col="5" className="empty"></td>
            <td data-col="6" data-match="5-6" className="status-finished">2 - 0</td>
            <td data-col="7" data-match="5-7" className="status-finished">4 - 2</td>
            <td data-col="8" data-match="5-8" className="status-finished">3 - 0</td>
            <td data-col="9" data-match="5-9" className="status-finished">2 - 1</td>
            <td data-col="10" data-match="5-10" className="status-finished">1 - 2</td>
          </tr>
          <tr data-row="6" data-team="6">
            <td data-row-label>
              <Link href="#" target="_blank">
                Colegio Tepeyac
              </Link>
            </td>
            <td className="position">6</td>
            <td data-col="1" data-match="1-6" className="status-finished">1 - 2</td>
            <td data-col="2" data-match="2-6" className="status-finished">3 - 4</td>
            <td data-col="3" data-match="3-6" className="status-finished">3 - 2</td>
            <td data-col="4" data-match="4-6" className="status-finished">5 - 2</td>
            <td data-col="5" data-match="5-6" className="status-finished">0 - 2</td>
            <td data-col="6" className="empty"></td>
            <td data-col="7" data-match="6-7" className="status-finished">2 - 0</td>
            <td data-col="8" data-match="6-8" className="status-finished">1 - 1</td>
            <td data-col="9" data-match="6-9" className="status-finished">0 - 2</td>
            <td data-col="10" data-match="6-10" className="status-finished">3 - 3</td>
          </tr>
           <tr data-row="7" data-team="7">
            <td data-row-label>
              <Link href="#" target="_blank">
                Halcones Dorados
              </Link>
            </td>
            <td className="position">7</td>
            <td data-col="1" data-match="1-7" className="status-finished">2 - 0</td>
            <td data-col="2" data-match="2-7" className="status-finished">2 - 2</td>
            <td data-col="3" data-match="3-7" className="status-finished">1 - 0</td>
            <td data-col="4" data-match="4-7" className="status-finished">2 - 1</td>
            <td data-col="5" data-match="5-7" className="status-finished">2 - 4</td>
            <td data-col="6" data-match="6-7" className="status-finished">0 - 2</td>
            <td data-col="7" className="empty"></td>
            <td data-col="8" data-match="7-8" className="status-finished">1 - 0</td>
            <td data-col="9" data-match="7-9" className="status-finished">2 - 2</td>
            <td data-col="10" data-match="7-10" className="status-finished">2 - 1</td>
          </tr>
          <tr data-row="8" data-team="8">
            <td data-row-label>
              <Link href="#" target="_blank">
                Educare
              </Link>
            </td>
            <td className="position">8</td>
            <td data-col="1" data-match="1-8" className="status-finished">2 - 4</td>
            <td data-col="2" data-match="2-8" className="status-finished">2 - 3</td>
            <td data-col="3" data-match="3-8" className="status-finished">1 - 1</td>
            <td data-col="4" data-match="4-8" className="status-finished">2 - 4</td>
            <td data-col="5" data-match="5-8" className="status-finished">0 - 3</td>
            <td data-col="6" data-match="6-8" className="status-finished">1 - 1</td>
            <td data-col="7" data-match="7-8" className="status-finished">0 - 1</td>
            <td data-col="8" className="empty"></td>
            <td data-col="9" data-match="8-9" className="status-finished">2 - 1</td>
            <td data-col="10" data-match="8-10" className="status-finished">2 - 3</td>
          </tr>
          <tr data-row="9" data-team="9">
            <td data-row-label>
              <Link href="#" target="_blank">
                Club Country
              </Link>
            </td>
            <td className="position">9</td>
            <td data-col="1" data-match="1-9" className="status-finished">3 - 0</td>
            <td data-col="2" data-match="2-9" className="status-finished">1 - 0</td>
            <td data-col="3" data-match="3-9" className="status-finished">2 - 0</td>
            <td data-col="4" data-match="4-9" className="status-finished">0 - 2</td>
            <td data-col="5" data-match="5-9" className="status-finished">1 - 2</td>
            <td data-col="6" data-match="6-9" className="status-finished">2- 0</td>
            <td data-col="7" data-match="7-9" className="status-finished">2 - 2</td>
            <td data-col="8" data-match="8-9" className="status-finished">1 - 2</td>
            <td data-col="9" className="empty"></td>
            <td data-col="10" data-match="9-10" className="status-finished">5 - 4</td>
          </tr>
          <tr data-row="10" data-team="10">
            <td data-row-label>
              <Link href="#" target="_blank">
                Colegio La Cima
              </Link>
            </td>
            <td className="position">10</td>
            <td data-col="1" data-match="1-10" className="status-finished">2 - 2</td>
            <td data-col="2" data-match="2-10" className="status-finished">3 - 2</td>
            <td data-col="3" data-match="3-10" className="status-finished">3 - 2</td>
            <td data-col="4" data-match="4-10" className="status-finished">1 - 1</td>
            <td data-col="5" data-match="5-10" className="status-finished">2 - 1</td>
            <td data-col="6" data-match="6-10" className="status-finished">3 - 3</td>
            <td data-col="7" data-match="7-10" className="status-finished">1 - 2</td>
            <td data-col="8" data-match="8-10" className="status-finished">3 - 2</td>
            <td data-col="9" data-match="9-10" className="status-finished">4 - 5</td>
            <td data-col="10" className="empty"></td>
          </tr>
        </tbody>
      </table>

      <section className="status">
        <div className="status-item">
          <span>programado</span>
          <span className="status-color status-scheduled" />
        </div>
        <div className="status-item">
          <span>en progreso</span>
          <span className="status-color status-in_progress" />
        </div>
        <div className="status-item">
          <span>cancelado</span>
          <span className="status-color status-canceled" />
        </div>
        <div className="status-item">
          <span>pospuesto</span>
          <span className="status-color status-postposed" />
        </div>
        <div className="status-item">
          <span>finalizado</span>
          <span className="status-color status-finished" />
        </div>
      </section>
    </div>
  );
};

export default MatchesTable;
