import { createContext, FC, PropsWithChildren, useContext } from "react";
import { GanttLocale } from "../../types/public-types";

const LocaleContext = createContext<GanttLocale>({} as GanttLocale);

interface Props extends PropsWithChildren<any> {
  locale: GanttLocale;
}

export const GanttLocaleProvider: FC<Props> = ({ children, locale }) => {
  return (
    // @ts-ignore
    <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
  );
};

export const useGanttLocale = () => useContext(LocaleContext);
