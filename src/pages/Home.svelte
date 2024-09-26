<script>
  import { onMount } from "svelte";
  import { GameState } from "../lib/GameState";
  let canvas,
    ctx,
    gap = 60,
    size = 4,
    initialVertex = { x: 50, y: 50 },
    state = new GameState(initialVertex, size, gap),
    edges = Object.values(state.edges);

  state.generateVertices();
  state.generateBoxes();
  console.log(state.boxes);
  //   state.getAvailableMoves();
  const draw = () => {
      for (let box of state.boxes) {
        for (let edge of Object.values(box.edges)) {
          let { from, to, drawn, c } = edge,
            textCenter = {
              x: (from.x + to.x) / 2,
              y: (from.y + to.y) / 2,
            };
          ctx.fillStyle = "black";
          ctx.beginPath();
          ctx.arc(from.x, from.y, 5, 0, 2 * Math.PI);
          ctx.arc(to.x, to.y, 5, 0, 2 * Math.PI);
          ctx.closePath();
          ctx.fill();
          if (box.complete) {
            ctx.fillStyle = "black";
            ctx.font = "30px serif";
            ctx.textAlign = "center";
            ctx.fillText(box.player, textCenter.x, textCenter.y);
          }
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
      state.playBestMove();
      draw();
    };
  onMount(() => {
    ctx = canvas.getContext("2d");
    edges = Object.values(state.edges);
    draw();
  });
</script>

<div style="width: 300px; display:flex; flex-direction:column; gap: 10px">
  <button on:click={makeMove}>make move</button>
  {#each edges as edge, index}
    {#if !edge.drawn}
      <button
        on:click={() => {
          state.makeMove(edge);
          edges = Object.values(state.edges);
          draw();
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
