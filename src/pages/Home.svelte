<script>
  import { onMount } from "svelte";
  import { GameState } from "../lib/GameState";
  let canvas,
    ctx,
    gap = 60,
    size = 3,
    initialVertex = { x: 50, y: 50 },
    state = new GameState(initialVertex, size, gap);

  state.generateVertices();
  state.generateBoxes();
  //   state.getAvailableMoves();
  const draw = () => {
      for (let i = 0; i < Object.values(state.edges).length; i++) {
        let { from, to, drawn } = Object.values(state.edges)[i];
        ctx.beginPath();
        ctx.arc(from.x, from.y, 5, 0, 2 * Math.PI);
        ctx.arc(to.x, to.y, 5, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.fill();
        if (drawn) {
          ctx.beginPath();
          ctx.moveTo(from.x, from.y);
          ctx.lineTo(to.x, to.y);
          ctx.closePath();
          ctx.stroke();
        }
      }
    },
    makeMove = () => {
      state.playBestMove();
      draw();
    };
  onMount(() => {
    ctx = canvas.getContext("2d");
    draw();
  });
</script>

<button on:click={makeMove}>make move</button>
<canvas width="1280" height="720" bind:this={canvas}></canvas>
