import { renderToStaticMarkup } from "react-dom/server";
import { expect, test } from "vite-plus/test";
import App from "./App.tsx";
import { algorithms } from "./algorithms.ts";

test("renders each sorting algorithm card", () => {
  const markup = renderToStaticMarkup(<App />);

  expect(markup).toContain("sorting");

  for (const algorithm of algorithms) {
    expect(markup).toContain(`data-algo="${algorithm.id}"`);
    expect(markup).toContain(algorithm.name);
  }
});

test("renders linked joke complexities", () => {
  const markup = renderToStaticMarkup(<App />);

  expect(markup).toContain("time: O(0)");
  expect(markup).toContain(
    'href="https://www.reddit.com/r/ProgrammerHumor/comments/1gsjs9m/comment/lxetl3l/"',
  );
  expect(markup).toContain('href="https://x.com/witchof0x20/status/2036195180173217801"');
});

test("renders Trump Sort second with a linked heading", () => {
  const markup = renderToStaticMarkup(<App />);

  expect(algorithms[1]?.id).toBe("trump");
  expect(algorithms[1]?.name).toBe("Trump Sort");
  expect(markup).toContain(
    'href="https://gantlaborde.medium.com/trump-sort-a-new-sorting-algorithm-b37b1133356a"',
  );
});
