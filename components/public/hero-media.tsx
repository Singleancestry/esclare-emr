"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_SOURCE = "/media/esclare-hero-no-logo-v4.mp4";
const INITIAL_POSTER = "/images/optimized/clinic/esclare-hero-poster-v4.webp";
const FINAL_FRAME = "/images/optimized/clinic/esclare-hero-final-frame-v4.webp";

type MotionPreference = "unknown" | "allow" | "reduce";
type PlaybackState = "poster" | "playing" | "complete" | "fallback";

export function HeroMedia() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playbackBlockedRef = useRef(false);
  const interactionRetryUsedRef = useRef(false);
  const canPlayRef = useRef(false);
  const isInViewportRef = useRef(true);
  const completedRef = useRef(false);
  const [motionPreference, setMotionPreference] = useState<MotionPreference>("unknown");
  const [playbackState, setPlaybackState] = useState<PlaybackState>("poster");

  const attemptPlayback = useCallback(async () => {
    const video = videoRef.current;
    if (
      !video ||
      motionPreference !== "allow" ||
      document.hidden ||
      !isInViewportRef.current ||
      completedRef.current
    ) {
      return;
    }

    try {
      video.muted = true;
      await video.play();
      playbackBlockedRef.current = false;
      setPlaybackState("playing");
    } catch {
      playbackBlockedRef.current = !interactionRetryUsedRef.current;
      setPlaybackState("fallback");
    }
  }, [motionPreference]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const finalFrame = new Image();
    finalFrame.src = FINAL_FRAME;
    const updatePreference = () => {
      setMotionPreference(mediaQuery.matches ? "reduce" : "allow");
      if (mediaQuery.matches) {
        videoRef.current?.pause();
        setPlaybackState("poster");
      }
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || motionPreference !== "allow") return;

    video.load();

    const retryAfterInteraction = () => {
      if (playbackBlockedRef.current && !interactionRetryUsedRef.current) {
        interactionRetryUsedRef.current = true;
        playbackBlockedRef.current = false;
        void attemptPlayback();
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) {
        video.pause();
      } else if (canPlayRef.current) {
        void attemptPlayback();
      }
    };
    const observer = new IntersectionObserver(
      ([entry]) => {
        isInViewportRef.current = entry?.isIntersecting ?? true;
        if (!isInViewportRef.current) {
          video.pause();
        } else if (canPlayRef.current) {
          void attemptPlayback();
        }
      },
      { threshold: 0.05 },
    );

    observer.observe(video);
    document.addEventListener("pointerdown", retryAfterInteraction);
    document.addEventListener("keydown", retryAfterInteraction);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      observer.disconnect();
      document.removeEventListener("pointerdown", retryAfterInteraction);
      document.removeEventListener("keydown", retryAfterInteraction);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [attemptPlayback, motionPreference]);

  const videoVisible = playbackState === "playing";
  const posterSource = playbackState === "complete" ? FINAL_FRAME : INITIAL_POSTER;

  return (
    <div className="hero-media" data-playback-state={playbackState} aria-hidden="true">
      <picture className="hero-media-poster cinematic-hero-image">
        <source media="(max-width: 767px)" srcSet={posterSource} />
        <img src={posterSource} alt="" fetchPriority="high" />
      </picture>
      <video
        ref={videoRef}
        className={`hero-media-video${videoVisible ? " is-visible" : ""}`}
        autoPlay
        muted
        playsInline
        preload="auto"
        poster={INITIAL_POSTER}
        disablePictureInPicture
        tabIndex={-1}
        onCanPlay={() => {
          canPlayRef.current = true;
          void attemptPlayback();
        }}
        onPlaying={() => {
          playbackBlockedRef.current = false;
          setPlaybackState("playing");
        }}
        onEnded={() => {
          videoRef.current?.pause();
          completedRef.current = true;
          canPlayRef.current = false;
          setPlaybackState("complete");
        }}
        onError={() => {
          canPlayRef.current = false;
          playbackBlockedRef.current = false;
          setPlaybackState("fallback");
        }}
      >
        {motionPreference === "allow" ? <source src={VIDEO_SOURCE} type="video/mp4" /> : null}
      </video>
    </div>
  );
}
