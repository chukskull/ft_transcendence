interface i {
  [userKey: string]: {
    name: string;
    score: number;
  };
}

const Sort = (backendObject: i) => {
  const sorted = Object.keys(backendObject).sort((a, b) => {
    return backendObject[b].score - backendObject[a].score;
  });
  return sorted.map((key) => backendObject[key]);
};

const backendObject = {
  user1: {
    name: "user1",
    score: 9,
  },
  user2: {
    name: "user2",
    score: 10,
  },
  user3: {
    name: "user3",
    score: 8,
  },
  user4: {
    name: "user4",
    score: 7,
  },
  user5: {
    name: "user5",
    score: 6,
  },
  user6: {
    name: "user6",
    score: 5,
  },

  user7: {
    name: "user7",
    score: 4,
  },
};

const sorted = Sort(backendObject);
sorted.map(({ name, score }) => {});
