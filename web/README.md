## Vzory vnutornej struktury expozicii

#### Vzor struktury vystavy
- Neposiela sa na API v celku ale pred poslanim sa z tohoto vytvori jeden obrovsky string,
kedze API s tymto nic nerobi iba nam to zalohuje do db
- o stringifovanie a parsovanie je postarane v akciach save a load expo

```js
const templateStructure = {
  start,
  finish,
  screens: [
    /* array of sections */
    [templateScreen, templateScreen] /* first section with two screens */,
    [templateScreen] /* second section with one screen */
  ],
  files: [
    /* array of folders */
    {
      name: "folderName1",
      files: [templateFile] /* files of first folder */
    },
    {
      name: "folderName2",
      files: [templateFile, templateFile]
    },
    {
      /* Uncategorized files */
      files: [templateFile, templateFile, templateFile]
    }
  ]
};
```

#### Vzor jednej obrazovky
- Pre kazdy typ obrazovky bude prototyp atributov ktore moze obsahovat

##### Úvod výstavy

```js
const start = {
    id: "string",
    type: "START",
    title: "expo title",
    subTitle: "expo subTitle",
    perex: "perex",
    image: templateFile.id,
    imageOrigData: { width: 0, height: 0 },
    audio: templateFile.id,
    collaborators: [{role: "role", text: "text"}, {role: "role", text: "text"}],
    documents: [],
    screenCompleted: false
};
```

##### Úvod kapitoly

```js
const chapterStart = {
    id: "string",
    type: "INTRO",
    title: "chapter title",
    subTitle: "chapter subTitle",
    image: templateFile.id,
    imageOrigData: { width: 0, height: 0 },
    animationType: "FROM_TOP",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    music: templateFile.id,
    documents: [],
    screenCompleted: false
};
```

##### Obrazovka s obrázkem

