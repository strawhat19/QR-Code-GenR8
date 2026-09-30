import { useMemo } from 'react';
import { SvgXml } from 'react-native-svg';
import NativePage from './NativePage/NativePage';
import { getBrandDataUrl } from '../../shared/qr';
import NativeLibrary from './NativeLibrary/NativeLibrary';
import NativeProfile from './NativeProfile/NativeProfile';
import { createNativeStyles } from './NativeApp.styles';
import type { ContentType, LogoMode } from '../../shared/types';
import { nativeElement, useNativeApp } from './NativeApp.logic';
import NativeColorPicker from './NativeColorPicker/NativeColorPicker';
import NativeQRCode, { brandXml } from './NativeQRCode/NativeQRCode';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Linking, Switch, StatusBar, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';

const contentTypes: { value: ContentType; label: string; icon: string }[] = [
    { value: `url`, label: `Link`, icon: `↗` },
    { value: `text`, label: `Text`, icon: `T` },
    { value: `email`, label: `Email`, icon: `@` },
    { value: `wifi`, label: `Wi-Fi`, icon: `⌁` },
];

const logoTypes: { value: LogoMode; label: string; icon: string }[] = [
    { value: `brand`, label: `GenR8`, icon: `✦` },
    { value: `site`, label: `Site icon`, icon: `↗` },
    { value: `custom`, label: `Custom`, icon: `▧` },
];

const fieldLabels: Record<ContentType, { label: string; placeholder: string }> = {
    url: { label: `Where should it lead?`, placeholder: `https://your-next-idea.com` },
    text: { label: `What should it say?`, placeholder: `A note, a greeting, a good idea…` },
    email: { label: `Who should it email?`, placeholder: `hello@example.com` },
    wifi: { label: `Wi-Fi network name`, placeholder: `Your network name` },
};

const footerPages = [
    { value: `about`, label: `About` },
    { value: `terms`, label: `Terms` },
    { value: `contact`, label: `Contact` },
    { value: `privacy`, label: `Privacy` },
] as const;

const benefits = [
    { icon: `✦`, label: `Made yours`, detail: `Color + logo` },
    { icon: `↗`, label: `Ready to share`, detail: `Crisp SVG export` },
    { icon: `⌂`, label: `Kept here`, detail: `Saved on device` },
];

