# popup.js

[Пример] (http://vinsproduction.com/projects/popup)

### JADE

```
a(href="#" onclick="popup.open('test')") Test

a(href="#" onclick="popup.open('success',{body:'Ура'} )") Success

a(href="#" onclick="popup.open('error',{body:'Упс'} )") Error

a(href="#" onclick="popup.open('custom',{title: 'Hello', body:'World', left: 10, top: 10, close: false, button: 'console.log(1)', buttonClick: function(){ console.log('Closed'); popup.close(); } })") Custom

a(href="#" onclick="popup.open('custom',{title: 'Hello', body:'World', button: 'Открыть попап Test', buttonClick: function(){ popup.open('test');} })") Custom 2

```
