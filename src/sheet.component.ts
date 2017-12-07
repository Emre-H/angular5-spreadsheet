// Emre Horsanalı (emrehorsanali@outlook.com) - 2017
import { Component } from '@angular/core';
import { HostListener } from '@angular/core';
import { Input } from '@angular/core';
import { OnInit } from '@angular/core';
@Component({
  selector: 'ng-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.css']
})
export class SheetComponent implements OnInit {
  // These variables will be initialized or change in functions.
  rows = null;
  columns = null;
  widthsArray = null;
  heightsArray = null;
  columnNames = null;
  dragging = null;
  targetNumber = null;
  targetInput = null;
  targetImg = null;
  rowNumber = 20
  columnNumber = 15;
  minCellWidth = 70;
  minCellHeight = 0;
  previousX = 0;
  previousY = 0;
  mouseDown = false;
  isImgClicked = false;
  // Input to determine how many rows there will be in sheet
  @Input() row = '20';
  // Input to determine how many columns there will be in sheet
  @Input() column = '15';
  // Input to determine cells' minimum width
  @Input() minWidth = '70';
  // Input to determine cells' minimum height
  @Input() minHeight = '0';
  ngOnInit() {
    // Check if given column value is number and greater than 1
    if (this.isNumber(this.column) && parseFloat(this.column) > 1) {
      /* If it is, set columnNumber variable to
         given value's converted form */
      this.columnNumber = parseFloat(this.column);
    }
    // Check if given row value is number and greater than 1
    if (this.isNumber(this.row) && parseFloat(this.row) > 1) {
      /* If it is, set rowNumber variable to
         given value's converted form */
      this.rowNumber = parseFloat(this.row);
    }
    // Check if given minWidth value is number and greater than 70
    if (this.isNumber(this.minWidth) && parseFloat(this.minWidth) > 70) {
      /* If it is, set cells' minimum width variable to
         given value's converted form */
      this.minCellWidth = parseFloat(this.minWidth);
    }
    // Check if given minHeight value is number and greater than 0
    if (this.isNumber(this.minHeight) && parseFloat(this.minHeight) > 0) {
      /* If it is, set cells' minimum height variable to
         given value's converted form */
      this.minCellHeight = parseFloat(this.minHeight);
    }
    /* Create an array of size given row value.
       This array is bound to *ngFor in HTML and
       its size determines how many HTMLTableDataCellElement
       will be in a column */
    this.rows = new Array(this.rowNumber);
    /* Fill above array with 1 to array's length.
       These numbers are bound to cells' id(row name) in HTML and
       also used in other functions as their indexes in heightsArray */
    for (let i = 0; i < this.rows.length; i++) {
      this.rows[i] = i + 1;
    }
    /* Create an array of size given column value
       This array is bound to *ngFor in HTML and
       its size determines how many HTMLTableDataCellElement
       will be in a row */
    this.columns = new Array(this.columnNumber);
    /* Fill above array with 1 to array's length.
       These numbers are used in other functions
       as cells' indexes in widthsArray
       and also in columnNames */
    for (let i = 0; i < this.columns.length; i++) {
      this.columns[i] = i + 1;
    }
    /* Create an array with size of columns array's size and
       fill it with minimum column width.
       This array will hold every cell's width,
       its items are bound to several element widths in HTML */
    this.widthsArray = Array(this.columnNumber).fill(this.minCellWidth);
    /* Create an array with size of rows array's size and
       fill it with minimum row width.
       This array will hold every cell's height,
       its items are bound to several element heights in HTML */
    this.heightsArray = Array(this.rowNumber).fill(this.minCellHeight);
    // Alphabet array to use naming columns
    let  alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
         'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    // At first set columnNames to copy of alphabet array
    this.columnNames = alphabet.slice();
    // Check if there is more columns than letters in alphabet
    if (this.columns.length > alphabet.length) {
      // If there is, calculate the difference between them
      let diff = this.columns.length - alphabet.length;
      let indexAlphabet = 0;
      let indexColumnNames = 0;
      let letter = null;
      /* Loop the codes below until difference becomes zero.
         This is for expanding columnNames array's size to
         be equal with column numbers */
      while (diff > 0) {
        // Take the letter from alphabet array according to indexAlphabet
        letter = alphabet[indexAlphabet];
        /* Take an element from columnNames array according to indexColumnNames
           and combine it with a constantly changing letter from alphabet
           then add this new string to the columnNames.
           This will create a pattern like 'A,B,C,..,AA,AB,AC,..,BA,BB,BC..' */
        this.columnNames.push(this.columnNames[indexColumnNames] + letter);
        // Increase indexAlphabet one for moving next letter in the next loop
        indexAlphabet = indexAlphabet + 1;
        // Check if indexAlphabet reach the end of alphabet array
        if (indexAlphabet === alphabet.length) {
          // If it is, set it zero to start over
          indexAlphabet = 0;
          /* Increase indexColumnNames one
             for moving next element in columnNames array */
          indexColumnNames = indexColumnNames + 1;
        }
        /* Decrease difference one because
           columnNames array's size increased one now */
        diff = diff - 1;
      }
    }
  }
  inputClicked(event) {
    // Check if any image is selected before
    if (this.targetImg != null) {
      /* If it is, make changes of previously selected image element's style
         to make it obvious that it is no longer selected */
      this.undoSelectedStyle(this.targetImg);
      // Inform other functions that no image is clicked
      this.isImgClicked = false;
    }
    // Get HTMLInputElement of clicked input
    this.targetInput = this.getTarget(event);
    /* Make changes of clicked input element's style
       to make it obvious that it is selected */
    this.makeSelectedStyle(this.targetInput);
  }
  enterPressed(columnIndex, rowIndex) {
    // Blur selected input to call inputBlurred function
    this.targetInput.blur();
    // Get selected input element's value
    let input = this.getInputValue(this.targetInput);
    // Check if the value is a call to calculate a mathematical expression
    if (this.isMathTriggered(input)) {
      /* If it is, change selected input element's value to
         evaluated value of expression */
      this.changeInputValue(this.targetInput, this.mathEval(input));
    }
    // Check if the value is a call to put an image
    if (this.isImgTriggered(input)) {
      let originalImgWidth;
      let originalImgHeight;
      // If it is, get selected input element's current cell's sizes
      let currentRowHeight = this.heightsArray[rowIndex];
      let currentColumnWidth = this.widthsArray[columnIndex];
      /* These letiables are for scope issues of the below function
         Basically redeclaration of arrays that holds
         bound sizes of every cell */
      let heightsArray = this.heightsArray;
      let widthsArray = this.widthsArray;
      // This image for using the below function
      let tempImg = new Image();
      /* This function is for getting image's
         original width and height when load.
         This is needed because of auto arranging the cell's
         width and height according to image */
      tempImg.onload = function() {
        originalImgWidth = tempImg.width;
        originalImgHeight = tempImg.height;
        // Check if the cell's current height is smaller than image's height
        if (currentRowHeight < originalImgHeight) {
          // If it is, change cell's bound height to image's height
          heightsArray[rowIndex] = originalImgHeight;
        }
        // Check if the cell's current width is smaller than image's width
        if (currentColumnWidth < originalImgWidth) {
          // If it is, change cell's bound width to image's width
          widthsArray[columnIndex] = originalImgWidth;
        }
      };
      // Get image's source link from input's value
      let src = this.getSrcLink(input);
      /* Set source of the image that is using for getting
         original sizes to the link for calling function above */
      this.setSrc(tempImg, src);
      // Get HTMLImageElement that shares same cell with selected input element
      let img = this.getImgElement(this.targetInput);
      // Set HTMLImageElement's source to the link
      this.setSrc(img, src);
      // Make selected input element invisible by setting its display to none
      this.changeDisplay(this.targetInput, 'none');
      // Make image element visible by setting its display to block
      this.changeDisplay(img, 'block');
    }
  }
  inputBlurred() {
    /* Make changes of previously selected input element's style
       to make it obvious that it is no longer selected */
    this.undoSelectedStyle(this.targetInput);
  }
  imgClicked(event) {
    // Inform other functions that one image is clicked
    this.isImgClicked = true;
    // Get HTMLImageElement of clicked image
    this.targetImg = this.getTarget(event);
    /* Make changes of clicked image element's style
       to make it obvious that it is selected */
    this.makeSelectedStyle(this.targetImg);
  }
  // This function is called when mouse is down
  dragStart(event, number) {
    /* This number is index for later uses to get
       bound sizes of the target cell from array in other functions */
    this.targetNumber = number;
    // Inform other functions that mouse is down
    this.mouseDown = true;
    /* Get mouse's current positions and initialize them to variables
       for later uses in other functions */
    this.previousX = event.clientX;
    this.previousY = event.clientY;
    // Check if the dragging started by height resizer
    if (this.getTarget(event).className === 'height-resizer') {
      // If it is, inform other functions that user is dragging height resizer
      this.dragging = 'height-resizer';
    }else {
      /* If it isn't, inform other functions
      that user is dragging width resizer */
      this.dragging = 'width-resizer';
    }
  }
  @HostListener('window:mouseup', ['$event'])
  dragStop(event: MouseEvent) {
    // Inform other functions that mouse is up
    this.mouseDown = false;
  }
  @HostListener('window:mousemove', ['$event'])
  whileDragging(event: MouseEvent) {
    if (this.mouseDown) {
      let changeX = 0;
      let changeY = 0;
      // Get mouse's current positions
      let currentX = event.clientX;
      let currentY = event.clientY;
      // Check if user is dragging width resizer
      if (this.dragging === 'width-resizer') {
        // If it is, get target cell's bound width
        let currentColumnWidth = this.widthsArray[this.targetNumber];
        // Calculate mouse's change of X position
        changeX = currentX - this.previousX;
        // Calculate new width by adding old width and change
        let newColumnWidth = currentColumnWidth + changeX;
        // Check if the calculated new width is bigger than minimum width
        if (newColumnWidth >= this.minCellWidth) {
          // If it is, set cell's bound width to new width
          this.widthsArray[this.targetNumber] = newColumnWidth;
          /* Set mouse's old X position to current new position for accurate
             calculations in next loop */
          this.previousX = this.previousX + changeX;
        }else {
          // If it isn't, set cell's bound width to minimum width
          this.widthsArray[this.targetNumber] = this.minCellWidth;
        }
      }
      // Check if user is dragging height resizer
      if (this.dragging === 'height-resizer') {
        // If it is, get target cell's bound height
        let currentRowHeight = this.heightsArray[this.targetNumber];
        // Calculate mouse's change of Y position
        changeY = currentY - this.previousY;
        // Calculate new height by adding old height and change
        let newRowHeight = currentRowHeight + changeY;
        // Check if the calculated new height is bigger than minimum height
        if (newRowHeight >= this.minCellHeight) {
          // If it is, set cell's bound height to new height
          this.heightsArray[this.targetNumber] = newRowHeight;
          /* Set mouse's old Y position to current new position for accurate
             calculations in next loop */
          this.previousY = this.previousY + changeY;
        }else {
          // If it isn't, set cell's bound height to minimum height
          this.heightsArray[this.targetNumber] = this.minCellHeight;
        }
      }
    }
  }
  @HostListener('window:keyup.backspace', ['$event'])
  backspacePressed(event: KeyboardEvent) {
    // Check if any image is clicked right now
    if (this.isImgClicked === true) {
      /* If it is, make input element(which shares same cell with clicked image)
         visible by setting its display to inline */
      this.changeDisplay(this.getInputElement(this.targetImg), 'inline');
      // Make image element invisible by setting its display to none
      this.changeDisplay(this.targetImg, 'none');
    }
  }
  // Returns given event's a target HTMLElement
  getTarget(event) {
    return (event.target || event.srcElement || event.currentTarget);
  }
  /* Returns an array with (ColumnName), (RowName) seperated from each other,
     according to given id with '(ColumnName)(RowName)' format, e.g: B16) */
  idSeperator(id) {
    return /^(\D*)(.*)$/.exec(id);
  }
  /* Returns HTMLTableDataCellElement(RowCell) according to given HTMLElement
    (HTMLElement should have id with '(ColumnName)(RowName)' format, e.g: B16)*/
  getRowCell(target) {
    let rowName = this.idSeperator(target.id)[2];
    let rowCell = document.getElementById(rowName);
    return rowCell;
  }
  /* Returns HTMLTableDataCellElement(ColumnCell) according to given HTMLElement
    (HTMLElement should have id with '(ColumnName)(RowName)' format, e.g: B16)*/
  getColumnCell(target) {
    let columnName = this.idSeperator(target.id)[1];
    let columnCell = document.getElementById(columnName);
    return columnCell;
  }
  // Sets given HTMLElement's backgroundColor to given string
  changeBgColor(target, color) {
    target.style.backgroundColor = color;
  }
  // Sets given HTMLElement's border style to given string
  changeBorder(target, border) {
    target.style.border = border;
  }
  // Returns given HTMLInputElement's value
  getInputValue (target) {
    return target.value;
  }
  // Sets given HTMLInputElement's value to given value
  changeInputValue(target, value) {
    target.value = value;
  }
  // Checks if given string has '=' as a first char
  isMathTriggered (input) {
    return (input[0] === '=' && input.length > 1);
  }
  // Checks if given string has [img][/img] tags
  isImgTriggered (input) {
    return (input.split(/\[img\]|\[\/img\]/).length === 3);
  }
  // Returns the string that freed from [img][/img] tags
  getSrcLink(input) {
    return input.split(/\[img\]|\[\/img\]/)[1];
  }
  // Sets given HTMLElement's display to given string
  changeDisplay(target, display) {
    target.style.display = display;
  }
  // Sets given HTMLImageElement source to given string
  setSrc(target, src) {
    target.src = src;
  }
  // Returns HTMLImageElement that shares same cell with given HTMLInputElement
  getImgElement(target) {
    return target.parentNode.children[1];
  }
  // Returns HTMLInputElement that shares same cell with given HTMLImageElement
  getInputElement(target) {
    return target.parentNode.children[0];
  }
  /* Sets given HTMLElement's style to selected form(darker)
     (also its row and column cells) */
  makeSelectedStyle(target) {
    this.changeBorder(target, '1px solid SteelBlue');
    this.changeBgColor(this.getColumnCell(target), 'SteelBlue');
    this.changeBgColor(this.getRowCell(target), 'SteelBlue');
  }
  /* Sets given HTMLElement's style back to the original form(lighter)
     (also its row and column cells) */
  undoSelectedStyle(target) {
    this.changeBorder(target, '1px solid white');
    this.changeBgColor(this.getColumnCell(target), 'LightSteelBlue');
    this.changeBgColor(this.getRowCell(target), 'LightSteelBlue');
  }
  // Checks if a given string is number
  isNumber (string) {
    return !isNaN(parseFloat(string)) && isFinite(string);
  }
  // Tries to mathematically evaluate any given string
  mathEval (exp) {
    // Regex to catch anything but basic algebraic expressions
    let regex = /(?:[a-z$_][a-z0-9$_]*)|(?:[;={}\[\]"'!&<>^\\?:])/ig;
    let valid = true;
    let originalExp = exp;
    let elementValue = undefined;
    // Delete first char of string which is '=' that comes from triggering
    exp = exp.slice(1);
    // Detect valid identifier names and replace them
    exp = exp.replace(regex, function (word){
      /* Try if the word is a cell id.
         If it is, replace the word with cell value */
      try {
        elementValue = (<HTMLInputElement>document.getElementById(word)).value;
        if (elementValue === '') {
          elementValue = 0;
        }
        if (elementValue !== undefined) {
          return elementValue;
        }
      }catch (err) {} // If it isn't, move on
      // If the word is a direct member of Math, allow
      if (Math.hasOwnProperty(word)) {
        return 'Math.' + word;
      }else { // Otherwise the expression is invalid
      valid = false;
      }
    });
    /* Don't eval if our replace function flagged as invalid,
       instead return original expression */
    if (!valid) {
    return originalExp;
    }else {
      /* Try to eval expression,
      if it gives an error return original expression */
      try {
        return eval(exp);
      }catch (e) {
        return originalExp;
      };
    }
  }
}
