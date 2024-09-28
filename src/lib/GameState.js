import { uuid } from "./utils";
export class GameState {
  constructor(initialVertex, size, gap) {
    this.size = size;
    this.gap = gap;
    this.initialVertex = initialVertex;
    this.vertices = [];
    this.boxes = [];
    this.edges = {};
    this.players = {
      current: Math.floor(Math.random() * 2),
      // moves: { 0: [], 1: [] },
      scores: { 0: 0, 1: 0 },
    };
    this.moves = [];
  }
  generateVertices() {
    let { size, initialVertex, gap } = this;
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let vertex = {
          x: initialVertex.x + col * gap,
          y: initialVertex.y + row * gap,
          idx: uuid(6),
          row: row,
          col: col,
          isOccupied: false,
          rowColKey: `${row}${col}`,
        };
        this.vertices.push(vertex);
      }
    }
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let vertex = this.vertices[row * size + col];
        if (col < size - 1) {
          let rightNeighbor = this.vertices[row * size + (col + 1)];
          if (rightNeighbor) {
            let key = `${vertex.row}${vertex.col}-${rightNeighbor.row}${rightNeighbor.col}`,
              reverseKey = `${rightNeighbor.row}${rightNeighbor.col}-${vertex.row}${vertex.col}`;
            if (!this.edges[key] && !this.edges[reverseKey]) {
              this.edges[key] = {
                from: vertex,
                to: rightNeighbor,
                drawn: false,
                type: "horizontal",
                dir: "right",
                rowColKey: key,
              };
            }
          }
        }
        if (row < size - 1) {
          let belowNeighbor = this.vertices[(row + 1) * size + col];
          if (belowNeighbor) {
            let key = `${vertex.row}${vertex.col}-${belowNeighbor.row}${belowNeighbor.col}`,
              reverseKey = `${belowNeighbor.row}${belowNeighbor.col}-${vertex.row}${vertex.col}`;
            if (!this.edges[key] && !this.edges[reverseKey]) {
              this.edges[key] = {
                from: vertex,
                to: belowNeighbor,
                drawn: false,
                type: "vertical",
                dir: "down",
                rowColKey: key,
              };
            }
          }
        }
        if (col > 0) {
          let leftNeighbor = this.vertices[row * size + (col - 1)];
          if (leftNeighbor) {
            let key = `${vertex.row}${vertex.col}-${leftNeighbor.row}${leftNeighbor.col}`,
              reverseKey = `${leftNeighbor.row}${leftNeighbor.col}-${vertex.row}${vertex.col}`;
            if (!this.edges[key] && !this.edges[reverseKey]) {
              this.edges[key] = {
                from: vertex,
                to: leftNeighbor,
                drawn: false,
                type: "horizontal",
                dir: "left",
                rowColKey: key,
              };
            }
          }
        }
        if (row > 0) {
          let aboveNeighbor = this.vertices[(row - 1) * size + col];
          if (aboveNeighbor) {
            let key = `${vertex.row}${vertex.col}-${aboveNeighbor.row}${aboveNeighbor.col}`,
              reverseKey = `${aboveNeighbor.row}${aboveNeighbor.col}-${vertex.row}${vertex.col}`;
            if (!this.edges[key] && !this.edges[reverseKey]) {
              this.edges[key] = {
                from: vertex,
                to: aboveNeighbor,
                drawn: false,
                type: "vertical",
                dir: "up",
                rowColKey: key,
              };
            }
          }
        }
      }
    }
  }
  generateBoxes() {
    let { vertices, size } = this,
      boxIndex = 0;
    for (let i = 0; i < vertices.length; i++) {
      let vertex = vertices[i];
      if (vertex.col < size - 1 && vertex.row < size - 1) {
        this.createBox(vertex, vertices, boxIndex);
        boxIndex++;
      }
    }
  }
  createBox(vertex, vertices, boxIndex) {
    let { gap } = this;
    let a = vertex,
      b = { x: a.x + gap, y: a.y },
      c = { x: a.x, y: a.y + gap },
      d = { x: a.x + gap, y: a.y + gap };
    let findBIndex = vertices.findIndex((v) => v.x === b.x && v.y === b.y);
    if (findBIndex !== -1) {
      b = vertices[findBIndex];
    }
    let findCIndex = vertices.findIndex((v) => v.x === c.x && v.y === c.y);
    if (findCIndex !== -1) {
      c = vertices[findCIndex];
    }
    let findDIndex = vertices.findIndex((v) => v.x === d.x && v.y === d.y);
    if (findDIndex !== -1) {
      d = vertices[findDIndex];
    }
    let key1 = `${a.row}${a.col}-${b.row}${b.col}`,
      key2 = `${a.row}${a.col}-${c.row}${c.col}`,
      key3 = `${c.row}${c.col}-${d.row}${d.col}`,
      key4 = `${b.row}${b.col}-${d.row}${d.col}`;
    this.edges[key1] = {
      ...this.edges[key1],
      boxIndex: this.edges[key1]?.boxIndex?.length
        ? [...this.edges[key1].boxIndex, boxIndex]
        : [boxIndex],
    };
    this.edges[key2] = {
      ...this.edges[key2],
      boxIndex: this.edges[key2]?.boxIndex?.length
        ? [...this.edges[key2].boxIndex, boxIndex]
        : [boxIndex],
    };
    this.edges[key3] = {
      ...this.edges[key3],
      boxIndex: this.edges[key3]?.boxIndex?.length
        ? [...this.edges[key3].boxIndex, boxIndex]
        : [boxIndex],
    };
    this.edges[key4] = {
      ...this.edges[key4],
      boxIndex: this.edges[key4]?.boxIndex?.length
        ? [...this.edges[key4].boxIndex, boxIndex]
        : [boxIndex],
    };
    this.boxes.push({
      complete: false,
      id: boxIndex,
      drawnEdgesCount: 0,
      edges: {
        [key1]: this.edges[key1],
        [key2]: this.edges[key2],
        [key3]: this.edges[key3],
        [key4]: this.edges[key4],
      },
    });
  }
  makeMove() {
    this.takesafe3s();
    if (this.sides3()) {
      if (this.sides01()) {
        this.takeall3s();
      } else {
        this.makeSacrifice();
      }
    } else {
      // this.makeanymove();
      this.makeStrategicMove();
    }
  }

  isSafeEdge(edge) {
    let edgeBoxes = [];
    for (let box of this.boxes) {
      if (
        !box.complete &&
        box.drawnEdgesCount < 2 &&
        box.edges[edge.rowColKey] &&
        !box.edges[edge.rowColKey].drawn
      ) {
        edgeBoxes.push(box);
      }
    }
    if (edgeBoxes.length > 0) {
      return true;
    }
    return false;
  }
  findSafeEdges() {
    let safeEdges = [];
    for (let key in this.edges) {
      let edge = this.edges[key];
      if (!edge.drawn) {
        let adjacentBoxes = this.getAdjacentBoxes(edge);
        if (adjacentBoxes.every((box) => box.drawnEdgesCount < 2)) {
          safeEdges.push(edge);
        }
      }
    }
    return safeEdges;
  }

  getAdjacentBoxes(edge) {
    return edge.boxIndex.map((i) => {
      if (!this.boxes[i].complete) {
        return this.boxes[i];
      }
    });
    // return this.boxes.filter(
    //   (box, i) =>
    //     !box.complete &&
    //     box.edges[edge.rowColKey] &&
    //     !box.edges[edge.rowColKey].drawn &&
    //     box.edges[edge.rowColKey].boxIndex.includes(i)
    // );
  }

  drawEdge(edge) {
    if (this.edges[edge.rowColKey].drawn) return;
    let adjacentBoxes = this.getAdjacentBoxes(edge),
      completedBoxes = 0;
    for (let box of adjacentBoxes) {
      let edgeKey = edge.rowColKey;
      this.edges[edgeKey].from.isOccupied = true;
      this.edges[edgeKey].to.isOccupied = true;
      this.edges[edgeKey].drawn = true;
      this.edges[edgeKey].c = this.players.current === 0 ? "crimson" : "green";
      let move = {
        ...this.edges[edgeKey],
        player: this.players.current,
        prevScore: this.players.scores[this.players.current],
        currScore: this.players.scores[this.players.current],
      };
      this.boxes[box.id].edges[edgeKey] = this.edges[edgeKey];
      this.boxes[box.id].drawnEdgesCount++;
      if (this.boxes[box.id].drawnEdgesCount === 4) {
        this.boxes[box.id].complete = true;
        this.boxes[box.id].player = this.players.current;
        this.players.scores[this.players.current]++;
        move.currScore = this.players.scores[this.players.current];
        completedBoxes++;
      }
      this.moves.push(move);
    }
    if (completedBoxes > 0) {
      console.log(
        `Player ${this.players.current} completed ${completedBoxes} box(es) and gets another move.`
      );
    } else {
      this.players.current = this.players.current === 0 ? 1 : 0;
    }
    // if (this.players.current === 0) this.makeMove();
  }

  makeStrategicMove() {
    let safeEdges = this.findSafeEdges();
    if (safeEdges.length > 0) {
      this.drawEdge(safeEdges[Math.floor(Math.random() * safeEdges.length)]);
    } else {
      this.makeSacrifice();
    }
  }

  makeSacrifice() {
    for (let key in this.edges) {
      let edge = this.edges[key];
      if (!edge.drawn) {
        this.drawEdge(edge);
        break;
      }
    }
  }

  undoMove() {
    // console.log(this.moves);
    let move = this.moves[this.moves.length - 1];
    this.players.current = move.player;
    this.players.scores[this.players.current] = move.prevScore;
    this.resetEdge(move);
    this.moves = this.moves.slice(0, -1);
    // this.players.current = this.moves[this.moves.length - 1].player;
    // this.players.scores[this.players.current] =
    //   this.moves[this.moves.length - 1].prevScore;
  }
  resetEdge(edge) {
    let edgeKey = edge.rowColKey;
    this.edges[edgeKey].from.isOccupied = false;
    this.edges[edgeKey].to.isOccupied = false;
    this.edges[edgeKey].drawn = false;
    this.edges[edgeKey].c = null;
    this.edges[edgeKey].player = null;
    this.edges[edgeKey].prevScore = null;
    this.edges[edgeKey].currScore = null;

    for (let box of this.boxes) {
      if (this.boxes[box.id].edges[edgeKey]) {
        if (box.complete) box.complete = false;
        this.boxes[box.id].edges[edgeKey] = this.edges[edgeKey];
        this.boxes[box.id].drawnEdgesCount--;
      }
    }
  }
  takesafe3s() {
    // let boxes = [],
    //   edges = {};
    for (let box of this.boxes) {
      if (box.drawnEdgesCount === 3 && !box.complete) {
        let edge = Object.values(box.edges).filter((e) => !e.drawn)[0],
          adjacentBoxes = this.getAdjacentBoxes(edge);
        if (!adjacentBoxes.length) {
          this.drawEdge(edge);
        } else {
          for (let adjacentBox of adjacentBoxes) {
            if (
              adjacentBox.id !== box.id &&
              adjacentBox.drawnEdgesCount !== 2
            ) {
              this.drawEdge(edge);
            }
          }
        }
        // for (let key in box.edges) {
        //   let edge = box.edges[key];
        //   if (!edge.drawn) {
        //     if (!edges[edge.rowColKey]) {
        //       edges[edge.rowColKey] = [box];
        //     } else {
        //       edges[edge.rowColKey].push(box);
        //     }
        //     // boxes.push(box)
        //   }
        // }
      }
    }
    // return edges;
    // for (let box of this.boxes) {
    //   if (box.drawnEdgesCount === 3 && !box.complete) {
    //     for (let key in box.edges) {
    //       let edge = box.edges[key];
    //       if (!edge.drawn) {
    //         this.drawEdge(edge);
    //         break;
    //       }
    //     }
    //   }
    // }
  }
  sides3() {
    for (let box of this.boxes) {
      if (box.drawnEdgesCount === 3 && !box.complete) {
        return true;
      }
    }
    return false;
  }
  sides01() {
    for (let key in this.edges) {
      let edge = this.edges[key];
      if (!edge.drawn) {
        let adjacentBoxes = this.getAdjacentBoxes(edge);
        if (adjacentBoxes.every((box) => box.drawnEdgesCount < 2)) {
          this.drawEdge(edge);
          return true;
        }
      }
    }
    return false;
  }

  takeall3s() {
    for (let box of this.boxes) {
      if (box.drawnEdgesCount === 3 && !box.complete) {
        for (let key in box.edges) {
          let edge = box.edges[key];
          if (!edge.drawn) {
            this.drawEdge(edge);
          }
        }
      }
    }
  }
  makeanymove() {
    for (let key in this.edges) {
      let edge = this.edges[key];
      if (!edge.drawn) {
        this.drawEdge(edge);
        break;
      }
    }
  }
}
