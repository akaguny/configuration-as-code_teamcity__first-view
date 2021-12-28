---
title: "Configuration as code: Teamcity. Первое знакомство"
marp: true
theme: shcherbakov-custom-theme
headingDivider: 2
paginate: true
_paginate: false
html: true
---

<!-- _class: cover -->

# Configuration as code: Teamcity. Первое знакомство

## Обо мне

<!-- _footer: test -->

<div class="two-columns">

![](./assets/IMG20211213151405_cropped.jpg)

Меня зовут Алексей.
Последние 5 лет в ролях тестировщика-автоматизатора, фронтенд разработчика и управленца (тех.лид, тимлид).
В рамках разных проектов, но одной крупной компании.
От стажёра до ведущего инженера.

</div>

## Teamcity vs Другие CI

+ Teamcity - UI first

<!--
... 
в отличие от TravisCI, GithubActions и других Teamcity - UI first
...
это даёт низкий порог входа -
вам не надо изучать специфику экосистемы для того чтобы выполнить сборку условного npm пакета.
...
Пока звучит хорошо, даже отлично!
Но в чём подвох?
 -->

![h:400](./assets/film-poster-click.jpg)
+ Отлично!

<!-- _footer: Фото-постер: https://www.kinopoisk.ru/picture/430560/ -->

## Teamcity - про крупный enterprise

- шаблонные сборки
- мета-раннеры
- наследование
- pipeline
- параметры сборки
- аудит

<!--
Teamcity - про крупный enterprise
У вас будут десятки проектов с десятками сборок в каждом
В ходе работы вы наверняка столкнётесь с классическими проблемами
...
дублирование - teamcity предложит:
- шаблонные сборки
- мета-раннеры
- наследование
...
зависимости - teamcity предложит:
- pipeline и реверсивные параметры
...
кастомизацию поведения без изменения логики:
- параметры сборок
...
разбор ошибок и поиск ответственных
- аудит
 -->

## История Teamcity. Configuration as code

![bg](./assets/raskopki.JPG)

<!-- _footer: <a href="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fe/%D0%90%D1%80%D1%85%D0%B5%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%8F.JPG/1024px-%D0%90%D1%80%D1%85%D0%B5%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%8F.JPG">фото: википедия</a> -->

## 2015 XML

