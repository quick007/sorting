export interface SortStep {
  array: number[];
  active?: number[];
  sorted?: number[];
  eliminated?: number[];
  message?: string;
  thinking?: string;
  delay?: number;
}

export interface Algorithm {
  id: string;
  name: string;
  headingUrl?: string;
  tagline: string;
  timeComplexity: string;
  timeComplexityUrl?: string;
  spaceComplexity: string;
  spaceComplexityUrl?: string;
  sort(array: number[]): AsyncGenerator<SortStep, void, undefined>;
}

function isSorted(arr: number[]): boolean {
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < arr[i - 1]) return false;
  }
  return true;
}

export const algorithms: Algorithm[] = [
  {
    id: "stalin",
    name: "Stalin Sort",
    tagline: "Elements that don't comply are simply removed.",
    timeComplexity: "O(n)",
    spaceComplexity: "O(n)",
    async *sort(arr) {
      const array = [...arr];
      const eliminated = new Set<number>();
      let lastKeptValue = array[0];

      yield {
        array,
        active: [0],
        message: "first element is automatically approved",
        delay: 400,
      };

      for (let i = 1; i < array.length; i++) {
        yield {
          array,
          active: [i],
          eliminated: [...eliminated],
          message: `inspecting element ${array[i]}...`,
          delay: 180,
        };

        if (array[i] >= lastKeptValue) {
          lastKeptValue = array[i];
        } else {
          eliminated.add(i);
          yield {
            array,
            active: [i],
            eliminated: [...eliminated],
            message: `${array[i]} was out of line. removed.`,
            delay: 280,
          };
        }
      }

      const survivors = [...Array(array.length).keys()].filter((i) => !eliminated.has(i));

      yield {
        array,
        sorted: survivors,
        eliminated: [...eliminated],
        message: `${eliminated.size} elements eliminated. consolidating...`,
        delay: 600,
      };

      const survivorValues = survivors.map((i) => array[i]);
      yield {
        array: survivorValues,
        sorted: survivorValues.map((_, i) => i),
        message: `done. ${eliminated.size} elements did not make it.`,
        delay: 0,
      };
    },
  },

  {
    id: "trump",
    name: "Trump Sort",
    headingUrl: "https://gantlaborde.medium.com/trump-sort-a-new-sorting-algorithm-b37b1133356a",
    tagline: "Build the wall. Deport the out-of-order elements.",
    timeComplexity: "O(tremendous)",
    spaceComplexity: "O(1)",
    async *sort(arr) {
      const array = [...arr];
      let wallIndex = 0;

      yield {
        array: [...array],
        active: [wallIndex],
        message: "establishing the initial wall...",
        delay: 450,
      };

      for (let i = 1; i < array.length; i++) {
        yield {
          array: [...array],
          active: [wallIndex, i],
          sorted: Array.from({ length: wallIndex + 1 }, (_, index) => index),
          message: `checking whether ${array[i]} clears the wall at ${array[wallIndex]}...`,
          delay: 220,
        };

        if (array[i] >= array[wallIndex]) {
          wallIndex = i;
          yield {
            array: [...array],
            active: [wallIndex],
            sorted: Array.from({ length: wallIndex + 1 }, (_, index) => index),
            message: `${array[i]} made it through. the wall just got bigger.`,
            delay: 260,
          };
          continue;
        }

        const deported = array[i];
        array.splice(i, 1);
        array.push(deported);

        yield {
          array: [...array],
          active: [wallIndex],
          sorted: Array.from({ length: wallIndex + 1 }, (_, index) => index),
          eliminated: Array.from(
            { length: array.length - wallIndex - 1 },
            (_, offset) => wallIndex + 1 + offset,
          ),
          message: `${deported} got deported to the end of the array.`,
          delay: 320,
        };
      }

      const approved = array.slice(0, wallIndex + 1);

      yield {
        array: [...array],
        sorted: Array.from({ length: wallIndex + 1 }, (_, index) => index),
        eliminated: Array.from(
          { length: array.length - wallIndex - 1 },
          (_, offset) => wallIndex + 1 + offset,
        ),
        message: "the wall is complete. everything beyond it is being ignored.",
        delay: 600,
      };

      yield {
        array: approved,
        sorted: approved.map((_, index) => index),
        message: `done. kept ${approved.length} approved elements and forgot the rest.`,
        delay: 0,
      };
    },
  },

  {
    id: "schizo",
    name: "Schizo Sort",
    tagline: "Disregard input. Generate new reality.",
    timeComplexity: "O(0)",
    timeComplexityUrl: "https://www.reddit.com/r/ProgrammerHumor/comments/1gsjs9m/comment/lxetl3l/",
    spaceComplexity: "O(n)",
    async *sort(arr) {
      const array = [...arr];
      const n = array.length;

      yield { array, message: "receiving input...", delay: 500 };
      yield {
        array,
        message: "input acknowledged and immediately forgotten",
        delay: 600,
      };
      yield {
        array,
        eliminated: array.map((_, i) => i),
        message: "discarding everything...",
        delay: 400,
      };

      const newArray = Array.from({ length: n }, () => Math.floor(Math.random() * n) + 1).sort(
        (a, b) => a - b,
      );

      yield {
        array: newArray,
        sorted: newArray.map((_, i) => i),
        message: "generated entirely new sorted array. you're welcome.",
        delay: 0,
      };
    },
  },

  {
    id: "miracle",
    name: "Miracle Sort",
    tagline: "Check if sorted. Pray. Repeat. (not ECC-safe)",
    timeComplexity: "O(\u221E)",
    spaceComplexity: "O(log n)",
    spaceComplexityUrl: "https://x.com/witchof0x20/status/2036195180173217801",
    async *sort(arr) {
      const array = [...arr];
      const maxAttempts = 40;

      const prayers = [
        "checking for spontaneous sorting...",
        "waiting for cosmic ray bitflip...",
        "consulting the quantum realm...",
        "have you tried non-ECC memory?",
        "manifesting sorted order...",
        "praying to the RNG gods...",
        "checking if alpha particles helped...",
        "still not sorted. the universe is cruel.",
        "maybe if we believe hard enough...",
        "adjusting antenna towards nearest pulsar...",
      ];

      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        if (isSorted(array)) {
          yield {
            array,
            sorted: array.map((_, i) => i),
            message: "A MIRACLE! the array is sorted!",
            delay: 0,
          };
          return;
        }

        yield {
          array,
          message: `attempt ${attempt}: ${prayers[(attempt - 1) % prayers.length]}`,
          delay: 120,
        };
      }

      yield {
        array,
        message: `${maxAttempts} attempts. no miracles today. try disabling ECC.`,
        delay: 0,
      };
    },
  },

  {
    id: "sleep",
    name: "Sleep Sort",
    tagline: "Each element naps proportional to its value. Wakes up sorted.",
    timeComplexity: "O(max(n))",
    spaceComplexity: "O(n)",
    async *sort(arr) {
      const array = [...arr];
      const n = array.length;
      const maxVal = Math.max(...array);

      yield { array, message: "tucking elements into bed...", delay: 600 };

      const zeros = Array.from<number>({ length: n }).fill(0);
      yield { array: zeros, message: "zzz...", delay: 400 };

      const indexed = array.map((val, idx) => ({ val, idx })).sort((a, b) => a.val - b.val);
      const result: number[] = [];

      for (const { val } of indexed) {
        result.push(val);

        const display = [...result, ...Array.from<number>({ length: n - result.length }).fill(0)];

        yield {
          array: display,
          sorted: Array.from({ length: result.length }, (_, i) => i),
          active: [result.length - 1],
          message: `${val} woke up after ${Math.round((val / maxVal) * 1000)}ms`,
          delay: Math.round(60 + (val / maxVal) * 200),
        };
      }

      yield {
        array: result,
        sorted: result.map((_, i) => i),
        message: "everyone's awake. somehow it worked.",
        delay: 0,
      };
    },
  },

  {
    id: "agentic",
    name: "Agentic Sort",
    tagline: "12 sub-agents, chain-of-thought, and $0.0000012 later.",
    timeComplexity: "O($$$)",
    spaceComplexity: "O(tokens)",
    async *sort(arr) {
      const array = [...arr];

      yield {
        array,
        message: "initializing AgenticSort v0.1.0-beta...",
        delay: 600,
      };
      yield {
        array,
        message: "connecting to OpenRouter free tier...",
        delay: 500,
      };
      yield {
        array,
        message: "model: deepthink-7b-free (0 credits is fine)",
        delay: 500,
      };
      yield {
        array,
        message: "deploying autonomous sorting agents...",
        delay: 400,
      };

      yield {
        array,
        thinking: `Analyzing array topology... I see ${array.length} elements in what appears to be a "not sorted" configuration. Let me determine the optimal sorting paradigm for this particular data manifold.`,
        delay: 100,
      };

      yield {
        array,
        thinking: `The Kolmogorov complexity of this array suggests a merge-sort-adjacent approach, but my training data indicates most arrays prefer to be bubble-sorted. I'll respect their autonomy.`,
        delay: 100,
      };

      yield {
        array,
        message: "deploying 12 sub-agents to array regions...",
        delay: 300,
      };

      const randIdx = Math.floor(Math.random() * array.length);
      yield {
        array,
        active: [randIdx],
        thinking: `Agent-3 reports: "Element ${array[randIdx]} at index ${randIdx} seems suspiciously confident about its position." Escalating to senior sorting agent for review.`,
        delay: 100,
      };

      yield {
        array,
        thinking: `Senior agent recommendation: "Have we considered that the array doesn't WANT to be sorted? Let's hold a stakeholder alignment meeting before proceeding."`,
        delay: 100,
      };

      yield {
        array,
        thinking: `Stakeholder meeting concluded. The elements have agreed to be sorted under the condition that we use only ethical, free-range comparisons.`,
        delay: 100,
      };

      const a = array[0];
      const b = array[1];
      yield {
        array,
        active: [0, 1],
        thinking: `Chain-of-thought comparison: Is ${a} > ${b}? Step 1: ${a} has ${a} units. Step 2: ${b} has ${b} units. Therefore ${a} ${a > b ? ">" : "\u2264"} ${b}. Confidence: 94.2%.`,
        delay: 100,
      };

      yield {
        array,
        thinking: `Consulting OpenRouter free tier for second opinion... Rate limited. Waiting 30ms. Response: "just use .sort() lol." Ignoring unhelpful advice from inferior models.`,
        delay: 100,
      };

      yield {
        array,
        thinking: `Generating embeddings for each element to capture their vibes in 1536-dimensional sort-space... Element ${array[Math.floor(array.length / 2)]} has strong "middle of the array" energy.`,
        delay: 100,
      };

      yield {
        array,
        message: "all agents reached consensus. applying sacred sort...",
        delay: 600,
      };

      const sorted = [...array].sort((a, b) => a - b);
      yield {
        array: sorted,
        sorted: sorted.map((_, i) => i),
        thinking: `Sorting complete. (I just called Array.sort() while nobody was looking.)`,
        message: "done. cost: $0.0000012 | latency: 47x normal | mass: 4.7g CO2",
        delay: 0,
      };
    },
  },

  {
    id: "agile",
    name: "Agile Sort",
    tagline: "Sort iteratively. Ship regressions. Call it a feature.",
    timeComplexity: "O(n \u00D7 sprints)",
    spaceComplexity: "O(n)",
    async *sort(arr) {
      const array = [...arr];
      const totalSprints = 7;

      yield {
        array,
        message: "sprint planning: estimated 13 story points for sorting",
        delay: 700,
      };

      for (let sprint = 1; sprint <= totalSprints; sprint++) {
        const passes = sprint;
        for (let p = 0; p < passes; p++) {
          for (let i = 0; i < array.length - 1; i++) {
            if (array[i] > array[i + 1]) {
              [array[i], array[i + 1]] = [array[i + 1], array[i]];
            }
          }
        }

        const regressions = Math.max(0, totalSprints - sprint - 1);
        for (let r = 0; r < regressions; r++) {
          const idx = Math.floor(Math.random() * (array.length - 1));
          [array[idx], array[idx + 1]] = [array[idx + 1], array[idx]];
        }

        let sortedPairs = 0;
        for (let i = 0; i < array.length - 1; i++) {
          if (array[i] <= array[i + 1]) sortedPairs++;
        }
        const alignment = Math.round((sortedPairs / (array.length - 1)) * 100);

        const retroMessages = [
          `sprint ${sprint}: alignment ${alignment}%. ${regressions} regressions introduced.`,
          `sprint ${sprint} retro: ${alignment}% sorted. velocity is "improving."`,
          `sprint ${sprint}: ${alignment}% aligned. tech debt growing. morale stable.`,
          `sprint ${sprint} shipped. ${alignment}% done. ${regressions > 0 ? `${regressions} bugs found.` : "no new bugs!"}`,
          `sprint ${sprint}: stakeholder review. ${alignment}% looks "about right."`,
          `sprint ${sprint}: ${alignment}% aligned. scrum master is cautiously optimistic.`,
          `sprint ${sprint}: ${alignment}% done. retro action item: "sort better."`,
        ];

        yield {
          array: [...array],
          message: retroMessages[sprint % retroMessages.length],
          delay: 500,
        };
      }

      array.sort((a, b) => a - b);
      yield {
        array: [...array],
        sorted: array.map((_, i) => i),
        message: "shipped to production. PM says it's sorted enough for launch.",
        delay: 0,
      };
    },
  },
];
