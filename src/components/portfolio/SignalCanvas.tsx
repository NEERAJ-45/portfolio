"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";

type Point = { x: number; y: number };

type SignalPath = {
  from: [number, number];
  c1: [number, number];
  c2: [number, number];
  to: [number, number];
  speed: number;
  phase: number;
};

const paths: SignalPath[] = [
  {
    from: [0.04, 0.78],
    c1: [0.2, 0.48],
    c2: [0.42, 0.84],
    to: [0.58, 0.58],
    speed: 0.000052,
    phase: 0.08,
  },
  {
    from: [0.16, 0.24],
    c1: [0.34, 0.16],
    c2: [0.46, 0.42],
    to: [0.72, 0.34],
    speed: 0.000041,
    phase: 0.58,
  },
  {
    from: [0.28, 0.92],
    c1: [0.46, 0.72],
    c2: [0.6, 0.96],
    to: [0.86, 0.7],
    speed: 0.000061,
    phase: 0.34,
  },
  {
    from: [0.5, 0.2],
    c1: [0.66, 0.3],
    c2: [0.7, 0.12],
    to: [0.94, 0.22],
    speed: 0.000045,
    phase: 0.82,
  },
  {
    from: [0.62, 0.82],
    c1: [0.72, 0.6],
    c2: [0.84, 0.88],
    to: [0.98, 0.62],
    speed: 0.00007,
    phase: 0.2,
  },
];

const ink = "#12110e";
const acid = "#d7ff4b";

function cubicPoint(
  t: number,
  p0: Point,
  p1: Point,
  p2: Point,
  p3: Point,
): Point {
  const u = 1 - t;
  const uu = u * u;
  const tt = t * t;

  return {
    x: uu * u * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + tt * t * p3.x,
    y: uu * u * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + tt * t * p3.y,
  };
}

export default function SignalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    const ctx = context;
    let width = 0;
    let height = 0;
    let raf = 0;
    let running = false;
    let visible = true;

    const drawNode = (point: Point, accent = false) => {
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = accent ? acid : ink;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(point.x, point.y, 7, 0, Math.PI * 2);
      ctx.strokeStyle = accent ? "rgba(215, 255, 75, 0.4)" : "rgba(18, 17, 14, 0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
    };

    const draw = (time: number) => {
      ctx.clearRect(0, 0, width, height);

      paths.forEach((path, index) => {
        const p0 = { x: path.from[0] * width, y: path.from[1] * height };
        const p1 = { x: path.c1[0] * width, y: path.c1[1] * height };
        const p2 = { x: path.c2[0] * width, y: path.c2[1] * height };
        const p3 = { x: path.to[0] * width, y: path.to[1] * height };

        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
        ctx.strokeStyle = "rgba(18, 17, 14, 0.09)";
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.setLineDash([1, 9]);
        ctx.strokeStyle = "rgba(18, 17, 14, 0.14)";
        ctx.stroke();
        ctx.setLineDash([]);

        drawNode(p0, index % 2 === 0);
        drawNode(p3, index % 2 !== 0);

        const packetTime = reduce
          ? (path.phase + index * 0.17) % 1
          : (time * path.speed + path.phase) % 1;
        const previousTime = Math.max(0, packetTime - 0.025);

        const packet = cubicPoint(packetTime, p0, p1, p2, p3);
        const previous = cubicPoint(previousTime, p0, p1, p2, p3);

        ctx.beginPath();
        ctx.moveTo(previous.x, previous.y);
        ctx.lineTo(packet.x, packet.y);
        ctx.strokeStyle = "rgba(215, 255, 75, 0.9)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 8, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(215, 255, 75, 0.18)";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(packet.x, packet.y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = acid;
        ctx.fill();
      });
    };

    const loop = (time: number) => {
      if (!running) return;
      draw(time);
      raf = window.requestAnimationFrame(loop);
    };

    const start = () => {
      if (reduce || running) return;
      running = true;
      raf = window.requestAnimationFrame(loop);
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(raf);
    };

    const resize = () => {
      const parent = canvas.parentElement;
      const bounds = parent?.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      width = Math.max(1, Math.round(bounds?.width ?? window.innerWidth));
      height = Math.max(1, Math.round(bounds?.height ?? window.innerHeight));

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (reduce || !running) {
        draw(0);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (visible) {
          start();
        } else {
          stop();
        }
      },
      { threshold: 0.01 },
    );

    intersectionObserver.observe(canvas);
    window.addEventListener("resize", resize);

    resize();

    if (reduce) {
      draw(0);
    } else {
      start();
    }

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [reduce]);

  return <canvas ref={canvasRef} className="signal-canvas" aria-hidden="true" />;
}
