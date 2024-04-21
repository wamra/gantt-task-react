import { createContext, FC, PropsWithChildren, useContext } from "react";
import { GanttLocale } from "../../types";

const GanttLocaleContext = createContext<GanttLocale>({} as GanttLocale);

interface Props extends PropsWithChildren {
  locale: GanttLocale;
}

export const GanttLocaleProvider: FC<Props> = ({ children, locale }) => {
  return (
    <GanttLocaleContext.Provider value={locale}>
      {children}
    </GanttLocaleContext.Provider>
  );
};

export const useGanttLocale = () => useContext(GanttLocaleContext);