```js
const image = {
    id: "string",
    type: "IMAGE",
    title: "screen title",
    text: "screen text",
    image: templateFile.id,
    imageOrigData: { width: 0, height: 0 },
    animationType: "FROM_TOP",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    infopoints: [{text: "text", positionX: 0, positionY: 0, alwaysVisible: false}],
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka s videem

```js
const video = {
    id: "string",
    type: "VIDEO",
    title: "screen title",
    text: "screen text",
    video: templateFile.id,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka s textem

```js
const text = {
    id: "string",
    type: "TEXT",
    title: "screen title",
    text: "screen text",
    mainText: "text",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka fotogalerie

```js
const photogalery = {
    id: "string",
    type: "PHOTOGALERY",
    title: "screen title",
    text: "screen text",
    images: [{ id: templateFile.id, imageOrigData: { width: 0, height: 0 }, infopoints: [{ text: "text", positionX: 0, positionY: 0, alwaysVisible: false }] }],
    animationType: "FROM_TOP",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka parallax

```js
const parallax = {
    id: "string",
    type: "PARALLAX",
    title: "screen title",
    text: "screen text",
    images: [ templateFile.id, templateFile.id, templateFile.id ],
    animationType: "FROM_TOP",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka zoom in

```js
const zoomIn = {
    id: "string",
    type: "IMAGE_ZOOM",
    title: "screen title",
    text: "screen text",
    image: templateFile.id,
    imageOrigData: { width: 0, height: 0 },
    sequence: [{ text: "text", zoom: 2, top: 0, left: 0 }],
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka fotografie před a po

```js
const imageChange = {
    id: "string",
    type: "IMAGE_CHANGE",
    title: "screen title",
    text: "screen text",
    image1: templateFile.id,
    image2: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    animationType: "HOVER",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Obrazovka s externím objektem

```js
const external = {
    id: "string",
    type: "EXTERNAL",
    title: "screen title",
    text: "screen text",
    externalData: "code",
    audio: templateFile.id,
    time: 22,
    timeAuto: false,
    documents: [],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "najdi na mapě"

```js
const gameFind = {
    id: "string",
    type: "GAME_FIND",
    title: "screen title",
    task: "game task",
    image1: templateFile.id,
    image2: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    showTip: true,
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "Dokreslování"

```js
const gameDraw = {
    id: "string",
    type: "GAME_DRAW",
    title: "screen title",
    task: "game task",
    image1: templateFile.id,
    image2: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    showDrawing: true,
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "Stírací los"

```js
const gameWipe = {
    id: "string",
    type: "GAME_WIPE",
    title: "screen title",
    task: "game task",
    image1: templateFile.id,
    image2: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "Hádej velikost"

```js
const gameSizing = {
    id: "string",
    type: "GAME_SIZING",
    title: "screen title",
    task: "game task",
    image1: templateFile.id,
    image2: templateFile.id,
    image3: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    image3OrigData: { width: 0, height: 0 },
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "Posuň na správne místo"

```js
const gameMove = {
    id: "string",
    type: "GAME_MOVE",
    title: "screen title",
    task: "game task",
    image1: templateFile.id,
    image2: templateFile.id,
    object: templateFile.id,
    image1OrigData: { width: 0, height: 0 },
    image2OrigData: { width: 0, height: 0 },
    objectOrigData: { width: 0, height: 0 },
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Minihra "Výběr z možností"

```js
const gameOptions = {
    id: "string",
    type: "GAME_OPTIONS",
    title: "screen title",
    task: "game task",
    image: templateFile.id,
    imageOrigData: { width: 0, height: 0 },
    answers: [
      {correct: true, text: "text odpovědi", image: templateFile.id, imageOrigData: { width: 0, height: 0 }},
      {correct: false, text: "text odpovědi", image: templateFile.id, imageOrigData: { width: 0, height: 0 }},
      {correct: false, text: "text odpovědi", image: templateFile.id, imageOrigData: { width: 0, height: 0 }}
    ],
    aloneScreen: false,
    music: templateFile.id,
    muteChapterMusic: false,
    screenCompleted: false
};
```

##### Závěr výstavy

```js
const finish = {
    id: "string",
    type: "FINISH",
};
```

#### Vzor jedneho suboru
- fileActions/getFileById -> vracia file objekt vyhľadaný podľa ID

```js
const templateFile = {
  id: "1",
  fileId : "001",
  thumbnailId: "001",
  name: "file1",
  type : "video/mp4",
  size : "1139804",
  duration : 17.74
};
```

#### API: Vzor detailu expozicie
- Az na atribut structure, so vsetkym pracuje aj API

```js
const templateExpo = {
  id: "d816f3db-b8e1-4073-b1e9-a5da75453637",
  created: "2017-08-02T13:34:57.638Z",
  updated: "2017-08-02T13:35:03.936Z",
  author: {
    id: "usuallyGenerated",
    firstName: "fero",
    surname: "taraba",
    email: "s@a.cz",
    userName: "user",
    password: "passw",
    role: "ROLE_ADMIN",
    accepted: true,
    ldapUser: false
  },
  collaborators: [],
  title: "expo",
  url: "expo2017-08-02T13:34:57.637Z",
  structure: templateStructure,
  state: "PREPARE",
  isEditing: "test",
  organization: "Organizace"
};
```

#### API: Vzor array-u expozicii pri vypise vystav
- Chodia iba zakladne atributy

```js
const templateExpositions = [
  {
    id: "ca4ff75c-7e45-4d7b-9d0f-fc634b0c829b",
    title: "Nemesis",
    inProgress: false,
    canEdit: true,
    created: "2017-08-02T11:08:44.987Z",
    lastEdit: "2017-08-02T11:08:44.987Z",
    isEditing: "test",
    state: "PREPARE",
    url: "nemesis2017-12-07T151513417Z"
  }
];
```

#### Vzor logiky dialogovych okien
onClick listener otvarajuci dialog s name="DialogChangeFileName", posielajuci props id vybraneho file-u:
```js
onClick={() => setDialog("DialogChangeFileName", { id: file.id, autoClose: true })}
```
- prvy parameter je nazov dialogu, druhy je objekt potrebnych propsov ktore chceme do dialogu poslat
- autoClose: true => (informacny) dialog sa zavrie po 2 sek.

vzorovy kod dialogu:
```js
// importy ...
import Dialog from "./DialogWrap";
import { actionChangeFilename } from '...actions...';

const DialogChangeFileName = ({ handleSubmit }) =>
  <Dialog title="Titulok dialogu" name="DialogChangeFileName" handleSubmit={handleSubmit} submitLabel="Premenovat">
    <form onSubmit={handleSubmit}>
      // ...
    </form>
  </Dialog>;
  
 export default compose(
  withHandlers({
    onSubmit: dialog => async (formData, dispatch, props) => {
      dispatch(actionChangeFilename(formData.field1))
      // dispatchujeme importnutu akciu, specificku pre dialog
      dialog.closeDialog();
      // pozn.: props ktore chodia v dialog su vymenovane nizsie
    }
  }),
  reduxForm({
    form: "formChangeFileName"
  })
)(FileNewFolder);

```

dialog props:
```js
const dialog = {
    setDialog, // pripadne zavolanie ineho dialogu (zatial nepotrebne)
    closeDialog, // zatvorenie dialogu (onSubmit)
    dialogData, // data z reduxu posielane do dialogu
    history // router props (match, push, replace...)
};
```

#### ExpoViewer
