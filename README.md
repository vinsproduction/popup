# popup.js

[Пример] (http://vinsproduction.com/dev/popup)

### Открыть попап

```
popup.open('popup name',options={})

```

### Закрыть попап

``` 
popup.close('popup name')
```

### Примеры Jade

```

a(href="#" onclick="popup.open('test')") Test

a(href="#" onclick="popup.open('success',{body:'Ура'} )") Success

a(href="#" onclick="popup.open('error',{body:'Упс'} )") Error

a(href="#" onclick="popup.open('custom',{title: 'Hello', body:'World', left: 10, top: 10, close: false, button: 'console.log(1)', buttonClick: function(){ console.log('Closed'); popup.close(); } })") Custom 1

a(href="#" onclick="popup.open('custom',{title: 'Hello', body:'World', left: 10, top: 10, close: false, closeClick: function(){ console.log('Closed by close'); popup.close(); }, buttonClick: function(){ console.log('Closed by button'); popup.close(); },bgClick: function(){ console.log('Background Click!'); }, })") Custom 2

a(href="#" onclick="popup.open('custom',{title: 'Hello', body:'World', button: 'Открыть попап Test', buttonClick: function(){ popup.open('test');} })") Custom 3


```

### Опции (options)

```
top: 'auto'
left: 'auto'
right: 'auto'
bottom: 'auto'

close: true // Разрешить закрытие попапа

fade: 300 // Скорость появления попапа

closeClick: function() {}  // Функция кнопки закрытия
bgClick: function() {} // Функция бекграунда
buttonClick: function() {} // Функция кнопки

title: "Название"  // Текст [data-popup-title]
body: "Текст" // Текст [data-popup-body]
button: "Кнопка" // Текст [data-popup-button]

```
