# angular5-spreadsheet
A simple spreadsheet module for Angular5. (NO requirement for jQuery!)

Source codes can be find in **`src`** folder
(**`sheet.component.ts/html/css`**)

![Example Image](https://i.imgur.com/Nj41c7V.png "Example Image")


## Live Demo
For live demo click here: https://emre-h.github.io/angular5-spreadsheet-demo/
## Installation
You can import this library in any Angular application by running:
```bash
$ npm install angular5-spreadsheet
```
and then from your Angular `AppModule`:
```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the library
import { SheetModule } from 'angular5-spreadsheet';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // Specify library as an import
    SheetModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
## Usage
Once library is imported, you can use its sheet component in your Angular application:
```html
<sheet></sheet>
```
Or you can pass some values to adjust sheet:
```html
<sheet row="20" column="15" minWidth="70" minHeight="0"></sheet>
```

 1. **row** value determines how many rows there will be in sheet (default: 20)
 2. **column** value determines how many columns there will be in sheet (default: 15)
 3. **minWidth** value determines cells' minimum and starting width (default: 70)
 4. **minHeight** value determines cells' minimum and starting height (default: 0)
## Features
### Mathematical Expressions
You can do calculations in cells by adding **`=`** before your expression, like this:
> =5+3

And then simply pressing the **`enter`** key.

Also you can do things like this:

> =sqrt(PI)

You can use cells' values by using their ids:

> =B3-A7
### Images
You can add images to cells by using **`[img][/img]`** tags:
> [img]`https://i.imgur.com/Nj41c7V.png`[/img]

And then simply pressing the **`enter`** key.
If you want to delete an image just click on it and press the **`backspace`** key.

## Known Issues

 - It gets slower if you want to create big sheets like 100x100

## Working times for this project

 - 04/11/2017 ~(20:00-22:00)
 - 05/11/2017 ~(18:30-23:00)
 - Midterm exams
 (06/11/207 - 17/11/2017)
 - Visit to hometown (Istanbul)
 (18/11/2017 - 20/11/2017)
 - 21/11/2017 ~(23:00-01:00)
 - 22/11/2017 ~(18:00-21:00)
 - 23/11/2017 ~(19:00-20:30)
 - Free day (24/11/2017)
 - Free day (25/11/2017)
 - 26/11/2017 ~(13:30-18:00)
 - 27/11/2017 ~(17:00-18:00)
 - Free day (28/11/2017)
 - 29/11/2017 ~(22:00-00:00)
 - ELECO Conference (30/11/2017 - 02/12/2017)
 & My birthday (01/12/2017)
 - 03/12/2017 ~(15:00-22:00)

## License
MIT © [Emre Horsanalı](mailto:emrehorsanali@outlook.com)
