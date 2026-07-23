import { fireEvent, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { HeroMedia } from "@/components/public/hero-media";

class IntersectionObserverMock implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "0px";
  readonly thresholds = [0.05];
  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();
}

function setReducedMotion(matches: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches,
      media: "(prefers-reduced-motion: reduce)",
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }),
  );
}

describe("HeroMedia", () => {
  beforeEach(() => {
    vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
    vi.spyOn(HTMLMediaElement.prototype, "load").mockImplementation(() => undefined);
    vi.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => undefined);
  });

  afterEach(() => vi.restoreAllMocks());

  it("renders a responsive poster and compatible video attributes", async () => {
    setReducedMotion(false);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<HeroMedia />);

    const poster = container.querySelector(".hero-media-poster img");
    const video = container.querySelector("video");
    expect(poster).toHaveAttribute("src", "/images/optimized/clinic/esclare-hero-poster-v4.webp");
    expect(video).toHaveAttribute("autoplay");
    expect(video).not.toHaveAttribute("loop");
    expect(video).toHaveProperty("loop", false);
    expect(video).toHaveProperty("muted", true);
    expect(video).toHaveAttribute("playsinline");
    expect(video).toHaveAttribute("preload", "auto");
    expect(video).toHaveAttribute("poster", "/images/optimized/clinic/esclare-hero-poster-v4.webp");
    await waitFor(() =>
      expect(video?.querySelector("source")).toHaveAttribute(
        "src",
        "/media/esclare-hero-no-logo-v4.mp4",
      ),
    );
  });

  it("reveals the video only after playback and restores the poster on media failure", async () => {
    setReducedMotion(false);
    vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<HeroMedia />);
    const hero = container.querySelector(".hero-media");
    const video = container.querySelector("video");

    await waitFor(() => expect(video?.querySelector("source")).toBeTruthy());
    expect(hero).toHaveAttribute("data-playback-state", "poster");
    fireEvent.playing(video!);
    expect(hero).toHaveAttribute("data-playback-state", "playing");
    expect(video).toHaveClass("is-visible");
    fireEvent.error(video!);
    expect(hero).toHaveAttribute("data-playback-state", "fallback");
    expect(video).not.toHaveClass("is-visible");
  });

  it("keeps the static poster and does not request video for reduced motion", async () => {
    setReducedMotion(true);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<HeroMedia />);

    await waitFor(() =>
      expect(container.querySelector(".hero-media")).toHaveAttribute(
        "data-playback-state",
        "poster",
      ),
    );
    expect(container.querySelector("video source")).toBeNull();
    expect(play).not.toHaveBeenCalled();
  });

  it("bounds a blocked autoplay to one interaction retry", async () => {
    setReducedMotion(false);
    const play = vi
      .spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValue(new DOMException("Blocked", "NotAllowedError"));
    const { container } = render(<HeroMedia />);
    const video = container.querySelector("video");

    await waitFor(() => expect(video?.querySelector("source")).toBeTruthy());
    fireEvent.canPlay(video!);
    await waitFor(() =>
      expect(container.querySelector(".hero-media")).toHaveAttribute(
        "data-playback-state",
        "fallback",
      ),
    );
    fireEvent.pointerDown(document.body);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(2));
    fireEvent.pointerDown(document.body);
    fireEvent.keyDown(document.body, { key: "Enter" });
    expect(play).toHaveBeenCalledTimes(2);
  });

  it("recovers after the single interaction retry succeeds", async () => {
    setReducedMotion(false);
    vi.spyOn(HTMLMediaElement.prototype, "play")
      .mockRejectedValueOnce(new DOMException("Blocked", "NotAllowedError"))
      .mockResolvedValue(undefined);
    const { container } = render(<HeroMedia />);
    const video = container.querySelector("video");

    await waitFor(() => expect(video?.querySelector("source")).toBeTruthy());
    fireEvent.canPlay(video!);
    await waitFor(() =>
      expect(container.querySelector(".hero-media")).toHaveAttribute(
        "data-playback-state",
        "fallback",
      ),
    );
    fireEvent.pointerDown(document.body);
    await waitFor(() =>
      expect(container.querySelector(".hero-media")).toHaveAttribute(
        "data-playback-state",
        "playing",
      ),
    );
  });

  it("does not restart after the one-shot video completes", async () => {
    setReducedMotion(false);
    const play = vi.spyOn(HTMLMediaElement.prototype, "play").mockResolvedValue(undefined);
    const { container } = render(<HeroMedia />);
    const video = container.querySelector("video")!;

    await waitFor(() => expect(video.querySelector("source")).toBeTruthy());
    fireEvent.canPlay(video);
    await waitFor(() => expect(play).toHaveBeenCalledTimes(1));
    fireEvent.playing(video);
    fireEvent.ended(video);
    fireEvent.canPlay(video);
    expect(video).not.toHaveAttribute("loop");
    expect(container.querySelector(".hero-media")).toHaveAttribute(
      "data-playback-state",
      "complete",
    );
    expect(video).not.toHaveClass("is-visible");
    expect(container.querySelector(".hero-media-poster img")).toHaveAttribute(
      "src",
      "/images/optimized/clinic/esclare-hero-final-frame-v4.webp",
    );
    expect(play).toHaveBeenCalledTimes(1);
  });
});
