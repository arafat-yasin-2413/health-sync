"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useMemo, useRef, useState } from "react";

interface CanvasTextProps {
    text: string;
    className?: string;
    backgroundClassName?: string;
    colors?: string[];
    animationDuration?: number;
    lineWidth?: number;
    lineGap?: number;
    curveIntensity?: number;
    overlay?: boolean;
}

const DEFAULT_COLORS = [
    "#ff6b6b",
    "#4ecdc4",
    "#45b7d1",
    "#96ceb4",
    "#ffeaa7",
    "#dfe6e9",
];

function resolveColor(color: string): string {
    if (typeof window === "undefined") return color;

    if (color.startsWith("var(")) {
        const varName = color.slice(4, -1).trim();
        const resolved = getComputedStyle(document.documentElement)
            .getPropertyValue(varName)
            .trim();

        return resolved || color;
    }

    return color;
}

export function CanvasText({
    text,
    className = "",
    backgroundClassName = "bg-white dark:bg-neutral-950",
    colors = DEFAULT_COLORS,
    animationDuration = 5,
    lineWidth = 1.5,
    lineGap = 10,
    curveIntensity = 60,
    overlay = false,
}: CanvasTextProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const bgRef = useRef<HTMLSpanElement>(null);

    const animationRef = useRef<number>(0);
    const startTimeRef = useRef<number>(0);

    const [bgColor, setBgColor] = useState("#0a0a0a");

    const [dimensions, setDimensions] = useState({
        width: 0,
        height: 0,
    });

    const [font, setFont] = useState("");

    const resolvedColors = useMemo(
        () => colors.map(resolveColor),
        [colors],
    );

    // Update background color (theme change)
    useEffect(() => {
        const updateBgColor = () => {
            if (!bgRef.current) return;

            const next = getComputedStyle(bgRef.current).backgroundColor;

            setBgColor((prev) => (prev === next ? prev : next));
        };

        updateBgColor();

        const observer = new MutationObserver(updateBgColor);

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ["class"],
        });

        return () => observer.disconnect();
    }, []);

    // Measure text
    useEffect(() => {
        const textEl = textRef.current;

        if (!textEl) return;

        const updateDimensions = () => {
            const rect = textEl.getBoundingClientRect();
            const computed = getComputedStyle(textEl);

            const nextDimensions = {
                width: Math.ceil(rect.width) || 400,
                height: Math.ceil(rect.height) || 200,
            };

            setDimensions((prev) =>
                prev.width === nextDimensions.width &&
                prev.height === nextDimensions.height
                    ? prev
                    : nextDimensions,
            );

            const nextFont = `${computed.fontWeight} ${computed.fontSize} ${computed.fontFamily}`;

            setFont((prev) => (prev === nextFont ? prev : nextFont));
        };

        updateDimensions();

        const resizeObserver = new ResizeObserver(updateDimensions);

        resizeObserver.observe(textEl);

        return () => resizeObserver.disconnect();
    }, [text, className]);

    // Draw animation
    useEffect(() => {
        const canvas = canvasRef.current;

        if (
            !canvas ||
            !font ||
            dimensions.width === 0 ||
            resolvedColors.length === 0
        ) {
            return;
        }

        const ctx = canvas.getContext("2d", { alpha: true });

        if (!ctx) return;

        const { width, height } = dimensions;

        const dpr = window.devicePixelRatio || 1;

        canvas.width = width * dpr;
        canvas.height = height * dpr;

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.font = font;

        const metrics = ctx.measureText(text);

        const baselineY =
            (height +
                metrics.actualBoundingBoxAscent -
                metrics.actualBoundingBoxDescent) /
            2;

        const numLines = Math.floor(height / lineGap) + 10;

        startTimeRef.current = performance.now();

        const animate = (time: number) => {
            const elapsed = (time - startTimeRef.current) / 1000;

            const phase =
                (elapsed / animationDuration) * Math.PI * 2;

            ctx.clearRect(0, 0, width, height);

            ctx.globalCompositeOperation = "source-over";
            ctx.font = font;
            ctx.textAlign = "left";
            ctx.textBaseline = "alphabetic";

            ctx.fillStyle = "#000";
            ctx.fillText(text, 0, baselineY);

            ctx.globalCompositeOperation = "source-in";
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, width, height);

            ctx.globalCompositeOperation = "source-atop";

            for (let i = 0; i < numLines; i++) {
                const y = i * lineGap;

                const curve1 = Math.sin(phase) * curveIntensity;
                const curve2 =
                    Math.sin(phase + 0.5) *
                    curveIntensity *
                    0.6;

                ctx.beginPath();
                ctx.moveTo(0, y);

                ctx.bezierCurveTo(
                    width * 0.33,
                    y + curve1,
                    width * 0.66,
                    y + curve2,
                    width,
                    y,
                );

                ctx.strokeStyle =
                    resolvedColors[i % resolvedColors.length];

                ctx.lineWidth = lineWidth;

                ctx.stroke();
            }

            animationRef.current =
                requestAnimationFrame(animate);
        };

        animationRef.current =
            requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationRef.current);
        };
    }, [
        text,
        font,
        bgColor,
        dimensions,
        resolvedColors,
        animationDuration,
        lineGap,
        lineWidth,
        curveIntensity,
    ]);

    return (
        <span
            className={cn(
                "relative inline-block",
                overlay && "absolute inset-0",
                className,
            )}
        >
            <span
                ref={bgRef}
                className={cn(
                    "pointer-events-none absolute h-0 w-0 opacity-0",
                    backgroundClassName,
                )}
                aria-hidden="true"
            />

            <span
                ref={textRef}
                className="invisible inline-block whitespace-pre"
                aria-hidden="true"
            >
                {text}
            </span>

            <canvas
                ref={canvasRef}
                className="pointer-events-none absolute top-0 left-0"
                style={{
                    width: dimensions.width || "auto",
                    height: dimensions.height || "auto",
                }}
                aria-label={text}
                role="img"
            />
        </span>
    );
}