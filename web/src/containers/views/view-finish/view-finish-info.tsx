import { ViewExpo } from "reducers/expo-reducer";

import { StartScreen } from "models";
import { LabeledItem } from "components/labeled-item/labeled-item";

import { useTranslation } from "react-i18next";

type ViewFinishInfoProps = {
  viewExpo?: ViewExpo | null;
  viewStart?: StartScreen;
};

export const ViewFinishInfo = ({
  viewExpo,
  viewStart,
}: ViewFinishInfoProps) => {
  const collaborators = viewStart?.collaborators ?? [];
  const { t } = useTranslation("exhibition");

  return (
    <div>
      <section className="my-4">
        <span className="text-2xl font-bold">{t("authors")}</span>
      </section>

      <hr />
      <section className="my-4">
        <span>{viewExpo?.author?.institution}</span>
      </section>

      <hr />
      <section className="my-4">
        {!collaborators.length && t("no-authors")}
        {collaborators.map(({ role, text }: any, i: number) => (
          <LabeledItem key={i} label={role}>
            {text}
          </LabeledItem>
        ))}
      </section>
    </div>
  );
};
