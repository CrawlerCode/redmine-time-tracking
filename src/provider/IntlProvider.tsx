import { setDefaultOptions } from "date-fns";
import React, { ComponentProps, useEffect, useState } from "react";
import { IntlProvider as ReactIntlProvider } from "react-intl";
import { z } from "zod";
import messagesEN from "../lang/en.json";
import { useSettings } from "./SettingsProvider";

export const LANGUAGES = ["en", "de", "ru", "fr"] as const;

type Language = (typeof LANGUAGES)[number];

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace FormatjsIntl {
    interface Message {
      ids: keyof typeof messagesEN;
    }
    interface IntlConfig {
      locale: Language;
    }
  }
}

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

    z.config(z.locales[locale]());
  }, [locale]);

  return (
    <ReactIntlProvider locale={locale} messages={messages[locale] ?? messagesEN}>
      {children}
    </ReactIntlProvider>
  );
};

export default IntlProvider;
