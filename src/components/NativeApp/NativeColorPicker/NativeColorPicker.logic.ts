import { PanResponder } from 'react-native';
import { useEffect, useMemo, useRef, useState } from 'react';
import { hexToHsv, hsvToHex, isHexColor } from '../../../shared/color';

export const hueSpectrum = Array.from({ length: 60 }, (_, index) => {
    return hsvToHex({ h: index * 6, s: 100, v: 100 });
});

export function useNativeColorPicker(color: string, onChange: (color: string) => void) {
    const [width, setWidth] = useState(0);
    const [hex, setHex] = useState(color);
    const start = useRef(0);
    const colorRef = useRef(color);
    const widthRef = useRef(width);
    const onChangeRef = useRef(onChange);
    const hsv = hexToHsv(color);

    useEffect(() => { setHex(color); }, [color]);
    colorRef.current = color;
    widthRef.current = width;
    onChangeRef.current = onChange;

    function drag(position: number) {
        if (!widthRef.current) return;

        const current = hexToHsv(colorRef.current);
        const hue = Math.max(0, Math.min(position / widthRef.current, 1)) * 360;

        onChangeRef.current(hsvToHex({
            h: hue,
            s: Math.max(current.s, 45),
            v: Math.max(current.v, 55),
        }));
    }

    const responder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onMoveShouldSetPanResponder: () => true,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: (event) => {
            start.current = event.nativeEvent.locationX;
            drag(start.current);
        },
        onPanResponderMove: (_, gesture) => drag(start.current + gesture.dx),
    }), []);

    function changeHex(value: string) {
        setHex(value);
        if (isHexColor(value)) onChange(value.toUpperCase());
    }

    function stepHue(direction: number) {
        onChange(hsvToHex({ h: (hsv.h + direction * 10 + 360) % 360, s: hsv.s, v: hsv.v }));
    }

    return { hex, hsv, width, responder, setWidth, setHex, changeHex, stepHue };
}
