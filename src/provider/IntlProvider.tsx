import { setDefaultOptions } from "date-fns";
import flatpickr from "flatpickr";
import React from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import useSettings from "../hooks/useSettings";

import messagesDE from "../lang/de.json";
import messagesEN from "../lang/en.json";
import messagesRU from "../lang/ru.json";

import { de as dateFnsLocalDE, enUS as dateFnsLocalEN, ru as dateFnsLocalRu } from "date-fns/locale";

import { German as flatpickrDE } from "flatpickr/dist/l10n/de.js";
import { english as flatpickrEN } from "flatpickr/dist/l10n/default";
import { Russian as flatpickrRU } from "flatpickr/dist/l10n/ru.js";

// eslint-disable-next-line react-refresh/only-export-components
export const LANGUAGES = ["en", "de", "ru"] as const;

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

  let messages;
  let dateFnsLocal;
  let flatpickrLocal;

  switch (locale) {
    case "en":
      messages = messagesEN;
      dateFnsLocal = dateFnsLocalEN;
      flatpickrLocal = flatpickrEN;
      break;
    case "de":
      messages = messagesDE;
      dateFnsLocal = dateFnsLocalDE;
      flatpickrLocal = flatpickrDE;
      break;
    case "ru":
      messages = messagesRU;
      dateFnsLocal = dateFnsLocalRu;
      flatpickrLocal = flatpickrRU;
      break;
  }

  setDefaultOptions({
    locale: dateFnsLocal,
  });

  flatpickr.setDefaults({
    locale: flatpickrLocal,
  });

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
