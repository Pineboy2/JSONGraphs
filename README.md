# Pokemon TCG Data Viewer

Pokemon is a worldwide recognised trading card game and therefore has large market appeal. This webpage allows the user to access and visualise in depth data on cards in the popular Pokemon Trading Card Game.
 
## UX

Aimed at players, collectors and fans of the game eager to increase their in depth knowledge.
There is data on card categories, type, range, and rarity of the cards.
For those with particular interests in the artwort, the data allows the user to view how frequently the artists were commisioned and when.

- As a fan I want to see what sets my favourite artist has had art in. 
  I can do this by using the stacked bar chart "Artists per set"

- As a collector I want to ensure I have all the cards in a set.
  I can do this by filtering the graphs.
 
- As a player I want to see which cards are useful.
  I can do this by looking at the HP vs Retreat Cost graph

## Features

- Coloured Graphs allowing users to filter by specific data including:
  - Bar Chart
  - Stacked Chart
  - Pie Chart
  - Line Graph

- Reset button to remove all filters

## Technologies Used

- [JQuery](https://jquery.com)
    - The project uses **JQuery** to simplify DOM manipulation.

- [D3.js](https://d3js.org/)
    - The project uses **D3.js** to simplify creation of graphs.

- [Crossfilter](https://square.github.io/crossfilter/)
    - The project uses **Crossfilter** to simplify creation of datasets.

- [DC.js](https://dc-js.github.io/dc.js/)
    - The project uses **DC.js** to enhance D3.js.

- [Bootstrap](https://getbootstrap.com/)
    - The project uses **Bootstrap** to simplify layout of the webpage.


## Testing

This webpage has been tested by an indepentent body and all functions and interactivity work. 

## Deployment

Code is stored on github and hosted on github pages. There is no difference between the deployed and development versions.

## Credits

- The data for the cards was downloaded from the PokemonTCG [GitHub](https://github.com/PokemonTCG/pokemon-tcg-data)
