Indihu - API
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