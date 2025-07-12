import { Position, GridCell, PathStep } from '../types/store';
import { aisles, entrance, checkout } from '../data/storeData';

interface Node {
  position: Position;
  gCost: number;
  hCost: number;
  fCost: number;
  parent?: Node;
}

export class AStar {
  private grid: GridCell[][];
  private width: number;
  private height: number;

  constructor(grid: GridCell[][]) {
    this.grid = grid;
    this.height = grid.length;
    this.width = grid[0]?.length || 0;
  }

  private getNeighbors(node: Node): Node[] {
    const neighbors: Node[] = [];
    const { x, y } = node.position;
    
    // Only horizontal and vertical movement (Manhattan style)
    const directions = [
      { x: 0, y: -1 }, // up
      { x: 0, y: 1 },  // down
      { x: -1, y: 0 }, // left
      { x: 1, y: 0 }   // right
    ];

    for (const dir of directions) {
      const newX = x + dir.x;
      const newY = y + dir.y;

      if (this.isValidPosition(newX, newY) && this.isWalkable(newX, newY)) {
        neighbors.push({
          position: { x: newX, y: newY },
          gCost: 0,
          hCost: 0,
          fCost: 0,
          parent: node
        });
      }
    }

    return neighbors;
  }

  private isValidPosition(x: number, y: number): boolean {
    return x >= 0 && x < this.width && y >= 0 && y < this.height;
  }

  private isWalkable(x: number, y: number): boolean {
    return this.grid[y][x].isWalkable;
  }

  private calculateDistance(pos1: Position, pos2: Position): number {
    // Manhattan distance
    return Math.abs(pos1.x - pos2.x) + Math.abs(pos1.y - pos2.y);
  }

  private getZoneAtPosition(position: Position): string | null {
    // Check if position is near entrance
    if (Math.abs(position.x - entrance.x) <= 1 && Math.abs(position.y - entrance.y) <= 1) {
      return 'entrance';
    }

    // Check if position is near checkout
    if (Math.abs(position.x - checkout.x) <= 1 && Math.abs(position.y - checkout.y) <= 1) {
      return 'checkout';
    }

    // Check if position is near any aisle
    for (const aisle of aisles) {
      const aisleCenter = {
        x: aisle.position.x + Math.floor(aisle.width / 2),
        y: aisle.position.y + Math.floor(aisle.height / 2)
      };

      // Check if position is within or adjacent to aisle
      if (position.x >= aisle.position.x - 2 && 
          position.x <= aisle.position.x + aisle.width + 1 &&
          position.y >= aisle.position.y - 2 && 
          position.y <= aisle.position.y + aisle.height + 1) {
        return aisle.id;
      }
    }

    return null;
  }

  private getRelativePosition(aisleId: string): string {
    const aisle = aisles.find(a => a.id === aisleId);
    if (!aisle) return '';

    const centerX = aisle.position.x + Math.floor(aisle.width / 2);
    const centerY = aisle.position.y + Math.floor(aisle.height / 2);

    // Determine relative position in store
    let position = '';
    
    // Vertical position
    if (centerY <= 4) position += 'front';
    else if (centerY >= 10) position += 'back';
    else position += 'middle';

    position += '-';

    // Horizontal position  
    if (centerX <= 6) position += 'left';
    else if (centerX >= 14) position += 'right';
    else position += 'center';

    return position;
  }

  private getZoneName(zoneId: string): string {
    if (zoneId === 'entrance') return 'Store Entrance';
    if (zoneId === 'checkout') return 'Checkout Counter';

    const aisle = aisles.find(a => a.id === zoneId);
    return aisle ? aisle.name : 'Unknown Area';
  }

  private reconstructPath(endNode: Node): PathStep[] {
    const path: PathStep[] = [];
    let current = endNode;

    while (current.parent) {
      const direction = this.getDirection(current.parent.position, current.position);
      path.unshift({
        position: current.position,
        direction
      });
      current = current.parent;
    }

    // Add start position
    path.unshift({ position: current.position });

    return this.addZoneBasedInstructions(path);
  }