export default function NativeApp() {
    const ui = useNativeApp();
    const { app, settings } = ui;
    const styles = useMemo(() => createNativeStyles(app.accent, app.theme), [app.accent, app.theme]);
    const logo = useMemo(() => brandXml(getBrandDataUrl(app.accent)), [app.accent]);
    const field = fieldLabels[settings.contentType];
    const generatorError = ui.error || ui.preview.error;
    const disabled = ui.busy || !app.ready || Boolean(ui.preview.error);

    function openLibrary() {
        if (app.user) ui.setLibraryOpen(true);
        else ui.setProfileOpen(true);
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView {...nativeElement(`native-app`)} style={styles.screen}>
                <StatusBar barStyle={app.theme === `dark` ? `light-content` : `dark-content`} />
                <KeyboardAvoidingView
                    {...nativeElement(`native-app-keyboard-container`)}
                    style={{ flex: 1 }}
                    behavior={Platform.OS === `ios` ? `padding` : undefined}
                >
                    <ScrollView
                        {...nativeElement(`native-app-scroll`)}
                        contentContainerStyle={styles.content}
                        keyboardShouldPersistTaps={`handled`}
                        showsVerticalScrollIndicator={false}
                    >
                        <View {...nativeElement(`native-header`)} style={styles.header}>
                            <View {...nativeElement(`native-brand`)} style={styles.brand}>
                                <SvgXml
                                    xml={logo}
                                    width={46}
                                    height={46}
                                    nativeID={`native-brand-icon`}
                                    accessibilityLabel={`QR Code GenR8 logo`}
                                />
                                <View {...nativeElement(`native-brand-copy`)} style={styles.brandCopy}>
                                    <Text {...nativeElement(`native-brand-name`)} style={styles.brandName}>
                                        {`QR Code GenR8`}
                                    </Text>
                                    <Text {...nativeElement(`native-brand-tagline`)} style={styles.brandTagline}>
                                        {`IDEAS, CONNECTED.`}
                                    </Text>
                                </View>
                            </View>
                            <Pressable
                                {...nativeElement(`native-theme-toggle`)}
                                style={styles.headerAction}
                                onPress={app.toggleTheme}
                                accessibilityRole={`button`}
                                accessibilityLabel={`Switch to ${app.theme === `dark` ? `light` : `dark`} mode`}
                            >
                                <Text {...nativeElement(`native-theme-toggle-icon`)} style={styles.headerIcon}>
                                    {app.theme === `dark` ? `☀` : `☾`}
                                </Text>
                            </Pressable>
                            <Pressable
                                {...nativeElement(`native-profile-button`)}
                                onPress={openLibrary}
                                style={styles.headerAction}
                                accessibilityRole={`button`}
                                accessibilityLabel={app.user ? `Open your QR library` : `Log in to your local profile`}
                            >
                                <Text {...nativeElement(`native-profile-button-icon`)} style={styles.headerIcon}>
                                    {`☺`}
                                </Text>
                            </Pressable>
                        </View>

                        <View {...nativeElement(`native-hero`)} style={styles.hero}>
                            <Text {...nativeElement(`native-hero-eyebrow`)} style={styles.eyebrow}>
                                {`A LITTLE SQUARE. A LOT OF POSSIBILITY.`}
                            </Text>
                            <Text {...nativeElement(`native-hero-title`)} style={styles.heading}>
                                {`Your next idea,\none scan away.`}
                            </Text>
                            <Text {...nativeElement(`native-hero-description`)} style={styles.introduction}>
                                {`Make a QR code that feels like you.`}
                            </Text>
                        </View>

                        <View {...nativeElement(`native-generator`)} style={styles.card}>
                            <View {...nativeElement(`native-content-type-tabs`)} style={styles.typeRow}>
                                {contentTypes.map((type) => {
                                    const active = settings.contentType === type.value;

                                    return (
                                        <Pressable
                                            key={type.value}
                                            {...nativeElement(`native-content-type-${type.value}`)}
                                            accessibilityRole={`tab`}
                                            accessibilityLabel={`${type.label} QR code`}
                                            accessibilityState={{ selected: active }}
                                            onPress={() => ui.changeType(type.value)}
                                            style={[styles.typeButton, active && styles.typeButtonActive]}
                                        >
                                            <Text {...nativeElement(`native-content-type-icon-${type.value}`)} style={styles.typeIcon}>
                                                {type.icon}
                                            </Text>
                                            <Text
                                                {...nativeElement(`native-content-type-label-${type.value}`)}
                                                style={[styles.typeLabel, active && styles.typeLabelActive]}
                                            >
                                                {type.label}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>

                            <View {...nativeElement(`native-tool-top-row`)} style={styles.toolTopRow}>
                                <View {...nativeElement(`native-preview-section`)} style={styles.previewSection}>
                                    <View {...nativeElement(`native-preview-frame`)} style={styles.previewFrame}>
                                        {ui.preview.matrix ? (
                                            <NativeQRCode
                                                dimension={136}
                                                matrix={ui.preview.matrix}
                                                color={app.accent}
                                                logoUrl={ui.preview.logoUrl}
                                            />
                                        ) : (
                                            <View
                                                {...nativeElement(`native-preview-placeholder`)}
                                                style={{ width: 136, height: 136, alignItems: `center`, justifyContent: `center` }}
                                            >
                                                <SvgXml xml={logo} width={70} height={70} nativeID={`native-preview-placeholder-icon`} />
                                            </View>
                                        )}
                                    </View>
                                    <Text {...nativeElement(`native-preview-description`)} style={styles.previewMeta}>
                                        {`SCAN ME`}
                                    </Text>
                                </View>
                                <View {...nativeElement(`native-content-field`)} style={[styles.group, styles.contentField]}>
                                    <Text {...nativeElement(`native-content-label`)} style={styles.label}>
                                        {field.label}
                                    </Text>
                                    <TextInput
                                        {...nativeElement(`native-content-input`)}
                                        value={settings.content}
                                        maxLength={1100}
                                        placeholder={field.placeholder}
                                        autoCorrect={false}
                                        accessibilityLabel={field.label}
                                        multiline={settings.contentType === `text`}
                                        autoCapitalize={settings.contentType === `text` ? `sentences` : `none`}
                                        keyboardType={settings.contentType === `email` ? `email-address` : settings.contentType === `url` ? `url` : `default`}
                                        style={[styles.input, settings.contentType === `text` && styles.multiline]}
                                        onChangeText={(value) => ui.setField(`content`, value)}
                                        placeholderTextColor={styles.helper.color}
                                    />
                                </View>
                            </View>

                            {settings.contentType === `email` && (
                                <View {...nativeElement(`native-email-fields`)} style={styles.group}>
                                    <TextInput
                                        {...nativeElement(`native-email-subject-input`)}
                                        maxLength={200}
                                        style={styles.input}
                                        value={settings.emailSubject}
                                        placeholder={`Subject (optional)`}
                                        accessibilityLabel={`Email subject`}
                                        placeholderTextColor={styles.helper.color}
                                        onChangeText={(value) => ui.setField(`emailSubject`, value)}
                                    />
                                    <TextInput
                                        {...nativeElement(`native-email-body-input`)}
                                        multiline
                                        maxLength={800}
                                        value={settings.emailBody}
                                        placeholder={`Message (optional)`}
                                        style={[styles.input, styles.multiline]}
                                        accessibilityLabel={`Email message`}
                                        placeholderTextColor={styles.helper.color}
                                        onChangeText={(value) => ui.setField(`emailBody`, value)}
                                    />
                                </View>
                            )}

                            {settings.contentType === `wifi` && (
                                <View {...nativeElement(`native-wifi-fields`)} style={styles.group}>
                                    <View {...nativeElement(`native-wifi-security-options`)} style={styles.logoRow}>
                                        {([`WPA`, `WEP`, `nopass`] as const).map((security) => (
                                            <Pressable
                                                key={security}
                                                {...nativeElement(`native-wifi-security-${security}`)}
                                                accessibilityRole={`radio`}
                                                accessibilityState={{ checked: settings.wifiSecurity === security }}
                                                accessibilityLabel={security === `nopass` ? `Open Wi-Fi network` : security}
                                                onPress={() => ui.setField(`wifiSecurity`, security)}
                                                style={[styles.logoChoice, settings.wifiSecurity === security && styles.typeButtonActive]}
                                            >
                                                <Text {...nativeElement(`native-wifi-security-icon-${security}`)} style={styles.logoLabel}>
                                                    {security === `nopass` ? `⌁` : `◇`}
                                                </Text>
                                                <Text {...nativeElement(`native-wifi-security-label-${security}`)} style={styles.logoLabel}>
                                                    {security === `nopass` ? `Open` : security}
                                                </Text>
                                            </Pressable>
                                        ))}
                                    </View>
                                    {settings.wifiSecurity !== `nopass` && (
                                        <TextInput
                                            {...nativeElement(`native-wifi-password-input`)}
                                            maxLength={128}
                                            autoCorrect={false}
                                            autoCapitalize={`none`}
                                            style={styles.input}
                                            value={settings.wifiPassword}
                                            placeholder={`Network password`}
                                            accessibilityLabel={`Wi-Fi network password`}
                                            placeholderTextColor={styles.helper.color}
                                            onChangeText={(value) => ui.setField(`wifiPassword`, value)}
                                        />
                                    )}
                                    <View {...nativeElement(`native-wifi-hidden-row`)} style={styles.switchRow}>
                                        <Text {...nativeElement(`native-wifi-hidden-label`)} style={styles.label}>
                                            {`Hidden network`}
                                        </Text>
                                        <Switch
                                            {...nativeElement(`native-wifi-hidden-toggle`)}
                                            value={settings.wifiHidden}
                                            trackColor={{ false: `#746780`, true: app.accent }}
                                            accessibilityLabel={`Hidden Wi-Fi network`}
                                            onValueChange={(value) => ui.setField(`wifiHidden`, value)}
                                        />
                                    </View>
                                </View>
                            )}

                            <View {...nativeElement(`native-generator-actions`)} style={styles.actionRow}>
                                <Pressable
                                    {...nativeElement(`native-export-button`)}
                                    onPress={ui.download}
                                    disabled={disabled}
                                    accessibilityRole={`button`}
                                    accessibilityLabel={`Export QR code as SVG`}
                                    style={[styles.button, disabled && styles.disabled]}
                                >
                                    <Text {...nativeElement(`native-export-icon`)} style={styles.buttonText}>
                                        {`↗`}
                                    </Text>
                                    <Text {...nativeElement(`native-export-label`)} style={styles.buttonText}>
                                        {ui.busy ? `Exporting…` : `Export SVG`}
                                    </Text>
                                </Pressable>
                                <Pressable
                                    {...nativeElement(`native-save-button`)}
                                    onPress={ui.save}
                                    disabled={disabled}
                                    accessibilityRole={`button`}
                                    accessibilityLabel={`Save QR code to this device`}
                                    style={[styles.button, styles.secondaryButton, disabled && styles.disabled]}
                                >
                                    <Text {...nativeElement(`native-save-icon`)} style={styles.secondaryButtonText}>
                                        {`♡`}
                                    </Text>
                                    <Text {...nativeElement(`native-save-label`)} style={styles.secondaryButtonText}>
                                        {`Save code`}
                                    </Text>
                                </Pressable>
                            </View>

                            {generatorError ? (
                                <Text
                                    {...nativeElement(`native-generator-error`)}
                                    style={styles.error}
                                    accessibilityRole={`alert`}
                                >
                                    {generatorError}
                                </Text>
                            ) : null}

                            <NativeColorPicker color={app.accent} styles={styles} onChange={app.setAccent} />

                            <View {...nativeElement(`native-logo-section`)} style={styles.group}>
                                <View {...nativeElement(`native-logo-toggle-row`)} style={styles.switchRow}>
                                    <View {...nativeElement(`native-logo-toggle-copy`)} style={styles.switchCopy}>
                                        <Text {...nativeElement(`native-logo-toggle-label`)} style={styles.label}>
                                            {`A little logo, front and center`}
                                        </Text>
                                        <Text {...nativeElement(`native-logo-toggle-hint`)} style={styles.helper}>
                                            {`Give your QR code a familiar face.`}
                                        </Text>
                                    </View>
                                    <Switch
                                        {...nativeElement(`native-logo-toggle`)}
                                        value={settings.includeLogo}
                                        accessibilityLabel={`Include a center logo`}
                                        trackColor={{ false: `#746780`, true: app.accent }}
                                        onValueChange={(value) => ui.setField(`includeLogo`, value)}
                                    />
                                </View>
                                {settings.includeLogo && (
                                    <View {...nativeElement(`native-logo-options`)} style={styles.group}>
                                        <View {...nativeElement(`native-logo-type-options`)} style={styles.logoRow}>
                                            {logoTypes.map((type) => (
                                                <Pressable
                                                    key={type.value}
                                                    {...nativeElement(`native-logo-type-${type.value}`)}
                                                    accessibilityRole={`radio`}
                                                    accessibilityState={{ checked: settings.logoMode === type.value }}
                                                    accessibilityLabel={`${type.label} center logo`}
                                                    onPress={() => ui.setField(`logoMode`, type.value)}
                                                    style={[styles.logoChoice, settings.logoMode === type.value && styles.typeButtonActive]}
                                                >
                                                    <Text {...nativeElement(`native-logo-type-icon-${type.value}`)} style={styles.logoLabel}>
                                                        {type.icon}
                                                    </Text>
                                                    <Text {...nativeElement(`native-logo-type-label-${type.value}`)} style={styles.logoLabel}>
                                                        {type.label}
                                                    </Text>
                                                </Pressable>
                                            ))}
                                        </View>
                                        {settings.logoMode === `custom` && (
                                            <TextInput
                                                {...nativeElement(`native-custom-logo-url`)}
                                                maxLength={1000}
                                                style={styles.input}
                                                keyboardType={`url`}
                                                autoCorrect={false}
                                                autoCapitalize={`none`}
                                                value={settings.customLogoUrl}
                                                placeholder={`https://example.com/your-logo.png`}
                                                accessibilityLabel={`Public image URL for your logo`}
                                                placeholderTextColor={styles.helper.color}
                                                onChangeText={(value) => ui.setField(`customLogoUrl`, value)}
                                            />
                                        )}
                                        {settings.logoMode === `site` && settings.contentType !== `url` && (
                                            <Text {...nativeElement(`native-site-logo-hint`)} style={styles.helper}>
                                                {`Site icons work with link codes. This code uses the GenR8 icon.`}
                                            </Text>
                                        )}
                                    </View>
                                )}
                            </View>
                        </View>

                        {app.notice ? (
                            <Text
                                {...nativeElement(`native-app-notice`)}
                                style={styles.notice}
                                accessibilityLiveRegion={`polite`}
                            >
                                {app.notice}
                            </Text>
                        ) : null}
                        {app.storageError ? (
                            <Text {...nativeElement(`native-storage-error`)} style={styles.notice}>
                                {app.storageError}
                            </Text>
                        ) : null}

                        <View {...nativeElement(`native-benefits`)} style={styles.benefits}>
                            {benefits.map((benefit, index) => (
                                <View key={benefit.label} {...nativeElement(`native-benefit-${index}`)} style={styles.benefit}>
                                    <Text {...nativeElement(`native-benefit-icon-${index}`)} style={styles.benefitIcon}>
                                        {benefit.icon}
                                    </Text>
                                    <Text {...nativeElement(`native-benefit-description-${index}`)} style={styles.benefitText}>
                                        {`${benefit.label}\n${benefit.detail}`}
                                    </Text>
                                </View>
                            ))}
                        </View>

                        <Pressable
                            {...nativeElement(`native-library-link`)}
                            onPress={openLibrary}
                            accessibilityRole={`button`}
                            accessibilityLabel={app.user ? `Open your saved QR codes` : `Log in to see your saved QR codes`}
                            style={styles.libraryAction}
                        >
                            <Text {...nativeElement(`native-library-link-icon`)} style={styles.benefitIcon}>
                                {`▧`}
                            </Text>
                            <View {...nativeElement(`native-library-link-copy`)} style={styles.libraryCopy}>
                                <Text {...nativeElement(`native-library-link-title`)} style={styles.libraryHeading}>
                                    {app.user ? `Your saved codes` : `Keep your ideas together.`}
                                </Text>
                                <Text {...nativeElement(`native-library-link-description`)} style={styles.helper}>
                                    {app.user ? `${app.records.length} saved on this device` : `Log in to see your local QR library.`}
                                </Text>
                            </View>
                            <Text {...nativeElement(`native-library-link-arrow`)} style={styles.benefitIcon}>
                                {`↗`}
                            </Text>
                        </Pressable>

                        <View {...nativeElement(`native-footer`)} style={styles.footer}>
                            <View {...nativeElement(`native-footer-pages`)} style={styles.footerLinks}>
                                {footerPages.map((page) => (
                                    <Pressable
                                        key={page.value}
                                        {...nativeElement(`native-footer-link-${page.value}`)}
                                        hitSlop={8}
                                        accessibilityRole={`link`}
                                        accessibilityLabel={`Open ${page.label} page`}
                                        onPress={() => ui.setPage(page.value)}
                                    >
                                        <Text {...nativeElement(`native-footer-label-${page.value}`)} style={styles.footerLink}>
                                            {page.label}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                            <Pressable
                                {...nativeElement(`native-copyright-link`)}
                                accessibilityRole={`link`}
                                accessibilityLabel={`Visit Piratechs website`}
                                onPress={() => Linking.openURL(`https://piratechs.com/`)}
                            >
                                <Text {...nativeElement(`native-copyright`)} style={styles.copyright}>
                                    {`© ${new Date().getFullYear()} Piratechs. Made for the next connection. ↗`}
                                </Text>
                            </Pressable>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>

                <NativeProfile
                    styles={styles}
                    open={ui.profileOpen}
                    onClose={ui.closeProfile}
                    onComplete={() => {
                        ui.closeProfile();
                        ui.setLibraryOpen(true);
                    }}
                />
                <NativeLibrary
                    styles={styles}
                    open={ui.libraryOpen}
                    onClose={() => ui.setLibraryOpen(false)}
                />
                <NativePage styles={styles} page={ui.page} onClose={() => ui.setPage(null)} />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}