[хранение настроек teamcity в системах контроля версий Teamcity 9.0](https://confluence.jetbrains.com/display/TCD9/What%27s+New+in+TeamCity+9.0#What'sNewinTeamCity9.0-StoringprojectsettingsinGitandMercurial)

<!-- cамо версионирование представляет собой биндинг конфигурации Teamcity server и конфигурации под контролем системы контроля версий. -->

## Параллельная ветвь эволюции. Наработки сообщества
* XML отстой, Kotlin DSL ещё нет
* [Golang client for TeamCity REST API](https://github.com/cvbarros/go-teamcity) + [Terraform](https://www.terraform.io/) = [Terraform Provider for Jetbrains TeamCity CI server](https://github.com/cvbarros/terraform-provider-teamcity)

<!--
шёл 2017 и kolinDSL был ещё не готов
А что предложило сообщество спросите вы?
Сообщество предложило по сути свой DSL им стал Terraform Provider for Jetbrains TeamCity CI server

terraform provider по факту предоставляет тотже DSL, только применяет его в Teamcity через HTTP API Teamcity
 -->

<!-- _footer: <a href="https://cvbarros.io/2018/11/building-builds---teamcity-pipelines-as-code-using-terraform/">Building Builds - TeamCity Pipelines as Code using Terraform</a> -->

## 2017 KotlinDSL
* [Teamcity DSL](https://confluence.jetbrains.com/display/TCD10/What%27s+New+in+TeamCity+10.0#What'sNewinTeamCity10.0-DSLforTeamCityProjectConfiguration)

* ![h:600](./assets/Kotlin_teamcity_10_2017_1.png)

<!-- начиная с Teamcity 10 появилась возможность хранения и взаимодейтсвия с конфигурацией через KotlinDSL -->

## 2018 Portable KotinDSL
[Portable Teamcity DSL](https://confluence.jetbrains.com/display/TCD18/What%27s+New+in+TeamCity+2018.1#What'sNewinTeamCity2018.1-PortableKotlinDSLformat)

* settings.kts содержит конфигурацию целиком
* uuid и id для сущностей опциональны
* настройка версионирования проекта и настройки VCS не могут быть изменены из DSL

<!-- в версии 2018.x DSL довели до промышленного состояния, покрыв оставшиеся кейсы.
Добавили portable режим работы с DSL.
...
* при первом коммите настроек
...
* uuid и id для сущностей опциональны
Больше нет необходимости зашиваться на идентификаторы
...
Но какие ограничения?
* настройка версионирования проекта и настройки VCS не могут быть изменены из DSL.
...
Также плохая новость состоит в том, что есть ряд сущностей, которые не попадают под общую концепцию и никогда не будут отражены в DSL в полной мере.
Но хорошая это то, что эти сущности могут быть представлены в DSL в привычном для него виде. Об этом позже, когда будем рассматривать шаблонные сборки и метараннеры.
 -->

## Teamcity 2021

|                        | KotlinDSL | xml(plain) |
| ---------------------- | --------- | ---------- |
| переносимость          | ✅        | ❌         |
| гибкость               | ✅        | ❌         |
| расширяемость          | ✅        | ❌         |
| обратная совместимость | ✅        | ✅/❌      |

* никто не любит xml
<!-- 
А что в настоящем?
Вернёмся в 2021, последняя версия на момент рассказа доклада Teamcity 2021.2
Как видно из таблички XML проигрывает по всем фронтам.
....
Кроме того ИМХО конечно, но никто не любит XML

Пример DSL конфигурации + представление её же ввиде xml
-->

## Kotlin DSL

Как будет выглядеть сборка ввиде DSL можно посмотреть прямо в интерфейсе.
|интерфейс|dsl|
|---------|---|
|<><><><><>|<><>|

![](./assets/slide5.jpg)

Справа у нас представление сборки из UI в Kotlin DSL

## Структура версионируемого проекта

```
.teamcity
[
--| pluginData
----| _Self
------| metaRunners
--------| matarunner.xml
]
[
--| patches
----| entities
]
--| pom.xml
[--| Readme.md]
--| settings.kts
```

обязательные:

- pom.xml
- settings.kts

## Типовые сущности и связи сущностей в представлении Teamcity DSL

1. Шаблонная сборка
2. pipeline из нескольких сборок
3. метараннеры
4. параметры сборки в DSL

<!-- Рассмотрим ряд типовых сущностей, с которыми вы наверняка сталкиваетесь. -->

## Шаблонная сборка. Teamcity DSL vs UI

вот пример сборки с использованием шаблонной

![](./assets/slide8.jpg)

внимание вопрос: что делают отключённые шаги?

Да, мы можем походить по каждому из шагов и попробовтаь составить представление примерно так:
коллаж из картинок или одна над другой?
- картинка 1 - шаг 1 в окне браузера
- картинка 2 - шаг 2 в окне браузера
- картинка 3 - шаг 3 в окне браузера

Но хотим ли?
Я нет.
Вместо этого обратимся к коду

## Шаблонная сборка. Использование шаблона
![](./assets/slide11.jpg)

на строке происходит подключение шаблона

использование https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#80

## Шаблонная сборка. Регистрация шаблона в DSL

![](./assets/slide9.jpg)
регистрация шаблона в settings.kts https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#43

## Шаблонная сборка. Конфигурация шаблона

![](./assets/slide10.jpg)
имплементация https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#94

отличия от любой другой сборки:

ссылка на шаблон
отличия от любой другой сборки

вместо BuildType( тут Template(
у шагов (steps) явно заданы ID

## Шаблонная сборка. Итоги
* DSL позволяет отследить шаблон - источник ❌
* Шаблонные сборки с DSL всё ещё отстой ❌
* шаблонные сборки не нужны если вы используете KotlinDSL ✅


явное отключение шагов, заимствованных из шаблона по ID
Шаблонные конфигурации это legacy

## не используйте шаблонные сборки

Since DSL is a code in Kotlin programming language, all paradigms supported by this language are available. For instance, instead of using TeamCity templates, one can create a function or class which will encapsulate project common settings. For those who have programming skills it allows for more natural reuse of build configuration settings.

https://www.jetbrains.com/help/teamcity/kotlin-dsl.html#KotlinDSL-HowKotlinDSLWorks

## pipeline через зависимость артефактов

![](./assets/slide12.jpg)

## pipeline через зависимость артефактов. Регистрация двух сборок

![](./assets/slide13.jpg)

## pipeline через зависимость артефактов. Конфигурация первой сборки

![](./assets/slide14.jpg)
Первая сборка

https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#140

В результате работы будет создан артифакт сборки ChainFirstBuild.txt

## pipeline через зависимость артефактов. Конфигурация второй сборки

![](./assets/slide15.jpg)

использование зависимости по артефакту от первой сборки во второй

https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#169

## метараннеры в структуре проекта

```
.teamcity
--| pluginData
----| _Self
------| metaRunners
--------| matarunner.xml
```

metarunner.xml в файле settings.kts в poject явно никак не регистрируется

регистрация в проекте происходит за счёт размещения xml файла .teamcity/pluginData/\_Self/metaRunners/<runner_id>.xml

> можно править существующий в проекте (добавленный из UI), но не создавать новый в проекте. (по крайней мере у меня не вышло добавить мета-раннер из vcs)

<!-- _footer:  [подробнее про мета раннеры teamcity](https://www.jetbrains.com/help/teamcity/working-with-meta-runner.html#Creating+Meta-Runner+from+XML+Definition+of+Build+Configuration) -->

## использование метараннера в DSL

![](./assets/slide17.jpg)

на строке 6 указан type = "<runner_id>", Т.е. Cnc_Sandbox_ShcherbakovTest_Metarunner - id метараннера

исходный код: https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/settings.kts?at=355bc7dd0baedeb171627328c51109ec05adecc2#134

## метараннер код

![](./assets/slide18.jpg)

исходный код https://stash.billing.ru/projects/~alexey.shcherbakov/repos/teamcity-dsl-first-look/browse/.teamcity/pluginData/_Self/metaRunners/Cnc_Sandbox_ShcherbakovTest_MetaRunner.xml?at=355bc7dd0baedeb171627328c51109ec05adecc2#2

имплементация

в имплементации мета-раннеров нет изменений относительно использования в UI

> Метараннеры в контексте существования DSL - legacy. Xml зло.

## параметры сборки в DSL

![](./assets/slide19.jpg)

код:

```
params {
    text("reverse.dep.*.version_previous", "7.12.0", label = "Предыдущая версия", display = ParameterDisplay.PROMPT,
          regex = """^(([1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*))${'$'}""", validationMessage = "Некорретный номер версии")
    select("reverse.dep.*.project_name", "CNC", label = "Компонент", display = ParameterDisplay.PROMPT,
            options = listOf("CNC", "CATALOG", "CORE", "CATALOG-UI"))
    text("reverse.dep.*.version_current", "7.13.0", label = "Текущая версия", display = ParameterDisplay.PROMPT,
          regex = """^(([1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*))${'$'}""", validationMessage = "Некорректный номер версии")
    param("reverse.dep.*.product_name", "CNC")
}
```

интерфейс:

![](./assets/image2020-8-12_7-48-59.png)

Особенно примечательно это становится, когда сборки в chain и можно найти как и куда должен проливаться reverse.dep. Описание reverse.dep https://www.jetbrains.com/help/teamcity/predefined-build-parameters.html#Overriding+dependencies+Properties

## Варианты использования версионирования настроек. UI first

1. создание или изменение чего-то из интерфейса пользователем
2. teamcity делает коммит от пользователя на изменение сборки в проекте

## Варианты использования версионирования настроек. git first

1. коммит на изменение сборки от пользователя
2. применение изменений в teamcity

## Варианты использования версионирования настроек. Mixed (Git + UI)

1. коммит на изменение сборки от пользователя
2. применение изменений в teamcity
3. создание или изменение чего-то из интерфейса пользователем
4. teamcity делает коммит от пользователя с патчем на изменение сборки в проекте
5. применение патча от code owner репозитория или от пользователя как инициатора когда-нибудь

## Варианты использования версионирования настроек

| изменение / подход | git first | ui first | mixed (git + ui) |
| ------------------ | --------- | -------- | ---------------- |
| ui                 | ✅        | ❌       |
| code               | ✅        | ❌       |

## Как прийдётся трансформировать работу по конфигурированию

![](./assets/slide22.jpg)

в варианте UI first практически никак.

во всех остальных (Git first, UI first):

- уменьшить количество пояснений и коммуникация по изменению конфигураций
- удалить все заметки - бэкапы сборок
- немного изучить Kotlin (однако даже javascript разработкик разобрался, так что согласно мемасикам из интернетов получится у любого, даже не программиста =) )
- относится к разработке конфигурации как и к любой другой разработке (все подходы к разработке станут ложиться на кофигурирование CI as is)

## Как попробовать фичу представления настроек в DSL

![](./assets/slide23.jpg)

Уже сейчас достаточно зайти в любую сборку и нажать на кнопку View DSL

## Как попробовать фичу версионирования настроек

1. Создать свой, не пустой репозиторий
2. Создать Teamcity проект/подпроект
3. Включить версионирование проекта
4. Дождаться initial commit от teamcity в гит

## Как работать с Kolin DSL в intellij idea

1. Включены плагины maven, kotlin
2. Добавить проект в maven (пкм на pom.xml)
3. Выполнить install

> если у вас в организации используется локальное зеркало maven,
> то надо добавить искобчение для репозитория dsl

делается это путём внесения изменений в ваш конфигурационный файл для maven. Для пользователей windows путь примерно следующий:
`C:\Users\alexey.shcherbakov\.m2\settings.xml`

настройка (в секцию settings > mirrors)

```xml
...
<settings ...>
  <servers>
...
  </servers>
  <mirrors>
    <mirror>
      <mirrorOf>*,!jetbrains-all,!teamcity-server</mirrorOf>
      <name>maven</name>
      <url>https://${TEAMCITY_SERVER_URL}:${TEAMCITY_SERVER_PORT}/artifactory/maven</url>
      <id>maven</id>
    </mirror>
    ...
  </mirrors>
...
</settings>
```

## Начать переводить проект на версионирование настроек безопасно

![](./assets/image2020-7-17_18-6-38.png)

скачать архив с настройками проекта через Actions > Download settings in Kotlin format

## Начать переводить проект на версионирование настроек безопасно. Init проекта

![](./assets/slide28.jpg)
поместить содержимое скаченного архива в папку .teamcity репозитория

---

### Важно!<br>на всемя перехода чтобы не зааффектить существующие сборки рекомендуется выглючить триггеры, билд фичи

`regexp`

## создать проект teamcity

![](./assets/slide30.jpg)

## создать проект на основе версионируемых настроек

![](./assets/slide31.jpg)
Teamcity увидит ваш файл settings.kts

## создать подпроект на основе версионируемых настроек

Если вы создаёте подпроект в версионируемом проекте (как в моём случае), то будет необходимо "отчудить" новый подпроект от основного

после создания проекта заходим в подпроект

- там будет стоять Use settings from a parent project
- выбрать Synchronization enabled
- далее импортируем настройки

## Применение настроек из VCS

> импорт может занять продолжительное время в случае большого проекта

![](./assets/versioned-settings-import-settings-result.jpg)

## 20/80 - UI first

1. Знакомство с конфигурацией
2. Откатов состояния конфигурации всего проекта до последнего рабочего
3. Анализ существующих сборок
4. Перенос сборки из одного проекта в другой методом копирования
