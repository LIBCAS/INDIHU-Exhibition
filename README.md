INDIHU 
===
Project website: https://indihu.cz/


INDIHU - API
===

Deployment
---

**Prerequsities:**
 * JRE 8 (or higher), JAVA_HOME environment variable set to the JRE root folder
 * Database server
 * Smtp mail server

**Possible prerequsities:**
 * LDAP

Server configuration
---

**Steps before first run:**
 * Create an database and user with role that can create tables
 * Create **application.properties** file next to jar
 * add following configurations:
  * `spring.datasource.url= jdbc:postgresql://{$db.url}:{$db.port}/{db.name}` an appropriate url for jdbc
  * `spring.datasource.username={$db.username}` a name chosen for created db server
  * `spring.datasource.password={$db.password}` a password for given username
  * `spring.datasource.driver-class-name= org.postgresql.Driver` driver for given db server communication
  * `spring.jpa.database-platform= cz.inqool.uas.db.PostgreSQL94Dialect` dependent on db server
  * `spring.mail.host={$hostname}`
  * `spring.mail.port={$portNumber}`
  * `spring.mail.username=`
  * `spring.mail.password=`
  * `security.jwt.secret=` secret hash to use in security for verification
  * `file.path=` folder to save temporary files
  * `file.logo=` path to logo 
  * `application.url=` url to show in mail communication
  * `application.sitename= Indihu` site name to show in mail communication
 * for LDAP configuration plesae set following properties (optional settings):
  * `security.ldap.enabled=true`
  * `security.ldap.server=` url for ldap server to connect to
  * `security.ldap.hostname=` 
  * `security.ldap.port=`
  * `security.ldap.bind.dn=` 
  * `security.ldap.bind.pwd=`
  * `security.ldap.user.type= filter`
  * `security.ldap.user.filter=`
  * `security.ldap.user.search-base=`
  * `security.ldap.group.type=`
  * `security.ldap.group.name-attribute=`
  * `security.ldap.group.member-attribute=`
  * `security.ldap.group.search-base=`

Afterwards it is time to start server.

**Steps to take while first run:**
 * from curl or postman make **POST** request to `http://localhost:8080/api/reindex` with `username=test` and `password=test`
 * upload a default preview picture with **POST** request to `http://localhost:8080/api/files`, take an id of response and set it to the **application.properties** as `file.defaultPreview=` as a default picture fro media crawler for social intergation

#### One more restart of server####

And then just check registration options in admin menu with login test/test, also change credentials for admin in user profile settings is highly recommended.

For exmaple of configuration file in project look at `config.md`

Indihu - WEB
===

#### Example of exhibition structure 
- API stores all information in "single" string
- Processing is maintained in save a load expo actions

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

##### Exhibition intro

```js
const start = {
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

##### Chapter intro 

```js
const chapterStart = {
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

##### Picture screen

```js
const image = {
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

##### Video screen 

```js
const video = {
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

##### Text screen

```js
const text = {
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

##### Photo gallery screen

```js
const photogalery = {
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

##### Parallax screen

```js
const parallax = {
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

##### Zoom in screen

```js
const zoomIn = {
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

##### Before-after screen

```js
const imageChange = {
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

##### Screen with an External object 

```js
const external = {
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

##### Minigame "find in map"

```js
const gameFind = {
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

##### Minigame "Draw"

```js
const gameDraw = {
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

##### Minigame "Scratch Card"

```js
const gameWipe = {
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

##### Minigame "Guess"

```js
const gameSizing = {
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

##### Minigame "Move"

```js
const gameMove = {
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

##### Minigame "Quiz"

```js
const gameOptions = {
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

##### End of exhibition

```js
const finish = {
    type: "FINISH",
};
```
