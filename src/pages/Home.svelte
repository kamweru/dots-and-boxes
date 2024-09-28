<script>
  import { onMount } from "svelte";
  import { GameState } from "../lib/GameState";
  let canvas,
    ctx,
    gap = 60,
    size = 4,
    initialVertex = { x: 50, y: 50 },
    state = new GameState(initialVertex, size, gap),
    edges = Object.values(state.edges),
    currentPlayer = state.players.current;

  state.generateVertices();
  state.generateBoxes();
  // console.log(state.getAdjacentBoxes(state.edges["00-01"]));
  console.log(state.edges);
  //   state.getAvailableMoves();
  const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let box of state.boxes) {
        // console.log(Object.values(box.edges));
        let { from } = Object.values(box.edges)[0],
          { to } = Object.values(box.edges)[
            Object.values(box.edges).length - 1
          ],
          target = {
            x: (from.x + to.x) / 2,
            y: (from.y + to.y) / 2,
          };

        if (box.complete) {
          ctx.fillStyle = "black";
          ctx.font = "30px serif";
          ctx.textAlign = "center";
          ctx.fillText(box.player, target.x, target.y);
        }
        for (let edge of Object.values(box.edges)) {
          let { from, to, drawn, c } = edge;
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.arc(from.x, from.y, 5, 0, 2 * Math.PI);
          ctx.arc(to.x, to.y, 5, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
          if (drawn) {
            ctx.fillStyle = c;
            ctx.strokeStyle = c;
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.closePath();
            ctx.stroke();
          }
        }
      }
      // for (let i = 0; i < Object.values(state.edges).length; i++) {
      //   let { from, to, drawn, c } = Object.values(state.edges)[i];
      // ctx.fillStyle = "black";
      // ctx.beginPath();
      // ctx.arc(from.x, from.y, 5, 0, 2 * Math.PI);
      // ctx.arc(to.x, to.y, 5, 0, 2 * Math.PI);
      // ctx.closePath();
      // ctx.fill();
      // if (drawn) {
      //   ctx.fillStyle = c;
      //   ctx.strokeStyle = c;
      //   ctx.beginPath();
      //   ctx.moveTo(from.x, from.y);
      //   ctx.lineTo(to.x, to.y);
      //   ctx.closePath();
      //   ctx.stroke();
      // }
      // }
    },
    makeMove = () => {
      // state.playBestMove();
      state.makeMove();
      currentPlayer = state.players.current;
      draw();
      console.log(state.moves);
    };
  onMount(() => {
    ctx = canvas.getContext("2d");
    edges = Object.values(state.edges);
    currentPlayer = state.players.current;
    draw();
  });
</script>

<div
  style="width: 300px; display:flex; flex-direction:row; flex-wrap:wrap; justify-content:space-between; gap:10px; padding: 3px;"
>
  <div>current player: {currentPlayer}</div>
  <button on:click={makeMove}>make move</button>
  <button
    on:click={() => {
      state.undoMove();
      edges = Object.values(state.edges);
      currentPlayer = state.players.current;
      // console.log(edges);
      draw();
    }}>undo move</button
  >
  {#each edges as edge, index}
    {#if !edge.drawn}
      <button
        on:click={() => {
          state.drawEdge(edge);
          edges = Object.values(state.edges);
          currentPlayer = state.players.current;
          // console.log(state.players.current);
          draw();
          console.log(state.moves);
        }}
      >
        {edge.rowColKey} - {index}
        <!-- {state.edges[key].drawn} -->
      </button>
    {/if}
  {/each}
</div>
<div>
  <canvas width="1280" height="720" bind:this={canvas}></canvas>
</div>
