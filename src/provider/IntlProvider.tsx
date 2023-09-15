import { setDefaultOptions } from "date-fns";
import { de as dateFnsLocalDE, enUS as dateFnsLocalEN, ru as dateFnsLocalRu } from "date-fns/locale";
import React from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import useSettings from "../hooks/useSettings";
import messagesDE from "../lang/de.json";
import messagesEN from "../lang/en.json";
import messagesRU from "../lang/ru.json";

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
  switch (locale) {
    case "en":
      messages = messagesEN;
      dateFnsLocal = dateFnsLocalEN;
      break;
    case "de":
      messages = messagesDE;
      dateFnsLocal = dateFnsLocalDE;
      break;
    case "ru":
      messages = messagesRU;
      dateFnsLocal = dateFnsLocalRu;
      break;
  }

  setDefaultOptions({
    locale: dateFnsLocal,
  });

  return (
    <ReactIntlProvider locale={locale} messages={messages}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
