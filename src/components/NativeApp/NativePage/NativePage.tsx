import { nativePages } from './NativePage.logic';
import type { NativeStyles } from '../NativeApp.styles';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Modal, View, Text, Linking, Pressable, ScrollView } from 'react-native';
import { nativeElement, type NativePage as PageName } from '../NativeApp.logic';

type NativePageProps = {
    page: PageName | null;
    styles: NativeStyles;
    onClose: () => void;
};

export default function NativePage({ page, styles, onClose }: NativePageProps) {
    if (!page) return null;

    const content = nativePages[page];

    return (
        <Modal
            visible
            animationType={`slide`}
            presentationStyle={`pageSheet`}
            onRequestClose={onClose}
        >
            <SafeAreaView {...nativeElement(`native-${page}-page`)} style={styles.modalScreen}>
                <ScrollView
                    {...nativeElement(`native-${page}-scroll`)}
                    contentContainerStyle={styles.modalContent}
                >
                    <View {...nativeElement(`native-${page}-header`)} style={styles.modalHeader}>
                        <Text {...nativeElement(`native-${page}-title`)} style={styles.modalTitle}>
                            {content.title}
                        </Text>
                        <Pressable
                            {...nativeElement(`native-${page}-close`)}
                            style={styles.closeButton}
                            accessibilityRole={`button`}
                            accessibilityLabel={`Close ${page} page`}
                            onPress={onClose}
                        >
                            <Text {...nativeElement(`native-${page}-close-icon`)} style={styles.headerIcon}>
                                {`×`}
                            </Text>
                        </Pressable>
                    </View>
                    {content.paragraphs.map((paragraph, index) => (
                        <Text
                            key={index}
                            {...nativeElement(`native-${page}-paragraph-${index}`)}
                            style={styles.body}
                        >
                            {paragraph}
                        </Text>
                    ))}
                    <Pressable
                        {...nativeElement(`native-${page}-piratechs-link`)}
                        style={styles.button}
                        accessibilityRole={`link`}
                        accessibilityLabel={`Visit Piratechs website`}
                        onPress={() => Linking.openURL(`https://piratechs.com/`)}
                    >
                        <Text {...nativeElement(`native-${page}-piratechs-icon`)} style={styles.buttonText}>
                            {`↗`}
                        </Text>
                        <Text {...nativeElement(`native-${page}-piratechs-label`)} style={styles.buttonText}>
                            {`Visit Piratechs`}
                        </Text>
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </Modal>
    );
}
