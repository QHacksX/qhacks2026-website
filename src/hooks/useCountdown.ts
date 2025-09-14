'use client'
import { useEffect, useMemo, useState } from "react";

type Time = {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    total: number;
}

function TimeLeft(target: Date): Time {
    const d = Math.floor((target.getTime() - new Date().getTime()) / 1000);
    const days = Math.floor(d / (3600 * 24));
    const hours = Math.floor((d % (3600 * 24)) / 3600);
    const minutes = Math.floor((d % 3600) / 60);
    const seconds = Math.floor(d % 60);
    return {
        days,
        hours,
        minutes,
        seconds,
        total: d
    };
}
// Explain what this function does
// This function takes a target date as input and calculates the time left until that date from the current time. It returns an object containing the number of days, hours, minutes, seconds, and the total time left in seconds.

export function useCountdown(targetDate: Date) {
    const target = useMemo(() => targetDate, [targetDate]);
    const [timeLeft, setTimeLeft] = useState<Time>(TimeLeft(target));
    useEffect(() => {
        const tick = () => setTimeLeft(TimeLeft(target));
        tick();
        const align = setTimeout(() => {
        tick();
        const id = setInterval(() => {
            setTimeLeft((prev) => {
            const next = TimeLeft(target);
            if (next.total === 0 && prev.total !== 0) clearInterval(id);
            return next;
            });
        }, 1000);
        }, 1000 - (Date.now() % 1000));
        return () => {
        clearTimeout(align);
        }

    }, [target]);
    return timeLeft;
}

// Explain what this hook does
// This hook, useCountdown, takes a target date as input and returns the time left until that date in days, hours, minutes, seconds, and total seconds. It updates the time left every second using a combination of setTimeout and setInterval to ensure accurate timing aligned with the start of each second.