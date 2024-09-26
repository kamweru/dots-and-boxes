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
      current: 1,
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
    if (this.edges[edge.rowColKey].drawn) {
      return;
    }
    let edgeBoxes = this.boxes.filter(
        (b, i) =>
          !b.complete &&
          b.edges[edge.rowColKey] &&
          !b.edges[edge.rowColKey].drawn &&
          b.edges[edge.rowColKey].boxIndex === i
      ),
      completedBoxes = 0;
    for (let edgeBox of edgeBoxes) {
      this.edges[edge.rowColKey].from.isOccupied = true;
      this.edges[edge.rowColKey].to.isOccupied = true;
      this.edges[edge.rowColKey].drawn = true;
      this.edges[edge.rowColKey].c =
        this.players.current === 0 ? "red" : "green";
      this.boxes[edgeBox.id].edges[edge.rowColKey] = this.edges[edge.rowColKey];
      this.boxes[edgeBox.id].drawnEdgesCount++;
      if (this.boxes[edgeBox.id].drawnEdgesCount === 4) {
        this.boxes[edgeBox.id].complete = true;
        this.boxes[edgeBox.id].player = this.players.current;
        this.players.scores[this.players.current] += 1;
        completedBoxes++;
      }
    }
    if (completedBoxes > 0) {
      console.log(
        `Player ${this.players.current} completed ${completedBoxes} box(es) and gets another move.`
      );
    } else {
      this.players.current = this.players.current === 0 ? 1 : 0;
    }
  }

  makeMove(move) {
    this.setEdge(move);
    if (this.players.current === 0) {
      this.playBestMove();
    }
  }

  // findBestMove() {
  //   let bestMove = null;
  //   let minRisk = Infinity;

  //   // Step 1: Prioritize completing boxes
  //   for (let key in this.edges) {
  //     let edge = this.edges[key];

  //     if (!edge.drawn) {
  //       const adjacentBoxes = this.findAdjacentBoxes(edge);

  //       // If the move completes a box, prioritize it
  //       if (adjacentBoxes.some((box) => this.isBoxOneMoveFromCompletion(box))) {
  //         return edge;
  //       }
  //     }
  //   }

  //   // Step 2: Find the least risky move (that does not give the opponent an easy win)
  //   for (let key in this.edges) {
  //     let edge = this.edges[key];

  //     if (!edge.drawn) {
  //       const adjacentBoxes = this.findAdjacentBoxes(edge);
  //       let risk = this.calculateMoveRisk(
  //         adjacentBoxes,
  //         /* checkOpponentRisk= */ true
  //       );

  //       // Keep track of the move with the lowest risk
  //       if (risk < minRisk) {
  //         minRisk = risk;
  //         bestMove = edge;
  //       }
  //     }
  //   }

  //   // Step 3: If no safe move, sacrifice two squares (if necessary)
  //   if (!bestMove) {
  //     // Find a move that sacrifices two boxes, but minimizes further risk
  //     let leastBadMove = null;
  //     let leastBadRisk = Infinity;

  //     for (let key in this.edges) {
  //       let edge = this.edges[key];

  //       if (!edge.drawn) {
  //         const adjacentBoxes = this.findAdjacentBoxes(edge);
  //         let risk = this.calculateMoveRisk(
  //           adjacentBoxes,
  //           /* checkOpponentRisk= */ false
  //         );

  //         // Choose the move that results in sacrificing two boxes, but with the lowest overall risk
  //         if (risk < leastBadRisk) {
  //           leastBadRisk = risk;
  //           leastBadMove = edge;
  //         }
  //       }
  //     }

  //     return leastBadMove; // This sacrifices two squares
  //   }

  //   return bestMove;
  // }

  findBestMove() {
    //   let bestMove = null;
    // let maxScore = -Infinity;

    // for (let key in this.edges) {
    //   let edge = this.edges[key];
    //   if (edge.drawn) continue;

    //   // Check if drawing this edge completes a box or creates a risky situation
    //   let boxes = this.findAdjacentBoxes(edge);
    //   let completedBoxes = boxes.filter((box) => this.isBoxOneMoveFromCompletion(box));
    //   let riskyMove = completedBoxes.length > 0 || this.isSacrificeNecessary(boxes);

    //   if (!riskyMove) {
    //     // Prioritize non-risky moves
    //     let score = this.calculateMoveScore(boxes);
    //     if (score > maxScore) {
    //       maxScore = score;
    //       bestMove = edge;
    //     }
    //   }
    // }

    // // If no safe moves are found, sacrifice two squares
    // if (!bestMove) {
    //   bestMove = this.findSacrificeMove();
    // }

    // return bestMove;
    let bestMove = null;
    let maxScore = -Infinity;
    let minRisk = Infinity;

    for (let key in this.edges) {
      let edge = this.edges[key];
      if (edge.drawn) continue;

      // Check if drawing this edge completes a box
      let boxes = this.findAdjacentBoxes(edge);
      let completedBoxes = boxes.filter(
        (box) => box.drawnEdgesCount === 3
        // this.isBoxOneMoveFromCompletion(box)
      );

      if (completedBoxes.length > 0) {
        // Prioritize completing a box, return immediately
        return edge;
      }

      // Evaluate risk of move
      let risk = this.calculateMoveRisk(boxes);

      // Calculate score based on risk and other factors
      let score = this.calculateMoveScore(boxes);

      // Update best move if necessary
      if (score > maxScore || (score === maxScore && risk < minRisk)) {
        maxScore = score;
        minRisk = risk;
        bestMove = edge;
      }
    }

    // Check if best move is too risky
    if (minRisk > 1) {
      // Consider sacrificial moves
      let sacrificialMove = this.findSacrificialMove();
      if (sacrificialMove) {
        return sacrificialMove;
      }
    }

    return bestMove;
  }

  calculateMoveScore(boxes) {
    let score = 0;
    boxes.forEach((box) => {
      let drawnEdges = Object.values(box.edges).filter((e) => e.drawn).length;
      if (drawnEdges === 2) {
        // Encourage moves that leave the opponent with 2 sides completed
        score += 2;
      } else if (drawnEdges === 1) {
        // Slightly discourage creating opportunities for opponent with 1 side
        score -= 1;
      } else if (drawnEdges === 3 && !box.complete) {
        // Discourage moves that give the opponent a box with 3 sides
        score -= 5;
      }
    });
    return score;
    // let score = 0;
    // boxes.forEach((box) => {
    //   let drawnEdges = Object.values(box.edges).filter((e) => e.drawn).length;
    //   if (drawnEdges === 2) {
    //     // Encourage moves that leave the opponent with 2 sides completed
    //     score += 2;
    //   } else if (drawnEdges === 1) {
    //     // Slightly discourage creating opportunities for opponent with 1 side
    //     score -= 1;
    //   }
    // });
    // return score;
  }

  calculateMoveRisk(boxes) {
    let risk = 0;
    boxes.forEach((box) => {
      let drawnEdges = Object.values(box.edges).filter((e) => e.drawn).length;
      if (drawnEdges === 2) {
        risk += 2; // Higher risk if opponent can complete in one move
      } else if (drawnEdges === 1) {
        risk += 1; // Lower risk if opponent can complete in two moves
      }
    });
    return risk;
  }

  isSacrificeNecessary(boxes) {
    for (let box of boxes) {
      if (this.isBoxOneMoveFromCompletion(box)) {
        return true;
      }
    }
    return false;
  }

  findSacrificialMove() {
    for (let key in this.edges) {
      let edge = this.edges[key];
      if (edge.drawn) continue;

      let boxes = this.findAdjacentBoxes(edge);
      if (this.isSacrificeNecessary(boxes)) {
        return edge;
      }
    }
    return null;
  }

  findAdjacentBoxes(edge) {
    // Find all boxes adjacent to the given edge
    //  let edgeBoxes = this.boxes.filter(
    //   (b, i) =>
    //     !b.complete &&
    //     b.edges[edge.rowColKey] &&
    //     !b.edges[edge.rowColKey].drawn &&
    //     b.edges[edge.rowColKey].boxIndex === i
    // ),
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

  isBoxComplete(box) {
    // Check if all 4 sides of the box are drawn
    return Object.values(box.edges).every((edge) => edge.drawn);
  }

  // calculateMoveRisk(adjacentBoxes, checkOpponentRisk = false) {
  //   let risk = 0;

  //   adjacentBoxes.forEach((box) => {
  //     if (this.isBoxOneMoveFromCompletion(box)) {
  //       risk += 1;
  //     }

  //     if (checkOpponentRisk && this.willGiveOpponentBox(box)) {
  //       risk += 2; // Higher risk if this move gives the opponent a box
  //     }
  //   });

  //   return risk; // Lower risk is better
  // }

  willGiveOpponentBox(box) {
    // Check if the opponent will complete a box after this move
    let drawnEdges = Object.values(box.edges).filter((e) => e.drawn).length;

    // If the box has 2 or fewer edges drawn, the opponent can complete it after this move
    return drawnEdges === 2;
  }

  playBestMove() {
    let bestMove = this.findBestMove();
    if (bestMove) {
      this.makeMove(bestMove);
      // console.log(this.players);
    }
  }
}
