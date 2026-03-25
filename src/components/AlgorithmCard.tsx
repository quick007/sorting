import { useRef, useState } from "react";
import { Button } from "@/components/ui/button.tsx";
import { cn } from "@/lib/utils.ts";
import { type Algorithm, type SortStep } from "../algorithms.ts";

const BAR_COUNT = 12;

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

interface CardState {
  baseArray: number[];
  displayStep: SortStep | null;
  status: string;
  thinkingLines: string[];
  isSorting: boolean;
}

function shuffleArray(length: number): number[] {
  const array = Array.from({ length }, (_, index) => index + 1);

  for (let index = array.length - 1; index > 0; index--) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }

  return array;
}

function getBarClass(index: number, step: SortStep): string {
  return cn(
    "bar flex-1 rounded-lg transition-all duration-300 ease-out",
    step.eliminated?.includes(index) && "bg-neutral-800 opacity-20",
    !step.eliminated?.includes(index) && step.active?.includes(index) && "bg-neutral-400",
    !step.eliminated?.includes(index) &&
      !step.active?.includes(index) &&
      step.sorted?.includes(index) &&
      "bg-neutral-200",
    !step.eliminated?.includes(index) &&
      !step.active?.includes(index) &&
      !step.sorted?.includes(index) &&
      "bg-neutral-700",
  );
}

function createCardState(baseArray = shuffleArray(BAR_COUNT)): CardState {
  return {
    baseArray,
    displayStep: null,
    status: "",
    thinkingLines: [],
    isSorting: false,
  };
}

function ComplexityChip({ label, value, href }: { label: string; value: string; href?: string }) {
  const content = `${label}: ${value}`;
  const className = "text-xs text-neutral-600 bg-neutral-800/60 font-bold px-2.5 py-1 rounded-lg";

  if (!href) {
    return <span className={className}>{content}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noreferrer" className={cn(className, "inline-block")}>
      {content}
    </a>
  );
}

export default function AlgorithmCard({ algorithm }: { algorithm: Algorithm }) {
  const [cardState, setCardState] = useState<CardState>(() => createCardState());
  const sectionRef = useRef<HTMLElement | null>(null);
  const thinkingRef = useRef<HTMLDivElement | null>(null);
  const runIdRef = useRef(0);

  function isRunActive(runId: number): boolean {
    return runIdRef.current === runId && sectionRef.current !== null;
  }

  function scrollThinkingToBottom(): void {
    if (!thinkingRef.current) {
      return;
    }

    requestAnimationFrame(() => {
      const thinkingElement = thinkingRef.current;
      if (thinkingElement) {
        thinkingElement.scrollTop = thinkingElement.scrollHeight;
      }
    });
  }

  async function typeThinking(text: string, runId: number): Promise<void> {
    let lineIndex = -1;

    setCardState((previous) => {
      lineIndex = previous.thinkingLines.length;
      return {
        ...previous,
        thinkingLines: [...previous.thinkingLines, "> "],
      };
    });
    scrollThinkingToBottom();

    let currentLine = "> ";

    for (const char of text) {
      if (!isRunActive(runId)) {
        return;
      }

      currentLine += char;
      setCardState((previous) => {
        const thinkingLines = [...previous.thinkingLines];
        thinkingLines[lineIndex] = currentLine;

        return {
          ...previous,
          thinkingLines,
        };
      });
      scrollThinkingToBottom();
      await wait(12);
    }
  }

  async function runSort(): Promise<void> {
    const baseArray = cardState.baseArray;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;

    setCardState((previous) => ({
      ...previous,
      displayStep: { array: baseArray },
      status: "",
      thinkingLines: [],
      isSorting: true,
    }));

    try {
      for await (const step of algorithm.sort([...baseArray])) {
        if (!isRunActive(runId)) {
          return;
        }

        setCardState((previous) => ({
          ...previous,
          displayStep: step,
          status: step.message ?? previous.status,
        }));

        if (step.thinking) {
          await typeThinking(step.thinking, runId);
        }

        if (!isRunActive(runId)) {
          return;
        }

        if (step.delay && step.delay > 0) {
          await wait(step.delay);
        }
      }
    } catch (error) {
      console.error(`Sort error (${algorithm.id}):`, error);
      if (isRunActive(runId)) {
        setCardState((previous) => ({
          ...previous,
          status: "sorting failed. check the console for details.",
        }));
      }
    } finally {
      if (isRunActive(runId)) {
        setCardState((previous) => ({
          ...previous,
          isSorting: false,
        }));
      }
    }
  }

  function shuffle(): void {
    const nextArray = shuffleArray(BAR_COUNT);
    runIdRef.current += 1;
    setCardState(createCardState(nextArray));
  }

  const hasThinking = algorithm.id === "agentic";
  const displayStep = cardState.displayStep ?? { array: cardState.baseArray };
  const headingClassName = "text-xl font-bold text-white lowercase tracking-tight text-center mb-1";

  return (
    <section ref={sectionRef} className="w-full max-w-md mx-auto" data-algo={algorithm.id}>
      <h2 className={headingClassName}>
        {algorithm.headingUrl ? (
          <a
            href={algorithm.headingUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:underline"
          >
            {algorithm.name}
          </a>
        ) : (
          algorithm.name
        )}
      </h2>
      <p className="text-center text-neutral-500 text-sm mb-3">{algorithm.tagline}</p>
      <div className="flex justify-center gap-2 mb-8">
        <ComplexityChip
          label="time"
          value={algorithm.timeComplexity}
          href={algorithm.timeComplexityUrl}
        />
        <ComplexityChip
          label="space"
          value={algorithm.spaceComplexity}
          href={algorithm.spaceComplexityUrl}
        />
      </div>

      {hasThinking && cardState.thinkingLines.length > 0 ? (
        <div
          ref={thinkingRef}
          data-thinking
          className="text-[10px] leading-[1.6] text-neutral-500 bg-neutral-900 border border-neutral-800 rounded-lg p-3 mb-6 max-h-[80px] overflow-y-auto"
        >
          {cardState.thinkingLines.map((line, index) => (
            <div key={`${algorithm.id}-thinking-${index}`} className="mb-1 last:mb-0">
              {line}
            </div>
          ))}
        </div>
      ) : null}

      <div className="flex items-end justify-center gap-1.5 h-[200px] mb-4">
        {displayStep.array.map((value, index) => (
          <div
            key={`${algorithm.id}-${index}`}
            className={getBarClass(index, displayStep)}
            style={{ height: `${value <= 0 ? 0 : (value / BAR_COUNT) * 100}%` }}
          />
        ))}
      </div>

      <div className="text-[11px] text-neutral-600 text-center h-4 mb-8 truncate">
        {cardState.status || "\u00A0"}
      </div>

      <div className="flex justify-center gap-3 text-sm font-bold">
        <Button
          onClick={() => {
            void runSort();
          }}
          disabled={cardState.isSorting}
          className={cn(cardState.isSorting && "cursor-wait")}
        >
          {cardState.isSorting ? "sorting..." : "sort"}
        </Button>
        <Button variant="secondary" onClick={shuffle}>
          shuffle
        </Button>
      </div>
    </section>
  );
}
