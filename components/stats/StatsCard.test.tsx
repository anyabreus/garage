import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import StatsCard from "./StatsCard";

describe("StatsCard", () => {
  it("renders the label", () => {
    render(<StatsCard label="Avg. consumption" value="7.2" />);

    expect(screen.getByText("Avg. consumption")).toBeDefined();
  });

  it("renders the value", () => {
    render(<StatsCard label="Avg. consumption" value="7.2" />);

    expect(screen.getByText("7.2")).toBeDefined();
  });

  it("renders the unit when provided", () => {
    render(<StatsCard label="Avg. consumption" value="7.2" unit="L/100km" />);

    expect(screen.getByText("L/100km")).toBeDefined();
  });

  it("does not render the unit when not provided", () => {
    render(<StatsCard label="Avg. consumption" value="7.2" />);

    expect(screen.queryByText("L/100km")).toBeNull();
  });
});
