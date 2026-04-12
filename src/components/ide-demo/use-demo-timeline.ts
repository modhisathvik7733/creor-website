"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { DEMO_PROMPT, DEMO_STEPS } from "./demo-data";

export type Phase =
  | "idle"
  | "typing"
  | "sent"
  | "searching"
  | "steps"
  | "response"
  | "accept-bar"
  | "accepting"
  | "reset-pause";

export interface DemoTimelineState {
  phase: Phase;
  typedChars: number;
  visibleSteps: number;
  showResponse: boolean;
  showAcceptBar: boolean;
  acceptHighlight: boolean;
  activeFile: string | null;
}

const INITIAL_STATE: DemoTimelineState = {
  phase: "idle",
  typedChars: 0,
  visibleSteps: 0,
  showResponse: false,
  showAcceptBar: false,
  acceptHighlight: false,
  activeFile: null,
};

const TIMING = {
  idle: 800,
  typeInterval: 50,
  sent: 400,
  searching: 1000,
  stepInterval: 500,
  response: 800,
  acceptBar: 1000,
  accepting: 1000,
  resetPause: 800,
};

export function useDemoTimeline(isInView: boolean): DemoTimelineState {
  const [state, setState] = useState<DemoTimelineState>(INITIAL_STATE);
  const timers = useRef<number[]>([]);
  const typingInterval = useRef<number | null>(null);
  const isRunning = useRef(false);

  const addTimer = useCallback((fn: () => void, delay: number) => {
    const id = window.setTimeout(fn, delay);
    timers.current.push(id);
    return id;
  }, []);

  const clearAll = useCallback(() => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    if (typingInterval.current !== null) {
      window.clearInterval(typingInterval.current);
      typingInterval.current = null;
    }
    isRunning.current = false;
  }, []);

  const startCycle = useCallback(() => {
    if (!isRunning.current) return;

    setState(INITIAL_STATE);

    let elapsed = 0;

    // Phase: idle -> typing (in input box)
    elapsed += TIMING.idle;
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "typing" }));

      let chars = 0;
      typingInterval.current = window.setInterval(() => {
        if (!isRunning.current) return;
        chars++;
        setState((s) => ({ ...s, typedChars: chars }));
        if (chars >= DEMO_PROMPT.length) {
          if (typingInterval.current !== null) {
            window.clearInterval(typingInterval.current);
            typingInterval.current = null;
          }
        }
      }, TIMING.typeInterval);
    }, elapsed);

    // Phase: sent (prompt moves from input to chat bubble)
    const typingDuration = DEMO_PROMPT.length * TIMING.typeInterval;
    elapsed += typingDuration + 300;
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "sent" }));
    }, elapsed);

    // Phase: searching
    elapsed += TIMING.sent;
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "searching" }));
    }, elapsed);

    // Phase: steps (one by one)
    elapsed += TIMING.searching;
    for (let i = 0; i < DEMO_STEPS.length; i++) {
      const stepDelay = elapsed + i * TIMING.stepInterval;
      addTimer(() => {
        if (!isRunning.current) return;
        setState((s) => ({
          ...s,
          phase: "steps",
          visibleSteps: i + 1,
          activeFile: DEMO_STEPS[i].targetFile ?? null,
        }));
      }, stepDelay);
    }
    elapsed += DEMO_STEPS.length * TIMING.stepInterval;

    // Phase: response
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "response", showResponse: true }));
    }, elapsed);
    elapsed += TIMING.response;

    // Phase: accept-bar
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "accept-bar", showAcceptBar: true }));
    }, elapsed);
    elapsed += TIMING.acceptBar;

    // Phase: accepting (highlight Accept All — diffs disappear instantly)
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({ ...s, phase: "accepting", acceptHighlight: true }));
    }, elapsed);
    elapsed += 400;

    // Phase: reset-pause (everything else disappears together)
    addTimer(() => {
      if (!isRunning.current) return;
      setState((s) => ({
        ...s,
        phase: "reset-pause",
        showAcceptBar: false,
        acceptHighlight: false,
      }));
    }, elapsed);
    elapsed += TIMING.resetPause;

    // Restart
    addTimer(() => {
      if (!isRunning.current) return;
      startCycle();
    }, elapsed);
  }, [addTimer]);

  useEffect(() => {
    if (isInView) {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReduced) {
        setState({
          phase: "accept-bar",
          typedChars: DEMO_PROMPT.length,
          visibleSteps: DEMO_STEPS.length,
          showResponse: true,
          showAcceptBar: true,
          acceptHighlight: false,
          activeFile: null,
        });
        return;
      }

      isRunning.current = true;
      startCycle();
    } else {
      clearAll();
      setState(INITIAL_STATE);
    }

    return () => clearAll();
  }, [isInView, startCycle, clearAll]);

  return state;
}
