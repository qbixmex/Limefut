# Game Rules

## Matches Played

Once a match is finished, regardless of the score, the standings must be updated and the
Matches Played counter must be incremented for each team that played the match.

## Wins

For every completed match, if one of the two teams wins, its Wins count and its points must
be increased.

## Draws

For every completed match in which both teams draw, each team must increase its Draws count
and its points.

## Losses

When a match is completed, the team that loses must increase its Losses count in the standings.

## Goals For

For every match, all goals scored by the local and visitor teams must be added to their
respective standings.

For example, in `Cruz Azul 3 vs 2 Atlas`, if Cruz Azul already has 10 goals, then 3 more goals
are added: 10 + 3 = 13, so Cruz Azul must have 13 Goals For in its standings.

For Atlas, if its standings show 8 goals, then 2 more goals are added: 8 + 2 = 10, so Atlas
must have 10 Goals For.

## Goals Against

For every match, the goals conceded by each team must be added to its Goals Against count.

For example, in `Pumas 2 vs 3 Chivas`, Pumas conceded 3 goals, so if its standings show 10,
then 3 more goals are added: 10 + 3 = 13 Goals Against.

For Chivas, if its standings show 8 Goals Against, then 8 + 2 = 10 Goals Against.

## Goals Difference

For every finished match, after updating Goals For and Goals Against, the Goals Difference must
be calculated as Goals For minus Goals Against.

## Additional Points

For every match, an extra point may be awarded, but it is not mandatory; a penalty shootout may
be played to decide it.

Each team must take 3 shots, and the winning team earns an extra point.

If the penalty shootout ends level after the 6 shots (3 per team), additional shots must be
taken in pairs until one team misses and the other scores.

## Points

When a match finishes and one team wins, for example `Chivas 2 vs 0 América`, then Chivas wins
and 3 points are added to the standings table.

Otherwise, if the result is the opposite — for example `Chivas 0 vs 2 América` — then América
wins and 3 points are added to the standings table.

## Total Points

For every completed match, the Total Points must be calculated by adding Points plus
Additional Points.
