var tab1Array;

function tableRowsProcessing() {
  tab1Array = cleanArray();
  $.each([1, 2, 3, 4, 5], function (rowIndex, num) {
    $("[id*='floatInput" + num + "']").each(function (column, el) {
      tab1Array[rowIndex][column] = parseFloat($(el).val());
      $(el).click(function () { tableOnElementClick(this) });
      $(el).change(function () { tableOnElementChange(this, tab1Array, rowIndex) });
      $(el).keyup(function () { tab1Array = updateTableCell(this, tab1Array, rowIndex, column) });
    });
    if (num != 3 && num != 5) {
      checkSumTimeRow(tab1Array, num);
    }
  });
}

function createArrayCopy(array) {
  var copyArray = new Array(array.length);
  for (var i = 0; i < array.length; i += 1) {
    copyArray[i] = array[i].slice();
  }
  return copyArray
}

// Очищение массива значений
function cleanArray() {
  array = new Array(5);
  array[0] = new Array(10);
  array[1] = new Array(10);
  array[2] = new Array(10);
  array[3] = new Array(10);
  array[4] = new Array(10);
  return array
}

// Метод для очищения нулевого значения в input
function tableOnElementClick(element) {
  var currentElement = $(element);
  currentElement.val() == 0 ? currentElement.val("") : '';
}

// Дописывает 0 для ситуации ввода числа ".5"
function tableOnElementChange(element, array, rowIndex) {
  var currentElement = $(element);
  var currentElementValue = currentElement.val();
  if (currentElementValue.indexOf('.') == 0 || currentElementValue.length == 0) {
    writeZeroAtStart(currentElement);
    checkSumTimeRow(array, rowIndex);
  }
}

// Добавляет лидирующий 0 в инпут
function writeZeroAtStart(element) {
  element.val("0" + currentElementValue)
}

// Обновляет элементы таблицы
function updateTableCell(element, array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  arrayCopy[rowIndex][column] = parseFloat($(element).val());
  arrayCopy = updateConnectedCells(arrayCopy, rowIndex, column);

  if (rowIndex == 0) {
    checkSumTimeRow(arrayCopy, 1);
    checkSumTimeRow(arrayCopy, 2);
    checkSumTimeRow(arrayCopy, 4);
  } else if (rowIndex == 2 || rowIndex == 4) {
    checkSumTimeRow(arrayCopy, 2);
    checkSumTimeRow(arrayCopy, 4);
  }
  return arrayCopy
}

function updateConnectedCells(array, rowIndex, column) {
  var arrayCopy = createArrayCopy(array);
  if (rowIndex == 0 || rowIndex == 2 || rowIndex == 4) {
    var columnNum = (column + 1);
    var calculationResult = getNewCalculatedValues(arrayCopy[0][column], arrayCopy[2][column], arrayCopy[4][column]);
    var resultRow2 = calculationResult[0];
    var resultRow4 = calculationResult[1];
    var changedElement2 = $("[id='floatInput2_" + columnNum + "']");
    var changedElement4 = $("[id='floatInput4_" + columnNum + "']");
    changedElement2.val(resultRow2);
    changedElement4.val(resultRow4);

    arrayCopy[1][column] = resultRow2;
    arrayCopy[3][column] = resultRow4;
    changeInputColor(changedElement2, resultRow2);
    changeInputColor(changedElement4, resultRow4);
  }
  return arrayCopy
}

function getNewCalculatedValues(valueRow1, valueRow3, valueRow5) {
  var notNanValue1 = isNaN(valueRow1) ? 0 : valueRow1;
  var notNanValue3 = isNaN(valueRow3) ? 0 : valueRow3;
  var notNanValue5 = isNaN(valueRow5) ? 0 : valueRow5;
  var result2 = notNanValue1 / notNanValue3;
  var result4 = result2 - (notNanValue1 / notNanValue5);

  return [isFinite(result2) ? Math.round(result2) : 0, isFinite(result4) ? Math.round(result4) : 0]
}

function changeInputColor(el, value) {
  $(el).css('background-color', value < 0 ? "#ffa4a4" : "");
  $(el).css('color', value < 0 ? "#910000" : "");
}

// Функция подсчета суммы в строке и сравнения с итогом
function checkSumTimeRow(array, rowNum) {
  var P1 = 0.001; // погрешность линейного пробега (1 строка)
  var P2 = 0.01; // погрешность для Времени локомотива в пути И показателя - время на промеж. станциях (2 и 4 строки)

  if (rowNum == 1) {
    colorRowWithInaccuracy(array, P1, rowNum);
  } else if (rowNum == 2 || rowNum == 4) {
    colorRowWithInaccuracy(array, P2, rowNum);
  }
}

// Суммирование элеметов строки
function getSumRow(array, rowNum) {
  var sum = 0;
  var arrayCopy = createArrayCopy(array);
  //Проходим по строке и суммируем все значения
  for (element in arrayCopy[rowNum - 1]) {
    var value = isNaN(arrayCopy[rowNum - 1][element]) ? 0 : arrayCopy[rowNum - 1][element];
    sum += value;
  }
  return sum
}

// Определение цвета окраски строк
function colorRowWithInaccuracy(array, inaccuracy, rowNum) {
  var sum = getSumRow(array, rowNum);
  var totalRoadValue = $("[id='totalRoad" + rowNum + " ']").text().replace(/ /g, '');
  var totalValue = parseFloat(totalRoadValue == "" ? "0" : totalRoadValue);

  if (!((totalValue * (1 + inaccuracy) >= sum) && (totalValue * (1 - inaccuracy) <= sum))) {
    colorAllRowCells(rowNum, "#ffa4a4", "#910000");
  } else {
    colorAllRowCells(rowNum, "#FFFFFF", "#000000");
  }
}

// Окраска строк
function colorAllRowCells(rowNum, bgColor, textColor) {
  $("[id='row" + rowNum + " '] td").each(function (index, el) {
    if (index != 12) {
      $(el).css('background-color', bgColor);
      $(el).css('color', textColor);
    }
  });
}
