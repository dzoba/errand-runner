import React, { useState, useEffect } from "react";
import "./App.css";

const MAP_WIDTH = 50;
const MAP_HEIGHT = 20;
const TILE_SIZE = Math.min(
  Math.floor(window.innerWidth / MAP_WIDTH),
  Math.floor(window.innerHeight / MAP_HEIGHT)
);
const SUPER_MAP_SIZE = 3;
const HOUSE_COUNT = 4;
const HOUSE_WIDTH = 5;
const HOUSE_HEIGHT = 4;
const SHRUB_COUNT = 20;

const TileTypes = {
  GRASS: "lightgreen",
  POND: "blue",
  SHRUB: "darkgreen",
  HOUSE: "saddlebrown",
  DOOR: "brown",
  CHARACTER: "white",
};

const items = [
  "bucket",
  "sword",
  "candle",
  "potion",
  "shield",
  "bread",
  "quill",
  "ink",
  "scroll",
  "boots",
  "robe",
  "hat",
  "book",
  "torch",
  "basket",
  "wheel",
  "staff",
  "broom",
  "cloak",
  "flute",
];

const houseNames = [
  "Aldrich",
  "Bryony",
  "Cedric",
  "Dunstan",
  "Eadric",
  "Freyja",
  "Giselle",
  "Harold",
  "Idris",
  "Jocelyn",
];

function generateHouse() {
  const name = houseNames[Math.floor(Math.random() * houseNames.length)];
  return { name, itemsDelivered: 0 };
}

function createEmptyMap() {
  const map = new Array(MAP_HEIGHT).fill(null).map(() => {
    return new Array(MAP_WIDTH).fill(TileTypes.GRASS);
  });
  return map;
}

function isEmptySpace(map, x, y, width, height) {
  for (let i = y; i < y + height; i++) {
    for (let j = x; j < x + width; j++) {
      if (map[i][j] !== TileTypes.GRASS) {
        return false;
      }
    }
  }
  return true;
}

function placePonds(map) {
  const pondSize = Math.floor(Math.random() * 5) + 5;
  const pondX = Math.floor(Math.random() * (MAP_WIDTH - pondSize));
  const pondY = Math.floor(Math.random() * (MAP_HEIGHT - pondSize));

  for (let y = pondY; y < pondY + pondSize; y++) {
    for (let x = pondX; x < pondX + pondSize; x++) {
      if (Math.random() < 0.6) {
        map[y][x] = TileTypes.POND;
      }
    }
  }
}

function placeShrubs(map) {
  let placedShrubs = 0;

  while (placedShrubs < SHRUB_COUNT) {
    const x = Math.floor(Math.random() * MAP_WIDTH);
    const y = Math.floor(Math.random() * MAP_HEIGHT);

    if (map[y][x] === TileTypes.GRASS) {
      map[y][x] = TileTypes.SHRUB;
      placedShrubs++;
    }
  }
}

function placeHouse(map, x, y) {
  for (let i = y; i < y + HOUSE_HEIGHT; i++) {
    for (let j = x; j < x + HOUSE_WIDTH; j++) {
      if (i === y + HOUSE_HEIGHT - 1 && j === x + Math.floor(HOUSE_WIDTH / 2)) {
        map[i][j] = TileTypes.DOOR;
      } else {
        map[i][j] = TileTypes.HOUSE;
      }
    }
  }
}


function generateMap(row, col) {
  const map = createEmptyMap();

  // Place ponds
  placePonds(map);

  // Place shrubs
  placeShrubs(map);

  // Place houses
  const houses = [];
  for (let i = 0; i < HOUSE_COUNT; i++) {
    let housePlaced = false;
    while (!housePlaced) {
      const x = Math.floor(Math.random() * (MAP_WIDTH - HOUSE_WIDTH));
      const y = Math.floor(Math.random() * (MAP_HEIGHT - HOUSE_HEIGHT));
      if (isEmptySpace(map, x, y, HOUSE_WIDTH, HOUSE_HEIGHT)) {
        placeHouse(map, x, y);
        const houseName = houseNames[Math.floor(Math.random() * houseNames.length)];
        houses.push({ x, y, house: { name: houseName, itemsDelivered: 0 } });
        housePlaced = true;
      }
    }
  }

  return {
    map,
    houses,
  };
}

function createSuperMap() {
  let superMap = new Array(SUPER_MAP_SIZE)
    .fill(null)
    .map(() => new Array(SUPER_MAP_SIZE).fill(null));

  for (let row = 0; row < SUPER_MAP_SIZE; row++) {
    for (let col = 0; col < SUPER_MAP_SIZE; col++) {
      superMap[row][col] = generateMap(row, col);
    }
  }

  return superMap;
}

