import { describe, it, expect, beforeEach } from "vitest";
import { useTriageStore } from "../store/useTriageStore";

describe("useTriageStore", () => {
  beforeEach(() => useTriageStore.getState().reset());

  it("records an answer and advances the question", () => {
    useTriageStore.getState().answer(0, 2);
    expect(useTriageStore.getState().answers[0]).toBe(2);
    expect(useTriageStore.getState().currentQuestion).toBe(1);
  });

  it("goBack does not go below 0", () => {
    useTriageStore.getState().goBack();
    expect(useTriageStore.getState().currentQuestion).toBe(0);
  });

  it("reset clears answers", () => {
    useTriageStore.getState().answer(0, 1);
    useTriageStore.getState().reset();
    expect(useTriageStore.getState().answers[0]).toBeNull();
  });
});