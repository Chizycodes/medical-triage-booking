import { describe, it, expect } from "vitest";
import { useAuthStore } from "../store/useAuthStore";

describe("useAuthStore", () => {
  it("login sets the user", () => {
    useAuthStore.getState().login("demo@meditriage.com");
    expect(useAuthStore.getState().user).toBe("demo@meditriage.com");
  });

  it("logout clears the user", () => {
    useAuthStore.getState().login("demo@meditriage.com");
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
  });
});