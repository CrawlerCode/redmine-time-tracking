import { setDefaultOptions } from "date-fns";
import flatpickr from "flatpickr";
import React, { ComponentProps, useEffect, useState } from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import { useSettings } from "./SettingsProvider";

import messagesEN from "../lang/en.json";

import { German as flatpickrDE } from "flatpickr/dist/l10n/de.js";
import { english as flatpickrEN } from "flatpickr/dist/l10n/default";
import { French as flatpickrFR } from "flatpickr/dist/l10n/fr.js";
import { Russian as flatpickrRU } from "flatpickr/dist/l10n/ru.js";

export const LANGUAGES = ["en", "de", "ru", "fr"] as const;

type Language = (typeof LANGUAGES)[number];

type PropTypes = {
  children: React.ReactNode;
};

const IntlProvider = ({ children }: PropTypes) => {
  const { settings } = useSettings();

  let locale: Language;
  if (settings.language === "browser") {
    locale = LANGUAGES.find((lang) => navigator.language === lang || navigator.language.startsWith(`${lang}-`)) ?? "en";
  } else {
    locale = LANGUAGES.find((lang) => settings.language === lang) ?? "en";
  }

  const [messages, setMessages] = useState<Partial<Record<Language, ComponentProps<typeof ReactIntlProvider>["messages"]>>>({ en: messagesEN });

  useEffect(() => {
    (async () => {
      const messages = (await import(`../lang/${locale}.json`)).default;
      setMessages((prev) => ({ ...prev, [locale]: messages }));

      setDefaultOptions({
        locale: (await import("date-fns/locale"))[locale === "en" ? "enUS" : locale],
      });
    })();

    let flatpickrLocal;
    switch (locale) {
      case "en":
        flatpickrLocal = flatpickrEN;
        break;
      case "de":
        flatpickrLocal = flatpickrDE;
        break;
      case "ru":
        flatpickrLocal = flatpickrRU;
        break;
      case "fr":
        flatpickrLocal = flatpickrFR;
        break;
    }
    flatpickr.setDefaults({
      locale: flatpickrLocal,
    });
  }, [locale]);

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale] ?? messagesEN}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
