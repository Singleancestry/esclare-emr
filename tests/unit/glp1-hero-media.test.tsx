import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Glp1HeroMedia } from "@/components/public/glp1-hero-media";

function setReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }),
  );
}

describe("Glp1HeroMedia", () => {
  beforeEach(() => {
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it("plays the optimized video once without audio or looping", async () => {
    setReducedMotion(false);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<Glp1HeroMedia />);
    const video = container.querySelector("video")!;

    await waitFor(() =>
      expect(video.querySelector("source")).toHaveAttribute(
        "src",
        "/media/glp-1-slimming-hero.mp4",
      ),
    );
    expect(video).toHaveAttribute("autoplay");
    expect(video).toHaveAttribute("playsinline");
    expect(video).not.toHaveAttribute("loop");
    expect(video).toHaveProperty("muted", true);
  });

  it("switches to the generated final frame after playback", async () => {
    setReducedMotion(false);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<Glp1HeroMedia />);
    const video = container.querySelector("video")!;

    await waitFor(() => expect(video.querySelector("source")).toBeTruthy());
    fireEvent.playing(video);
    fireEvent.ended(video);
    expect(container.querySelector(".glp1-hero-media")).toHaveAttribute(
      "data-playback-state",
      "complete",
    );
    expect(container.querySelector("img")).toHaveAttribute(
      "src",
      "/images/optimized/glp-1/glp-1-hero-final.webp",
    );
    expect(play).toHaveBeenCalledTimes(1);
  });

  it("keeps the poster and omits the video source for reduced motion", async () => {
    setReducedMotion(true);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<Glp1HeroMedia />);

    await waitFor(() =>
      expect(container.querySelector(".glp1-hero-media")).toHaveAttribute(
        "data-playback-state",
        "poster",
      ),
    );
    expect(container.querySelector("video source")).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });
});
