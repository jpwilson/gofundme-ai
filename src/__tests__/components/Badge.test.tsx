import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/Badge";

describe("Badge component", () => {
  it("renders children content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders gray variant by default", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-gray-100");
    expect(badge.className).toContain("text-gfm-secondary");
  });

  it("renders green variant", () => {
    render(<Badge variant="green">Success</Badge>);
    const badge = screen.getByText("Success");
    expect(badge.className).toContain("bg-gfm-light-green");
    expect(badge.className).toContain("text-gfm-dark-green");
  });

  it("renders yellow variant", () => {
    render(<Badge variant="yellow">Warning</Badge>);
    const badge = screen.getByText("Warning");
    expect(badge.className).toContain("bg-amber-100");
    expect(badge.className).toContain("text-amber-800");
  });

  it("renders gray variant explicitly", () => {
    render(<Badge variant="gray">Info</Badge>);
    const badge = screen.getByText("Info");
    expect(badge.className).toContain("bg-gray-100");
  });

  it("applies custom className", () => {
    render(<Badge className="extra-class">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("extra-class");
  });

  it("renders as a span element", () => {
    render(<Badge>Tag</Badge>);
    const badge = screen.getByText("Tag");
    expect(badge.tagName).toBe("SPAN");
  });

  it("has rounded-full class", () => {
    render(<Badge>Pill</Badge>);
    const badge = screen.getByText("Pill");
    expect(badge.className).toContain("rounded-full");
  });

  it("renders complex children", () => {
    render(
      <Badge variant="green">
        <span data-testid="inner">Inner</span>
      </Badge>
    );
    expect(screen.getByTestId("inner")).toBeInTheDocument();
    expect(screen.getByText("Inner")).toBeInTheDocument();
  });
});
