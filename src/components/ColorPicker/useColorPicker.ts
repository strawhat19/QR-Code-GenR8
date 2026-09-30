import { useRef, useState, useEffect } from 'react';
import type { KeyboardEvent, PointerEvent } from 'react';
import { hexToHsv, hsvToHex, isHexColor } from '../../shared/color';

export function useColorPicker(color: string, onChange: (color: string) => void) {
    const [hex, setHex] = useState(color.toUpperCase());
    const [hsv, setHsv] = useState(() => hexToHsv(color));
    const hsvRef = useRef(hsv);
    const lastColor = useRef(color);
    const frame = useRef<number | null>(null);
    const dragging = useRef<`field` | `hue` | null>(null);

    useEffect(() => {
        setHex(color.toUpperCase());
        if (color !== lastColor.current) {
            const next = hexToHsv(color);
            hsvRef.current = next;
            setHsv(next);
        }
    }, [color]);

    useEffect(() => () => {
        if (frame.current !== null) cancelAnimationFrame(frame.current);
    }, []);

    function update(next: typeof hsv) {
        hsvRef.current = next;
        setHsv(next);
        const value = hsvToHex(next);
        lastColor.current = value;
        setHex(value.toUpperCase());
        if (frame.current !== null) cancelAnimationFrame(frame.current);
        frame.current = requestAnimationFrame(() => onChange(value));
    }

    function move(event: PointerEvent<HTMLElement>, kind: `field` | `hue`) {
        const box = event.currentTarget.getBoundingClientRect();
        const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
        const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
        update(kind === `hue`
            ? { ...hsvRef.current, h: x * 360 }
            : { ...hsvRef.current, s: x * 100, v: (1 - y) * 100 });
    }

    function pointerDown(event: PointerEvent<HTMLElement>, kind: `field` | `hue`) {
        event.preventDefault();
        event.currentTarget.focus();
        event.currentTarget.setPointerCapture(event.pointerId);
        dragging.current = kind;
        move(event, kind);
    }

    function pointerMove(event: PointerEvent<HTMLElement>, kind: `field` | `hue`) {
        if (dragging.current === kind) move(event, kind);
    }

    function pointerUp() { dragging.current = null; }

    function keyboard(event: KeyboardEvent<HTMLElement>, kind: `field` | `hue`) {
        if (![ `ArrowLeft`, `ArrowRight`, `ArrowUp`, `ArrowDown`, `Home`, `End` ].includes(event.key)) return;
        event.preventDefault();
        const current = hsvRef.current;
        const direction = event.key === `ArrowLeft` || event.key === `ArrowDown` ? -1 : 1;
        const step = event.shiftKey ? 10 : 1;
        if (kind === `hue`) {
            const h = event.key === `Home` ? 0 : event.key === `End` ? 360 : current.h + direction * step;
            update({ ...current, h: Math.max(0, Math.min(360, h)) });
        } else {
            const axis = event.key === `ArrowUp` || event.key === `ArrowDown` ? `v` : `s`;
            const value = event.key === `Home` ? 0 : event.key === `End` ? 100 : current[axis] + direction * step;
            update({ ...current, [axis]: Math.max(0, Math.min(100, value)) });
        }
    }

    function changeHex(value: string) {
        setHex(value.toUpperCase());
        const candidate = value.startsWith(`#`) ? value : `#${value}`;
        if (isHexColor(candidate) && candidate.length === 7) onChange(candidate);
    }

    return { hsv, hex, setHex, changeHex, pointerDown, pointerMove, pointerUp, keyboard };
}
