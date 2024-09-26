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
      current: 0,
      moves: {
        0: [],
        1: [],
      },
      scores: {
        0: 0,
        1: 0,
      },
    };
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
          adjacent: [],
          rowColKey: `${row}${col}`,
        };
        this.vertices.push(vertex);
      }
    }

    // Step 2: Assign neighbors (right, below, left, above)
    for (let row = 0; row < size; row++) {
      for (let col = 0; col < size; col++) {
        let vertex = this.vertices[row * size + col];

        // Right neighbor (horizontal)
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
            vertex.adjacent.push({
              ...rightNeighbor,
              drawn: false,
              type: "horizontal",
              dir: "right",
              isOccupied: false,
            });
          }
        }

        // Below neighbor (vertical)
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
            vertex.adjacent.push({
              ...belowNeighbor,
              drawn: false,
              type: "vertical",
              dir: "down",
              isOccupied: false,
            });
          }
        }

        // Left neighbor (for completeness)
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
            vertex.adjacent.push({
              ...leftNeighbor,
              drawn: false,
              type: "horizontal",
              dir: "left",
              isOccupied: false,
            });
          }
        }

        // Above neighbor (for completeness)
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
            vertex.adjacent.push({
              ...aboveNeighbor,
              drawn: false,
              type: "vertical",
              dir: "up",
              isOccupied: false,
            });
          }
        }
      }
    }
  }
  generateBoxes() {
    let { vertices, size } = this;
    for (let i = 0; i < vertices.length; i++) {
      let vertex = vertices[i];
      if (vertex.col < size - 1 && vertex.row < size - 1) {
        this.createBox(vertex, vertices);
      }
    }
  }
  createBox(vertex, vertices) {
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
      boxIndex: this.boxes.length,
    };
    this.edges[key2] = {
      ...this.edges[key2],
      boxIndex: this.boxes.length,
    };
    this.edges[key3] = {
      ...this.edges[key3],
      boxIndex: this.boxes.length,
    };
    this.edges[key4] = {
      ...this.edges[key4],
      boxIndex: this.boxes.length,
    };
    let edges = {
      [key1]: this.edges[key1],
      [key2]: this.edges[key2],
      [key3]: this.edges[key3],
      [key4]: this.edges[key4],
    };
    this.boxes.push({
      complete: false,
      id: this.boxes.length,
      drawnEdgesCount: 0,
      edges,
    });
  }
  getAvailableMoves() {
    let edges = [];
    for (let key of Object.keys(this.edges)) {
      if (!this.edges[key].drawn) {
        edges.push(this.edges[key]);
      }
    }
    return edges;
  }

  setEdge(edge) {
    this.edges[edge.rowColKey].drawn = true;
    this.edges[edge.rowColKey].from.isOccupied = true;
    this.edges[edge.rowColKey].to.isOccupied = true;
    for (let boxIndex in this.boxes) {
      if (this.boxes[boxIndex].edges[edge.rowColKey]) {
        this.boxes[boxIndex].edges[edge.rowColKey] = this.edges[edge.rowColKey];
        this.boxes[boxIndex].drawnEdgesCount = Object.values(
          this.boxes[boxIndex].edges
        ).reduce((acc, curr) => {
          if (curr.drawn) {
            acc += 1;
          }
          return acc;
        }, 0);
        if (this.boxes[boxIndex].drawnEdgesCount === 4) {
          this.boxes[boxIndex].complete = true;
        }
      }
    }
  }

  makeMove(move) {
    this.setEdge(move);
  }

  findBestMove() {
    let bestMove = null;
    let minRisk = Infinity; // We will assign a "risk" score to moves

    // Loop over all edges to find the best move
    for (let key in this.edges) {
      let edge = this.edges[key];
      // Skip edges that are already drawn
      if (edge.drawn) continue;

      // Check if drawing this edge completes a box
      let boxes = this.findAdjacentBoxes(edge);

      let completedBoxes = boxes.filter((box) =>
        this.isBoxOneMoveFromCompletion(box)
      );

      if (completedBoxes.length > 0) {
        // If we can complete a box, this is the best move
        return edge; // Prioritize completing a box
      }

      // If no box is completed, calculate the risk of the move
      let risk = this.calculateMoveRisk(boxes);
      if (risk < minRisk) {
        minRisk = risk;
        bestMove = edge; // Update the best move based on risk
        // console.log(risk, bestMove);
      }
    }

    return bestMove;
  }

  findAdjacentBoxes(edge) {
    // Find all boxes adjacent to the given edge
    return this.boxes.filter((box) =>
      Object.values(box.edges).some(
        (boxEdge) => boxEdge.rowColKey === edge.rowColKey
      )
    );
  }

  isBoxOneMoveFromCompletion(box) {
    // Check if the box is one move away from being completed
    let drawnEdges = Object.values(box.edges).filter((e) => e.drawn).length;
    return drawnEdges === 3;
  }

  calculateMoveRisk(boxes) {
    // If we have adjacent boxes, calculate how many are 3 edges completed
    let risk = 0;
    boxes.forEach((box) => {
      if (this.isBoxOneMoveFromCompletion(box)) {
        risk++; // High risk if this move gives the opponent a chance to complete a box
      }
    });

    return risk; // Lower risk is better
  }

  playBestMove() {
    let bestMove = this.findBestMove();
    if (bestMove) {
      this.makeMove(bestMove);
    }
  }
}