  private getDirection(from: Position, to: Position): 'up' | 'down' | 'left' | 'right' {
    if (to.y < from.y) return 'up';
    if (to.y > from.y) return 'down';
    if (to.x < from.x) return 'left';
    return 'right';
  }

  private addZoneBasedInstructions(path: PathStep[]): PathStep[] {
    if (path.length === 0) return path;

    const instructions: PathStep[] = [];
    let currentZone: string | null = null;
    let i = 0;

    while (i < path.length) {
      const currentStep = path[i];
      const stepZone = this.getZoneAtPosition(currentStep.position);

      if (i === 0) {
        // Starting instruction
        instructions.push({
          ...currentStep,
          instruction: "Start at the Store Entrance near the front-center of the store"
        });
        currentZone = stepZone;
        i++;
        continue;
      }

      if (i === path.length - 1) {
        // Final instruction
        instructions.push({
          ...currentStep,
          instruction: "Finally, head to the Checkout Counter near the back-right corner"
        });
        i++;
        continue;
      }

      // Check if we're entering a new zone
      if (stepZone && stepZone !== currentZone && stepZone !== 'entrance') {
        const zoneName = this.getZoneName(stepZone);
        const relativePos = this.getRelativePosition(stepZone);
        
        let instruction = '';
        if (stepZone === 'checkout') {
          instruction = `Proceed to the ${zoneName} located in the ${relativePos} area`;
        } else {
          instruction = `Walk towards the ${zoneName} section, located in the ${relativePos} area of the store`;
        }

        instructions.push({
          ...currentStep,
          instruction
        });

        currentZone = stepZone;
      }

      i++;
    }

    // If we have very few instructions, add some intermediate guidance
    if (instructions.length < 3 && path.length > 10) {
      const midPoint = Math.floor(path.length / 2);
      const midStep = path[midPoint];
      const midZone = this.getZoneAtPosition(midStep.position);
      
      if (midZone && midZone !== currentZone) {
        const zoneName = this.getZoneName(midZone);
        instructions.splice(1, 0, {
          ...midStep,
          instruction: `Continue past the ${zoneName} area`
        });
      }
    }

    return instructions;
  }

  findPath(start: Position, end: Position): PathStep[] {
    const openSet: Node[] = [];
    const closedSet: Set<string> = new Set();

    const startNode: Node = {
      position: start,
      gCost: 0,
      hCost: this.calculateDistance(start, end),
      fCost: 0,
      parent: undefined
    };
    startNode.fCost = startNode.gCost + startNode.hCost;

    openSet.push(startNode);

    while (openSet.length > 0) {
      // Find node with lowest fCost
      let current = openSet[0];
      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fCost < current.fCost || 
            (openSet[i].fCost === current.fCost && openSet[i].hCost < current.hCost)) {
          current = openSet[i];
        }
      }

      const currentIndex = openSet.indexOf(current);
      openSet.splice(currentIndex, 1);
      closedSet.add(`${current.position.x},${current.position.y}`);

      // Check if we reached the target
      if (current.position.x === end.x && current.position.y === end.y) {
        return this.reconstructPath(current);
      }

      // Check neighbors
      const neighbors = this.getNeighbors(current);
      for (const neighbor of neighbors) {
        const neighborKey = `${neighbor.position.x},${neighbor.position.y}`;
        if (closedSet.has(neighborKey)) continue;

        const tentativeGCost = current.gCost + 1;
        const existingNode = openSet.find(n => 
          n.position.x === neighbor.position.x && n.position.y === neighbor.position.y
        );

        if (!existingNode || tentativeGCost < existingNode.gCost) {
          neighbor.gCost = tentativeGCost;
          neighbor.hCost = this.calculateDistance(neighbor.position, end);
          neighbor.fCost = neighbor.gCost + neighbor.hCost;
          neighbor.parent = current;

          if (!existingNode) {
            openSet.push(neighbor);
          }
        }
      }
    }

    return []; // No path found
  }
}