import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressCircle } from "@/components/ui/ProgressCircle";

describe("ProgressCircle component", () => {
  it("renders correct percentage text", () => {
    render(<ProgressCircle percentage={75} />);
    expect(screen.getByText("75%")).toBeInTheDocument();
  });

  it("handles 0%", () => {
    render(<ProgressCircle percentage={0} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("handles 100%", () => {
    render(<ProgressCircle percentage={100} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("clamps values above 100 to 100", () => {
    render(<ProgressCircle percentage={150} />);
    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("clamps negative values to 0", () => {
    render(<ProgressCircle percentage={-10} />);
    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("rounds non-integer percentages", () => {
    render(<ProgressCircle percentage={33.7} />);
    expect(screen.getByText("34%")).toBeInTheDocument();
  });

  it("renders SVG with correct dimensions", () => {
    const { container } = render(<ProgressCircle percentage={50} size={100} />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("width", "100");
    expect(svg).toHaveAttribute("height", "100");
  });

  it("renders two circle elements (background and progress)", () => {
    const { container } = render(<ProgressCircle percentage={50} />);
    const circles = container.querySelectorAll("circle");
    expect(circles.length).toBe(2);
  });

  it("progress circle has correct stroke-dasharray", () => {
    const size = 80;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const { container } = render(
      <ProgressCircle percentage={50} size={size} strokeWidth={strokeWidth} />
    );
    const circles = container.querySelectorAll("circle");
    const progressCircle = circles[1];
    expect(progressCircle.getAttribute("stroke-dasharray")).toBe(
      String(circumference)
    );
  });

  it("progress circle has correct stroke-dashoffset for 50%", () => {
    const size = 80;
    const strokeWidth = 6;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const expectedOffset = circumference - (50 / 100) * circumference;

    const { container } = render(
      <ProgressCircle percentage={50} size={size} strokeWidth={strokeWidth} />
    );
    const circles = container.querySelectorAll("circle");
    const progressCircle = circles[1];
    expect(progressCircle.getAttribute("stroke-dashoffset")).toBe(
      String(expectedOffset)
    );
  });

  it("has aria-label with percentage", () => {
    const { container } = render(<ProgressCircle percentage={65} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-label", "65% progress");
  });

  it("has img role on svg", () => {
    render(<ProgressCircle percentage={50} />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProgressCircle percentage={50} className="my-class" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("my-class");
  });
});
