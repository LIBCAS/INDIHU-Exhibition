import React from "react";
import Card from "react-md/lib/Cards/Card";
import CardText from "react-md/lib/Cards/CardText";
import { round, get } from "lodash";

const FileMeta = ({ activeFile }) => (
  <Card className="files-meta">
    <CardText className="files-meta-text">
      {activeFile && (
        <div>
          <div className="meta-row">
            <p>Název:</p>
            <p>{activeFile.name}</p>
          </div>
          <div className="meta-row">
            <p>Typ:</p>
            <p>
              {get(
                activeFile,
                "type",
                get(activeFile, "contentType", "Neznámý")
              )}
            </p>
          </div>
          <div className="meta-row">
            <p>Velikost:</p>
            <p>
              {activeFile.size || activeFile.size === 0
                ? activeFile.size > 1000000
                  ? `${round(activeFile.size / 1000000)} Mb`
                  : `${round(activeFile.size / 1000)} Kb`
                : `Neznámá`}
            </p>
          </div>
          {activeFile.duration && (
            <div className="meta-row">
              <p>Délka:</p>
              <p>{`${activeFile.duration} s`}</p>
            </div>
          )}
          {activeFile.width && activeFile.height && (
            <div className="meta-row">
              <p>Rozměry:</p>
              <p>{`${activeFile.width} x ${activeFile.height}`}</p>
            </div>
          )}
          {activeFile.width && (
            <div className="meta-row">
              <p>Šířka:</p>
              <p>{`${activeFile.width} pixelů`}</p>
            </div>
          )}
          {activeFile.height && (
            <div className="meta-row">
              <p>Výška:</p>
              <p>{`${activeFile.height} pixelů`}</p>
            </div>
          )}
        </div>
      )}
    </CardText>
  </Card>
);

export default FileMeta;
