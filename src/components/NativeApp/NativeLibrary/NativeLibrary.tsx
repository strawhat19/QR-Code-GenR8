import { nativeElement } from '../NativeApp.logic';
import type { NativeStyles } from '../NativeApp.styles';
import NativeQRCode from '../NativeQRCode/NativeQRCode';
import { SafeAreaView } from 'react-native-safe-area-context';
import { savedLogo, savedMatrix, useNativeLibrary } from './NativeLibrary.logic';
import { Modal, View, Text, Pressable, FlatList } from 'react-native';

type NativeLibraryProps = {
    open: boolean;
    styles: NativeStyles;
    onClose: () => void;
};

export default function NativeLibrary({ open, styles, onClose }: NativeLibraryProps) {
    const library = useNativeLibrary(onClose);

    return (
        <Modal
            visible={open}
            animationType={`slide`}
            presentationStyle={`pageSheet`}
            onRequestClose={onClose}
        >
            <SafeAreaView {...nativeElement(`native-library-page`)} style={styles.modalScreen}>
                <FlatList
                    {...nativeElement(`native-library-list`)}
                    data={library.app.records}
                    keyExtractor={(record) => record.id}
                    contentContainerStyle={styles.modalContent}
                    initialNumToRender={6}
                    windowSize={5}
                    ListHeaderComponent={(
                        <View {...nativeElement(`native-library-heading-section`)} style={styles.group}>
                            <View {...nativeElement(`native-library-header`)} style={styles.modalHeader}>
                                <Text {...nativeElement(`native-library-title`)} style={styles.modalTitle}>
                                    {`Your QR library.`}
                                </Text>
                                <Pressable
                                    {...nativeElement(`native-library-close`)}
                                    style={styles.closeButton}
                                    accessibilityRole={`button`}
                                    accessibilityLabel={`Close QR library`}
                                    onPress={onClose}
                                >
                                    <Text {...nativeElement(`native-library-close-icon`)} style={styles.headerIcon}>
                                        {`×`}
                                    </Text>
                                </Pressable>
                            </View>
                            <Text {...nativeElement(`native-library-description`)} style={styles.body}>
                                {`${library.app.user?.name ? `${library.app.user.name}’s` : `Your`} codes, saved on this device. Export them again whenever you need.`}
                            </Text>
                            {library.error ? (
                                <Text {...nativeElement(`native-library-error`)} style={styles.error}>
                                    {library.error}
                                </Text>
                            ) : null}
                        </View>
                    )}
                    ListEmptyComponent={(
                        <Text {...nativeElement(`native-library-empty`)} style={styles.body}>
                            {`Your next good idea belongs here. Save a QR code to start your collection.`}
                        </Text>
                    )}
                    ListFooterComponent={(
                        <Pressable
                            {...nativeElement(`native-library-logout`)}
                            accessibilityRole={`button`}
                            accessibilityLabel={`Log out of this local profile`}
                            onPress={library.logout}
                            style={[styles.button, styles.secondaryButton]}
                        >
                            <Text {...nativeElement(`native-library-logout-icon`)} style={styles.secondaryButtonText}>
                                {`↪`}
                            </Text>
                            <Text {...nativeElement(`native-library-logout-label`)} style={styles.secondaryButtonText}>
                                {`Log out`}
                            </Text>
                        </Pressable>
                    )}
                    renderItem={({ item: record }) => {
                        const matrix = savedMatrix(record.payload);

                        return (
                            <View {...nativeElement(`native-library-record-${record.id}`)} style={styles.record}>
                                <Text
                                    {...nativeElement(`native-library-record-title-${record.id}`)}
                                    numberOfLines={2}
                                    style={styles.recordTitle}
                                >
                                    {record.title}
                                </Text>
                                <View {...nativeElement(`native-library-record-details-${record.id}`)} style={styles.switchRow}>
                                    {matrix ? (
                                        <View
                                            {...nativeElement(`native-library-qr-frame-${record.id}`)}
                                            style={styles.previewFrame}
                                        >
                                            <NativeQRCode
                                                matrix={matrix}
                                                dimension={74}
                                                color={record.color}
                                                id={`native-library-qr-${record.id}`}
                                                logoUrl={savedLogo(record)}
                                            />
                                        </View>
                                    ) : null}
                                    <View {...nativeElement(`native-library-record-meta-${record.id}`)} style={styles.libraryCopy}>
                                        <Text {...nativeElement(`native-library-record-kind-${record.id}`)} style={styles.recordMeta}>
                                            {`${record.contentType.toUpperCase()} · ${new Date(record.createdAt).toLocaleDateString()}`}
                                        </Text>
                                        <Text
                                            {...nativeElement(`native-library-record-content-${record.id}`)}
                                            style={styles.helper}
                                            numberOfLines={3}
                                        >
                                            {record.content}
                                        </Text>
                                    </View>
                                </View>
                                <View {...nativeElement(`native-library-record-actions-${record.id}`)} style={styles.actionRow}>
                                    <Pressable
                                        {...nativeElement(`native-library-export-${record.id}`)}
                                        accessibilityRole={`button`}
                                        disabled={library.busyId !== null}
                                        accessibilityLabel={`Export ${record.title}`}
                                        onPress={() => library.download(record)}
                                        style={[styles.button, library.busyId !== null && styles.disabled]}
                                    >
                                        <Text {...nativeElement(`native-library-export-icon-${record.id}`)} style={styles.buttonText}>
                                            {`↗`}
                                        </Text>
                                        <Text {...nativeElement(`native-library-export-label-${record.id}`)} style={styles.buttonText}>
                                            {library.busyId === record.id ? `Exporting…` : `Export SVG`}
                                        </Text>
                                    </Pressable>
                                    <Pressable
                                        {...nativeElement(`native-library-delete-${record.id}`)}
                                        accessibilityRole={`button`}
                                        accessibilityLabel={`Delete ${record.title}`}
                                        onPress={() => library.app.deleteQR(record.id)}
                                        style={[styles.button, styles.secondaryButton]}
                                    >
                                        <Text {...nativeElement(`native-library-delete-icon-${record.id}`)} style={styles.secondaryButtonText}>
                                            {`×`}
                                        </Text>
                                        <Text {...nativeElement(`native-library-delete-label-${record.id}`)} style={styles.secondaryButtonText}>
                                            {`Delete`}
                                        </Text>
                                    </Pressable>
                                </View>
                            </View>
                        );
                    }}
                />
            </SafeAreaView>
        </Modal>
    );
}
