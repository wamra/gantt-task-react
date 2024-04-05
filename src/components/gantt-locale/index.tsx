import {
  createContext,
  FC,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import { GanttLocale } from "../../types/public-types";
import { GANTT_EN_LOCALE } from "../../locales";

const LocaleContext = createContext<GanttLocale>({} as GanttLocale);

interface Props extends PropsWithChildren<any> {
  locale: GanttLocale | undefined | null;
}

export const GanttLocaleProvider: FC<Props> = ({ children, locale: clientLocale }) => {
  const locale = useMemo(() => clientLocale ?? GANTT_EN_LOCALE, [clientLocale]);
  return (
    // @ts-ignore
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};

export const useGanttLocale = () => useContext(LocaleContext);
