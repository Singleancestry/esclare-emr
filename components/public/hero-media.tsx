"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const VIDEO_SOURCE = "/media/esclare-hero-no-logo-v4.mp4";
const MOBILE_VIDEO_SOURCE = "/media/esclare-hero-no-logo-v4-mobile.mp4";
const INITIAL_POSTER = "/images/optimized/clinic/esclare-hero-poster-v4.webp";
const FINAL_FRAME = "/images/optimized/clinic/esclare-hero-final-frame-v4.webp";
const MOBILE_INITIAL_POSTER = "/images/optimized/clinic/esclare-hero-poster-v4-mobile.webp";
const MOBILE_FINAL_FRAME = "/images/optimized/clinic/esclare-hero-final-frame-v4-mobile.webp";
const VIDEO_START_DELAY_MS = 4_000;

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
  const [videoReady, setVideoReady] = useState(false);

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
        setVideoReady(false);
        videoRef.current?.pause();
        setPlaybackState("poster");
      }
    };

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);
    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    if (motionPreference !== "allow") return;

    let startTask: number | undefined;
    const enableVideo = () => {
      if (startTask !== undefined) window.clearTimeout(startTask);
      setVideoReady(true);
    };
    const scheduleVideo = () => {
      startTask = window.setTimeout(enableVideo, VIDEO_START_DELAY_MS);
    };
    if (document.readyState === "complete") {
      scheduleVideo();
    } else {
      window.addEventListener("load", scheduleVideo, { once: true });
    }

    document.addEventListener("pointerdown", enableVideo, { once: true });
    document.addEventListener("keydown", enableVideo, { once: true });
    return () => {
      if (startTask !== undefined) window.clearTimeout(startTask);
      window.removeEventListener("load", scheduleVideo);
      document.removeEventListener("pointerdown", enableVideo);
      document.removeEventListener("keydown", enableVideo);
    };
  }, [motionPreference]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || motionPreference !== "allow" || !videoReady) return;

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
  }, [attemptPlayback, motionPreference, videoReady]);

  const videoVisible = playbackState === "playing";
  const posterSource = playbackState === "complete" ? FINAL_FRAME : INITIAL_POSTER;
  const mobilePosterSource =
    playbackState === "complete" ? MOBILE_FINAL_FRAME : MOBILE_INITIAL_POSTER;

  return (
    <>
      <link
        rel="preload"
        as="image"
        href={MOBILE_INITIAL_POSTER}
        media="(max-width: 767px)"
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={INITIAL_POSTER}
        media="(min-width: 768px)"
        fetchPriority="high"
      />
      <div className="hero-media" data-playback-state={playbackState} aria-hidden="true">
        <picture className="hero-media-poster">
          <source media="(min-width: 768px)" srcSet={posterSource} />
          <img src={mobilePosterSource} alt="" fetchPriority="high" />
        </picture>
        <video
          ref={videoRef}
          className={`hero-media-video${videoVisible ? " is-visible" : ""}`}
          autoPlay
          muted
          playsInline
          preload="none"
          disablePictureInPicture
          tabIndex={-1}
          onCanPlay={() => {
            canPlayRef.current = true;
            void attemptPlayback();
          }}
          onPlaying={() => {
            if (completedRef.current) {
              videoRef.current?.pause();
              return;
            }
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
          {videoReady ? (
            <>
              <source media="(max-width: 767px)" src={MOBILE_VIDEO_SOURCE} type="video/mp4" />
              <source src={VIDEO_SOURCE} type="video/mp4" />
            </>
          ) : null}
        </video>
      </div>
    </>
  );
}
