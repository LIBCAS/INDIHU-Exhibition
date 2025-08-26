import { useMediaDevice } from "context/media-device-provider/media-device-provider";
import { Collaborator } from "models";
import { useTranslation } from "react-i18next";

type AuthorsTableProps = {
  collaborators: Collaborator[] | undefined;
};

const AuthorsTable = ({ collaborators }: AuthorsTableProps) => {
  const { t } = useTranslation("view-exhibition");
  const { isXl, is2Xl } = useMediaDevice();

  if (collaborators === undefined || collaborators.length === 0) {
    return (
      <div>
        <span>{t("no-authors")}</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-start items-start gap-0">
      {collaborators.map(({ role, text }, idx) => (
        <div
          key={idx}
          className="w-full flex justify-start items-start py-2 gap-3"
        >
          <span
            style={{ flex: isXl ? 6 : is2Xl ? 5 : 4 }}
            className="text-lg text-gray"
          >{`${role}:`}</span>

          <span style={{ flex: isXl ? 6 : is2Xl ? 7 : 8 }} className="text-lg">
            {text}
          </span>
        </div>
      ))}
    </div>
  );
};

export default AuthorsTable;
