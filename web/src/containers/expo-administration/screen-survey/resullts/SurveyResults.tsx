import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

// Custom hooks
import { useMediaDevice } from "context/media-device-provider/media-device-provider";

// Components
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";

// Types
import { AppDispatch } from "store/store";
import { SurveyScreen } from "models";

// Utils
import { formatDate } from "utils";
import { palette } from "palette";

// - - - - - -

const messages = [
  {
    text: "asdasdas asd as asjdj ajshd jashd asa da asjdh ajshdj hasjdh ajsdh jashdj asjd as ",
    created: "2023-10-21T11:24:44.678Z",
  },
  {
    text: "asdasdas asd as asjdj ajshd jashd asa da ",
    created: "2023-10-21T11:24:44.678Z",
  },
  {
    text: "asdasdas asd as asjdj ajshd jashd asa da ajsdhaj shjd asjd a ",
    created: "2023-10-21T11:24:44.678Z",
  },
  {
    text: "asdasdas asd as asjdj ajshd jashd asa da asjdhasjhd jahsjd ahsjdh jashdjk ashjkd ajskhd jkashdkj ahsjhd jash djkahsjd hajkd hajk",
    created: "2023-10-21T11:24:44.678Z",
  },
  {
    text: "asdasdas asd as asjdj ajshd jashd asa da ",
    created: "2023-10-21T11:24:44.678Z",
  },
];

// - - - - - -

type SurveyResultsProps = {
  activeScreen: SurveyScreen;
};

const SurveyResults = ({ activeScreen }: SurveyResultsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation("expo-editor", {
    keyPrefix: "descFields.surveyScreen",
  });

  const { isMd } = useMediaDevice();

  return (
    <div className="container container-tabMenu">
      <div className="screen">
        <div className="font-bold underline text-xl">Výsledky ankety:</div>

        <div className="mt-4">
          <div className="flex justify-start items-center gap-2">
            <div className="text-lg">Celkový počet všetkých odpovedí: </div>
            <div className="text-lg">100</div>
          </div>
        </div>

        <div className="mt-12">
          <div className="text-lg underline">Varianta odpovede:</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">Celkový počet odpovedí varianty: </div>
              <div className="text-lg">76</div>
            </div>
          </div>

          <TableContainer>
            <Table
              aria-label="survey-results-table"
              sx={{
                "& .MuiTableRow-root": {
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                  "&:hover": {
                    backgroundColor: "#ececec",
                  },
                },
                "& .MuiTableCell-root": {},
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="left">x</TableCell>
                  <TableCell align="left">Označenie odpovede</TableCell>
                  <TableCell align="left">Textácia odpovede</TableCell>
                  <TableCell align="left">Celkový počet odpovedí</TableCell>
                  <TableCell align="left">Procento z celku</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="left">1</TableCell>
                  <TableCell align="left">custom textace varianty</TableCell>
                  <TableCell align="left">
                    123456789 123456789 123456789 123456789 123456789 123456789
                    123456789 123456789 123456789 123456789 123456789 123456789
                  </TableCell>
                  <TableCell align="left">20</TableCell>
                  <TableCell align="left">20%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left">2</TableCell>
                  <TableCell align="left">custom textace varianty</TableCell>
                  <TableCell align="left">
                    dasldas kadjk asjdkaj skdj aksdj kasjd kjaskd jaskj da
                  </TableCell>
                  <TableCell align="left">30</TableCell>
                  <TableCell align="left">30%</TableCell>
                </TableRow>

                <TableRow>
                  <TableCell align="left">3</TableCell>
                  <TableCell align="left">custom textace varianty</TableCell>
                  <TableCell align="left">
                    dasldas kadjk asjdkaj skdj aksdj kasjd kjaskd jaskj da
                  </TableCell>
                  <TableCell align="left">50</TableCell>
                  <TableCell align="left">50%</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        <div className="mt-12">
          <div className="text-lg underline">Voľné odpovede:</div>

          <div className="mt-2 mb-2">
            <div className="flex justify-start items-center gap-2">
              <div className="text-lg">Celkový počet voľných odpovedí: </div>
              <div className="text-lg">20</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {messages.map((message, idx) => {
              return (
                <div
                  key={idx}
                  className="px-4 py-3 flex flex-col gap-3 border-solid border-2 rounded-md"
                  style={{
                    borderColor: palette["medium-gray"],
                    backgroundColor: palette["light-gray"],
                  }}
                >
                  <div className="text-base">{message.text}</div>

                  <div className="flex flex-col justify-end items-end gap-1 md:flex-row md:items-center md:gap-3">
                    <div className="flex gap-1 items-center text-sm italic">
                      <div>Vytvořeno: </div>
                      <div>{formatDate(message.created)}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurveyResults;
