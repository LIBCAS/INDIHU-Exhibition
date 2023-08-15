import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";

// Components
import StateOptions from "../../../components/form/redux-form/state-options";
import URLChange from "./url-change";
import ClosedExpo from "./closed-expo";
import TagsSelect from "./TagsSelect";
import { Button } from "react-md";

// Models
import { AppDispatch, AppState } from "store/store";
import { TagValues } from "./tags-options";

// Utils and actions
import { isEmpty } from "lodash";
import { updateExpo } from "actions/expoActions";

// - - - - - - - -

const stateSelector = createSelector(
  ({ expo }: AppState) => expo.activeExpo,
  (activeExpo) => ({ activeExpo })
);

// - - - - - - - -

const Settings = () => {
  const { activeExpo } = useSelector(stateSelector);
  const dispatch = useDispatch<AppDispatch>();
  const [tags, setTags] = useState<TagValues[]>(() => {
    return activeExpo?.tags ?? [];
  });

  const [tagsErrorMsg, setTagsErrorMsg] = useState<string>("");

  useEffect(() => {
    if (isEmpty(activeExpo)) {
      return;
    }

    if (activeExpo?.tags && activeExpo.tags.length > 0) {
      setTags(activeExpo.tags);
    }
  }, [activeExpo]);

  const saveTags = async () => {
    if (isEmpty(activeExpo)) {
      return;
    }

    const resp = await dispatch(updateExpo({ ...activeExpo, tags: tags }));
    if (!resp) {
      console.error("Failed to save the tags");
      setTagsErrorMsg("Tagy se nepodařilo uložit");
    }

    if (resp) {
      setTagsErrorMsg("");
    }
  };

  return (
    <div className="container container-tabMenu">
      <div className="settings margin-bottom">
        <div className="settings-state">
          <p className="title">Stav výstavy</p>
          <StateOptions />
        </div>
        <div className="settings-url">
          <p className="title">Url výstavy</p>
          {activeExpo && activeExpo.url && (
            <URLChange initialValues={{ url: activeExpo.url }} />
          )}
        </div>
      </div>

      {!isEmpty(activeExpo) && (
        <div
          style={{ maxWidth: "600px", margin: "auto", marginBottom: "30px" }}
        >
          <div className="ml-4 mr-4 sm:ml-0 sm:mr-0">
            <p className="font-bold mb-3">Tagy výstavy</p>
            <TagsSelect
              tags={tags}
              setTags={setTags}
              tagsErrorMsg={tagsErrorMsg}
            />
            <div className="mt-3 flex justify-end">
              <Button raised label="Ulozit" onClick={saveTags} />
            </div>
          </div>
        </div>
      )}

      {!isEmpty(activeExpo) && (
        <ClosedExpo {...{ activeExpo, initialValues: { ...activeExpo } }} />
      )}
    </div>
  );
};

export default Settings;
