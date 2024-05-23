import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../locales/en.json";
import sl from "../locales/sl.json";

export const languageResources = {
    sl: {translation: sl},
    en: {translation: en}
}

i18next.use(initReactI18next).init({
    compatibilityJSON: "v3",
    lng: "sl",
    fallbackLng: "sl",
    resources: languageResources,
});

export default i18next;