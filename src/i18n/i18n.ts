/**
 * i18n setup using react-i18next + i18next.
 * Activate by importing this file in main.tsx and wrapping the app with <I18nextProvider i18n={i18n}>.
 * All string keys live in sv.json (default) and en.json.
 *
 * Usage in components:
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation();
 *   t('nav.dashboard')
 */

// Lazy import so the app still builds without react-i18next installed
let i18nInstance: unknown = null;

export async function initI18n(language: "sv" | "en" = "sv") {
  try {
    const [i18next, { initReactI18next }] = await Promise.all([
      import("i18next"),
      import("react-i18next"),
    ]);
    const [svTranslations, enTranslations] = await Promise.all([
      import("./sv.json"),
      import("./en.json"),
    ]);

    const i18n = i18next.default;
    if (!i18n.isInitialized) {
      await i18n.use(initReactI18next).init({
        resources: {
          sv: { translation: svTranslations.default },
          en: { translation: enTranslations.default },
        },
        lng: language,
        fallbackLng: "sv",
        interpolation: { escapeValue: false },
      });
    } else {
      await i18n.changeLanguage(language);
    }
    i18nInstance = i18n;
    return i18n;
  } catch {
    // react-i18next not installed yet — return no-op
    return null;
  }
}

export { i18nInstance };