function App() {
  const [superMap, setSuperMap] = useState(createSuperMap());
  const [currentMap, setCurrentMap] = useState(superMap[0][0]);
  const [characterPos, setCharacterPos] = useState({ x: 1, y: 1 });
  const [errand, setErrand] = useState(null);
  const [itemsDelivered, setItemsDelivered] = useState(0);
  const [currentMapCoords, setCurrentMapCoords] = useState({ row: 0, col: 0 });
  const [onDoorHouseOwner, setOnDoorHouseOwner] = useState(null);


  useEffect(() => {
    const handleKeyPress = (e) => {
      const moveCharacter = (dx, dy) => {
        const newX = characterPos.x + dx;
        const newY = characterPos.y + dy;

        if (
          newX >= 0 &&
          newX < MAP_WIDTH &&
          newY >= 0 &&
          newY < MAP_HEIGHT &&
          currentMap.map[newY][newX] !== TileTypes.POND &&
          currentMap.map[newY][newX] !== TileTypes.SHRUB &&
          currentMap.map[newY][newX] !== TileTypes.HOUSE
        ) {
          setCharacterPos({ x: newX, y: newY });

          const house = currentMap.houses.find(
            (h) => h.x + 2 === newX && h.y + 3 === newY
          );
          if (house) {
            setOnDoorHouseOwner(house.house.name);
            if (!errand) {
              const randomMapRow = Math.floor(Math.random() * SUPER_MAP_SIZE);
              const randomMapCol = Math.floor(Math.random() * SUPER_MAP_SIZE);
              const targetMap = superMap[randomMapRow][randomMapCol];
              const targetHouse = targetMap.houses[Math.floor(Math.random() * targetMap.houses.length)];
          
              const item = items[Math.floor(Math.random() * items.length)];
              setErrand({
                item,
                targetHouse: targetHouse.house.name,
                targetMap: { row: randomMapRow, col: randomMapCol },
              });
            } else if (house.house.name === errand.targetHouse && currentMapCoords.row === errand.targetMap.row && currentMapCoords.col === errand.targetMap.col) {
              house.house.itemsDelivered++;
              setItemsDelivered(itemsDelivered + 1);
              setErrand(null);
            }
          } else {
            setOnDoorHouseOwner(null);
          }   
        } else if (newX < 0) {
          if (currentMapCoords.col > 0) {
            setCurrentMapCoords({ ...currentMapCoords, col: currentMapCoords.col - 1 });
            setCurrentMap(superMap[currentMapCoords.row][currentMapCoords.col - 1]);
            setCharacterPos({ x: MAP_WIDTH - 1, y: characterPos.y });
          }
        } else if (newX >= MAP_WIDTH) {
          if (currentMapCoords.col < SUPER_MAP_SIZE - 1) {
            setCurrentMapCoords({ ...currentMapCoords, col: currentMapCoords.col + 1 });
            setCurrentMap(superMap[currentMapCoords.row][currentMapCoords.col + 1]);
            setCharacterPos({ x: 0, y: characterPos.y });
          }
        } else if (newY < 0) {
          if (currentMapCoords.row > 0) {
            setCurrentMapCoords({ ...currentMapCoords, row: currentMapCoords.row - 1 });
            setCurrentMap(superMap[currentMapCoords.row - 1][currentMapCoords.col]);
            setCharacterPos({ x: characterPos.x, y: MAP_HEIGHT - 1 });
          }
        } else if (newY >= MAP_HEIGHT) {
          if (currentMapCoords.row < SUPER_MAP_SIZE - 1) {
            setCurrentMapCoords({ ...currentMapCoords, row: currentMapCoords.row + 1 });
            setCurrentMap(superMap[currentMapCoords.row + 1][currentMapCoords.col]);
            setCharacterPos({ x: characterPos.x, y: 0 });
          }
        }
      };

      if (e.key === "ArrowUp") {
        moveCharacter(0, -1);
      } else if (e.key === "ArrowDown") {
        moveCharacter(0, 1);
      } else if (e.key === "ArrowLeft") {
        moveCharacter(-1, 0);
      } else if (e.key === "ArrowRight") {
        moveCharacter(1, 0);
      }
    };

    document.addEventListener("keydown", handleKeyPress);

    return () => {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, [characterPos, currentMap, currentMapCoords, errand, itemsDelivered, superMap]);

  return (
    <div className="App">
      <div className="game">
        {currentMap.map.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((tile, colIndex) => (
              <div
                key={colIndex}
                className="tile"
                style={{
                  backgroundColor:
                    rowIndex === characterPos.y && colIndex === characterPos.x
                      ? TileTypes.CHARACTER
                      : tile,
                  width: TILE_SIZE,
                  height: TILE_SIZE,
                }}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <div className="info-bar">
        <div>Items delivered: {itemsDelivered}</div>
        <div>
          Current map: {currentMapCoords.row}, {currentMapCoords.col}
        </div>
        {errand && (
          <div>
            {errand.targetHouse} lives on map: {errand.targetMap.row},{" "}
            {errand.targetMap.col}
            <br />
            {houseNames.find(
              (houseName) =>
                currentMap.houses.find((house) => house.house.name === houseName)
            )}{" "}
            asks you to take {errand.item} to {errand.targetHouse}'s house
          </div>
        )}
        {onDoorHouseOwner && <div>{onDoorHouseOwner}'s House</div>}
      </div>
    </div>
  );
}

export default App;

