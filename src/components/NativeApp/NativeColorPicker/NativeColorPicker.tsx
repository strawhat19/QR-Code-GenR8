import { View, Text, TextInput } from 'react-native';
import { nativeElement } from '../NativeApp.logic';
import type { NativeStyles } from '../NativeApp.styles';
import { hueSpectrum, useNativeColorPicker } from './NativeColorPicker.logic';

type NativeColorPickerProps = {
    color: string;
    styles: NativeStyles;
    onChange: (color: string) => void;
};

export default function NativeColorPicker({ color, styles, onChange }: NativeColorPickerProps) {
    const picker = useNativeColorPicker(color, onChange);

    return (
        <View {...nativeElement(`native-color-picker`)} style={styles.group}>
            <View {...nativeElement(`native-color-picker-heading`)} style={styles.colorHeader}>
                <Text {...nativeElement(`native-color-picker-label`)} style={styles.label}>
                    {`Make it your color`}
                </Text>
                <TextInput
                    {...nativeElement(`native-color-picker-hex`)}
                    value={picker.hex}
                    maxLength={7}
                    style={styles.hexInput}
                    autoCorrect={false}
                    autoCapitalize={`characters`}
                    accessibilityLabel={`Brand color hexadecimal value`}
                    onChangeText={picker.changeHex}
                    onBlur={() => picker.setHex(color)}
                />
            </View>
            <View
                {...picker.responder.panHandlers}
                {...nativeElement(`native-color-picker-hue-track`)}
                accessible
                style={styles.hueTrack}
                accessibilityRole={`adjustable`}
                accessibilityLabel={`Brand color hue`}
                onLayout={(event) => picker.setWidth(event.nativeEvent.layout.width)}
                accessibilityValue={{ min: 0, max: 360, now: Math.round(picker.hsv.h) }}
                accessibilityActions={[{ name: `increment` }, { name: `decrement` }]}
                onAccessibilityAction={(event) => {
                    picker.stepHue(event.nativeEvent.actionName === `increment` ? 1 : -1);
                }}
            >
                <View
                    {...nativeElement(`native-color-picker-hue-spectrum`)}
                    pointerEvents={`none`}
                    style={styles.hueSpectrum}
                >
                    {hueSpectrum.map((segment, index) => (
                        <View
                            key={index}
                            {...nativeElement(`native-color-picker-segment-${index}`)}
                            style={[styles.hueSegment, { backgroundColor: segment }]}
                        />
                    ))}
                </View>
                <View
                    {...nativeElement(`native-color-picker-thumb`)}
                    pointerEvents={`none`}
                    style={[
                        styles.hueThumb,
                        { backgroundColor: color, left: picker.width * picker.hsv.h / 360 - 13 },
                    ]}
                />
            </View>
            <Text {...nativeElement(`native-color-picker-hint`)} style={styles.helper}>
                {`Drag to change the app, its logo, and your QR code together.`}
            </Text>
        </View>
    );
}
