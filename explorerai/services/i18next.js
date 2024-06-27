import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import sl from "../locales/sl.json";
import de from "../locales/de.json";
import es from "../locales/es.json";
import it from "../locales/it.json";
import fr from "../locales/fr.json";

export const languageResources = {
    sl: {translation: sl},
    en: {translation: en},
    de: {translation: de},
    it: {translation: it},
    es: {translation: es},
    fr: {translation: fr}
}

i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: "sl",
    fallbackLng: "sl",
    resources: languageResources,
});

export default i18next;