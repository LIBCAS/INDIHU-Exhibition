import { useMemo } from "react";
import { useTranslation } from "react-i18next";

// Components
import { LabeledItem } from "components/labeled-item/labeled-item";
import TagsList from "components/tags-list/TagsList";

// Models
import { ViewExpo, StartScreen } from "models";

// - - - - - - - -

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

  const tags = useMemo(() => viewExpo?.tags, [viewExpo?.tags]);

  return (
    <div>
      <section className="my-4">
        <span className="text-2xl font-bold">{t("authors")}</span>
      </section>

      {/* Tags */}
      {tags && (
        <div className="mb-4">
          <TagsList tags={tags} />
        </div>
      )}

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
