"use client";

import { useState, useCallback } from "react";
import StoreMap from "../../components/StoreMap";
import { aisles, createGrid, entrance, checkout } from "../../data/storeData";
import { AStar } from "../../utils/pathfinding";
import { PathStep } from "../../types/store";

export default function StoreMapPage() {
  const [path, setPath] = useState<PathStep[]>([]);
  const [highlightedAisles, setHighlightedAisles] = useState<string[]>([
    "dairy",
    "frozen",
    "snacks",
  ]);

  const handlePathComplete = useCallback(() => {
    console.log("Path animation completed");
  }, []);

  // Generate a sample path for demonstration
  const generateSamplePath = useCallback(() => {
    const grid = createGrid();
    const pathfinder = new AStar(grid);

    // Sample path from entrance to dairy to checkout
    const dairyAisle = aisles.find((a) => a.id === "dairy");
    if (dairyAisle) {
      const dairyCenter = {
        x: dairyAisle.position.x + Math.floor(dairyAisle.width / 2),
        y: dairyAisle.position.y + Math.floor(dairyAisle.height / 2),
      };

      // Find nearest walkable position to dairy
      let dairyTarget = dairyCenter;
      for (let radius = 1; radius <= 5; radius++) {
        for (let dx = -radius; dx <= radius; dx++) {
          for (let dy = -radius; dy <= radius; dy++) {
            const x = dairyCenter.x + dx;
            const y = dairyCenter.y + dy;
            if (x >= 0 && x < 20 && y >= 0 && y < 15 && grid[y][x].isWalkable) {
              dairyTarget = { x, y };
              break;
            }
          }
          if (dairyTarget !== dairyCenter) break;
        }
        if (dairyTarget !== dairyCenter) break;
      }

      const pathToDairy = pathfinder.findPath(entrance, dairyTarget);
      const pathToCheckout = pathfinder.findPath(dairyTarget, checkout);

      const fullPath = [...pathToDairy, ...pathToCheckout.slice(1)];
      setPath(fullPath);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Store Map View
          </h1>
          <p className="text-gray-600">
            Interactive store navigation map with pathfinding
          </p>
          <button
            onClick={generateSamplePath}
            className="mt-4 px-4 py-2 bg-[#04b7cf] text-white rounded-lg hover:bg-[#0396b3] transition-colors"
          >
            Generate Sample Route
          </button>
        </div>

        <StoreMap
          aisles={aisles}
          highlightedAisles={highlightedAisles}
          path={path}
          onPathComplete={handlePathComplete}
        />
      </div>
    </div>
  );
}
