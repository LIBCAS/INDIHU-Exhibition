Example of configuration file in .yml format that is inside project. In case of adding a settings to build application please use application.properties file.

```
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/indihu
    username: {$db.username}
    password: {$db.password}
    driver-class-name: org.postgresql.Driver
#  data:
#    elasticsearch:
#      properties:
#        http:
#          enabled: true
  jpa:
#    generate-ddl: false
    show-sql: false
    database-platform: cz.inqool.uas.db.PostgreSQL94Dialect #dependent on db server
    hibernate:
      ddl-auto: validate
      naming-strategy: org.hibernate.cfg.ImprovedNamingStrategy
  mail:
    host: {$hostname}
    port: 465
    username: {$mail.username}
    password: {$mail.password}
    properties:
      mail:
        smtp:
          ssl:
            enable: true

  http:
    multipart:
      max-file-size: 125MB
      max-request-size: 125MB

audit:
  appender: cz.inqool.uas.audit.appender.LogAppender
  mode: async

liquibase:
  change-log: classpath:/META-INF/changelog.indihu.xml
  enabled: true

logging:
  path: /var/log
  level:
    cz: info

json:
  prettyPrint: false
  serializeNulls: false

bpm:
  active: false

security:
#  require_ssl: true
  debug: true
  preauth:
     header: Osso-User-Dn
  jwt:
    secret: {$secret}
    expiration: 3000 #in seconds
    refresh: 30 #in seconds
  basic:
    authQueries: "/api/authCode/auth/, /api/authCode/auth/required"
  ldap:
    enabled: false #ldap configuration
    server: ldap://{$url}
    hostname: {$hostname}
    port: {$port}
    bind:
      dn: uid={$uid},ou={$ou},dc={$dc},dc={$dc}
      pwd: aura24grogs
    user:
      type: filter
      filter: (uid={0})
      search-base: ou={$ou},dc={$dc},dc={$dc}
    group:
      type: other
      name-attribute: cn
      member-attribute: memberUid
      search-base: ou={$ou},dc={$dc},dc={$dc}
  password:
    enabled: true
    length: 8
    digit: true
    alphabet: true

#todo files path
file:
  path: /usr/src/files
  logo: /var/www/html/favicon.ico  #folder on server 
  defaultPreview: #todo Set by files api after upload

management:
  port: 8081
  security:
    enabled: false
  trace:
    include:

admin:
  console:
    enabled: true

application:
  url: https://indihu.inqool.cz/ #url to show in mails
  siteName: Indihu

paths:
  file: /api/files/
```

Example syntax of .properties file

```
spring.datasource.url= jdbc:postgresql://localhost:5432/indihu
spring.datasource.username= {$db.username}
```
