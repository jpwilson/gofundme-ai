import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/ui/Avatar";

describe("Avatar component", () => {
  it("renders image when src is provided", () => {
    render(<Avatar src="/test.jpg" alt="Test user" />);
    const img = screen.getByRole("img");
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute("src", "/test.jpg");
    expect(img).toHaveAttribute("alt", "Test user");
  });

  it("shows initial letter when no src is provided", () => {
    render(<Avatar name="John" />);
    expect(screen.getByText("J")).toBeInTheDocument();
  });

  it("shows uppercase initial", () => {
    render(<Avatar name="alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("shows ? when no name and no src", () => {
    render(<Avatar />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });

  it("uses name as alt fallback when alt not provided", () => {
    render(<Avatar src="/test.jpg" name="Jane" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Jane");
  });

  it("uses 'Avatar' as alt fallback when no alt or name", () => {
    render(<Avatar src="/test.jpg" />);
    const img = screen.getByRole("img");
    expect(img).toHaveAttribute("alt", "Avatar");
  });

  it("renders xs size", () => {
    const { container } = render(<Avatar name="A" size="xs" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-6");
    expect(wrapper.className).toContain("w-6");
  });

  it("renders sm size", () => {
    const { container } = render(<Avatar name="A" size="sm" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-8");
    expect(wrapper.className).toContain("w-8");
  });

  it("renders md size by default", () => {
    const { container } = render(<Avatar name="A" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-10");
    expect(wrapper.className).toContain("w-10");
  });

  it("renders lg size", () => {
    const { container } = render(<Avatar name="A" size="lg" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-16");
    expect(wrapper.className).toContain("w-16");
  });

  it("renders xl size", () => {
    const { container } = render(<Avatar name="A" size="xl" />);
    const wrapper = container.firstElementChild as HTMLElement;
    expect(wrapper.className).toContain("h-24");
    expect(wrapper.className).toContain("w-24");
  });

  it("shows online indicator when showOnline is true", () => {
    const { container } = render(<Avatar name="A" showOnline />);
    const indicator = container.querySelector("span.absolute");
    expect(indicator).toBeInTheDocument();
    expect(indicator!.className).toContain("bg-gfm-green");
  });

  it("does not show online indicator by default", () => {
    const { container } = render(<Avatar name="A" />);
    const indicator = container.querySelector("span.absolute");
    expect(indicator).toBeNull();
  });

  it("renders fallback div (not img) when src is null", () => {
    render(<Avatar src={null} name="Bob" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("B")).toBeInTheDocument();
  });
});
