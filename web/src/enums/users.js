export const userStates = {
  NOT_VERIFIED: "NOT_VERIFIED",
  TO_ACCEPT: "TO_ACCEPT",
  ACCEPTED: "ACCEPTED",
  DELETED: "DELETED"
};

export const userStatesTexts = {
  [userStates.NOT_VERIFIED]: "Neověřen",
  [userStates.TO_ACCEPT]: "Ke schválení",
  [userStates.ACCEPTED]: "Akceptován",
  [userStates.DELETED]: "Smazán"
};
