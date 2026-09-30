import { SafeAreaView } from 'react-native-safe-area-context';
import { useNativeProfile } from './NativeProfile.logic';
import { nativeElement } from '../NativeApp.logic';
import type { NativeStyles } from '../NativeApp.styles';
import { Modal, View, Text, ScrollView, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';

type NativeProfileProps = {
    open: boolean;
    styles: NativeStyles;
    onClose: () => void;
    onComplete: () => void;
};

export default function NativeProfile({ open, styles, onClose, onComplete }: NativeProfileProps) {
    const profile = useNativeProfile(onComplete);

    return (
        <Modal
            visible={open}
            animationType={`slide`}
            presentationStyle={`pageSheet`}
            onRequestClose={onClose}
        >
            <SafeAreaView {...nativeElement(`native-profile-page`)} style={styles.modalScreen}>
                <KeyboardAvoidingView
                    {...nativeElement(`native-profile-keyboard-container`)}
                    style={{ flex: 1 }}
                    behavior={Platform.OS === `ios` ? `padding` : undefined}
                >
                    <ScrollView
                        {...nativeElement(`native-profile-scroll`)}
                        keyboardShouldPersistTaps={`handled`}
                        contentContainerStyle={styles.modalContent}
                    >
                        <View {...nativeElement(`native-profile-header`)} style={styles.modalHeader}>
                            <Text {...nativeElement(`native-profile-title`)} style={styles.modalTitle}>
                                {`A home for your codes.`}
                            </Text>
                            <Pressable
                                {...nativeElement(`native-profile-close`)}
                                style={styles.closeButton}
                                accessibilityRole={`button`}
                                accessibilityLabel={`Close login`}
                                onPress={onClose}
                            >
                                <Text {...nativeElement(`native-profile-close-icon`)} style={styles.headerIcon}>
                                    {`×`}
                                </Text>
                            </Pressable>
                        </View>
                        <Text {...nativeElement(`native-profile-description`)} style={styles.body}>
                            {`Log in to your local profile to see your saved QR codes. Your library stays on this device; no password or cloud account is needed.`}
                        </Text>
                        <View {...nativeElement(`native-profile-name-field`)} style={styles.group}>
                            <Text {...nativeElement(`native-profile-name-label`)} style={styles.label}>
                                {`Your name`}
                            </Text>
                            <TextInput
                                {...nativeElement(`native-profile-name-input`)}
                                value={profile.name}
                                maxLength={60}
                                style={styles.input}
                                placeholder={`Alex Morgan`}
                                accessibilityLabel={`Your name`}
                                autoComplete={`name`}
                                onChangeText={profile.setName}
                                placeholderTextColor={styles.helper.color}
                            />
                        </View>
                        <View {...nativeElement(`native-profile-email-field`)} style={styles.group}>
                            <Text {...nativeElement(`native-profile-email-label`)} style={styles.label}>
                                {`Email address`}
                            </Text>
                            <TextInput
                                {...nativeElement(`native-profile-email-input`)}
                                value={profile.email}
                                maxLength={254}
                                style={styles.input}
                                autoCorrect={false}
                                autoCapitalize={`none`}
                                autoComplete={`email`}
                                keyboardType={`email-address`}
                                placeholder={`alex@example.com`}
                                accessibilityLabel={`Email address`}
                                onChangeText={profile.setEmail}
                                placeholderTextColor={styles.helper.color}
                            />
                        </View>
                        {profile.error ? (
                            <Text
                                {...nativeElement(`native-profile-error`)}
                                style={styles.error}
                                accessibilityRole={`alert`}
                            >
                                {profile.error}
                            </Text>
                        ) : null}
                        <Pressable
                            {...nativeElement(`native-profile-submit`)}
                            style={styles.button}
                            onPress={profile.submit}
                            accessibilityRole={`button`}
                            accessibilityLabel={`Open your local QR library`}
                        >
                            <Text {...nativeElement(`native-profile-submit-icon`)} style={styles.buttonText}>
                                {`↗`}
                            </Text>
                            <Text {...nativeElement(`native-profile-submit-label`)} style={styles.buttonText}>
                                {`Open my library`}
                            </Text>
                        </Pressable>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </Modal>
    );
}
