import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProgressBar } from "@/components/ui/ProgressBar";

describe("ProgressBar component", () => {
  it("renders with correct width percentage", () => {
    const { container } = render(<ProgressBar percentage={60} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("60%");
  });

  it("clamps percentage above 100", () => {
    const { container } = render(<ProgressBar percentage={150} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("100%");
  });

  it("clamps negative percentage to 0", () => {
    const { container } = render(<ProgressBar percentage={-20} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("0%");
  });

  it("renders sm height variant", () => {
    render(<ProgressBar percentage={50} height="sm" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.className).toContain("h-1");
  });

  it("renders md height variant by default", () => {
    render(<ProgressBar percentage={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.className).toContain("h-2");
  });

  it("renders lg height variant", () => {
    render(<ProgressBar percentage={50} height="lg" />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar.className).toContain("h-3");
  });

  it("does not show label by default", () => {
    render(<ProgressBar percentage={50} />);
    expect(screen.queryByText(/funded/)).toBeNull();
  });

  it("shows label when showLabel is true", () => {
    render(<ProgressBar percentage={75} showLabel />);
    expect(screen.getByText("75% funded")).toBeInTheDocument();
  });

  it("label displays clamped value", () => {
    render(<ProgressBar percentage={150} showLabel />);
    expect(screen.getByText("100% funded")).toBeInTheDocument();
  });

  it("has proper ARIA role", () => {
    render(<ProgressBar percentage={50} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("has aria-valuenow set to clamped percentage", () => {
    render(<ProgressBar percentage={42} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuenow", "42");
  });

  it("has aria-valuemin set to 0", () => {
    render(<ProgressBar percentage={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemin", "0");
  });

  it("has aria-valuemax set to 100", () => {
    render(<ProgressBar percentage={50} />);
    const progressbar = screen.getByRole("progressbar");
    expect(progressbar).toHaveAttribute("aria-valuemax", "100");
  });

  it("applies custom className", () => {
    const { container } = render(
      <ProgressBar percentage={50} className="test-class" />
    );
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("test-class");
  });

  it("handles 0% correctly", () => {
    const { container } = render(<ProgressBar percentage={0} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("0%");
  });

  it("handles 100% correctly", () => {
    const { container } = render(<ProgressBar percentage={100} />);
    const inner = container.querySelector("[style]") as HTMLElement;
    expect(inner.style.width).toBe("100%");
  });
});
