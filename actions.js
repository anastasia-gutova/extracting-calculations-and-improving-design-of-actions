var isWarning = false;
var tab1Array;

function tableRowsProcessing() {
  tab1Array = new Array(5);

  tab1Array[0] = new Array(10);
  tab1Array[1] = new Array(10);
  tab1Array[2] = new Array(10);
  tab1Array[3] = new Array(10);
  tab1Array[4] = new Array(10);

  $.each([1, 2, 3, 4, 5], function (rowIndex, num) {
    $("[id*='floatInput" + num + "']").each(function (column, el) {
      tab1Array[rowIndex][column] = parseFloat($(el).val());
      $(el).click(function () {
        if ($(this).val() == 0) {
          $(this).val("");
        }
      });

      $(el).change(function () {
        if ($(this).val().indexOf('.') == 0 || $(this).val().length == 0) {
          $(this).val("0" + $(this).val());
          checkSumTimeRow(num - 1);
        }
      });
      $(el).keyup(calculateFunction(rowIndex, column));
    });
    if (num != 3 && num != 5) {
      checkSumTimeRow(num);
    }
  });
}

function calculateFunction(rowIndex, column) {
  tab1Array[rowIndex][column] = parseFloat($(this).val());
  if (rowIndex == 0 || rowIndex == 2 || rowIndex == 4) {
    var columnNum = (column + 1);
    var newValue1 = tab1Array[0][column];
    var newValue3 = tab1Array[2][column];
    var newValue5 = tab1Array[4][column];
    var element1 = isNaN(newValue1) ? 0 : newValue1;
    var element3 = isNaN(newValue3) ? 0 : newValue3;
    var element5 = isNaN(newValue5) ? 0 : newValue5;
    var result2 = element1 / element3;
    var result4 = (element1 / element3) - (element1 / element5);
    var formattedResult2 = isFinite(result2) ? Math.round(result2) : 0;
    var formattedResult4 = isFinite(result4) ? Math.round(result4) : 0;
    var changedElement2 = $("[id='floatInput2_" + columnNum + "']");
    var changedElement4 = $("[id='floatInput4_" + columnNum + "']");

    tab1Array[1][column] = formattedResult2;
    tab1Array[3][column] = formattedResult4;
    changedElement2.val(formattedResult2);
    changedElement4.val(formattedResult4);
    changeInputColor(changedElement2, formattedResult2);
    changeInputColor(changedElement4, formattedResult4);
    if (rowIndex == 0) {
      checkSumTimeRow(1);
      checkSumTimeRow(2);
      checkSumTimeRow(4);
    } else if (rowIndex == 2 || rowIndex == 4) {
      checkSumTimeRow(2);
      checkSumTimeRow(4);
    }
  }
}

function changeInputColor(el, value) {
  if (value < 0) {
    $(el).css('background-color', "#ffa4a4");
    $(el).css('color', "#910000");
    needWarning = true;
  } else {
    $(el).css('background-color', "");
    $(el).css('color', "");
  }
}

// Функция подсчета суммы в строке и сравнения с итогом
function checkSumTimeRow(rowNum) {
  sum = 0;
  //Проходим по строке и суммируем все значения
  for (element in tab1Array[rowNum - 1]) {
    var value = isNaN(tab1Array[rowNum - 1][element]) ? 0 : tab1Array[rowNum - 1][element];
    sum += value;
  }

  //Закрашиваем всю строку
  var P1 = 0.001; // погрешность линейного пробега (1 строка)
  var P2 = 0.01; // погрешность для Времени локомотива в пути И показателя - время на промеж. станциях (2 и 4 строки)

  if (rowNum == 1) {
    colorRowWithInaccuracy(P1, rowNum);
  } else if (rowNum == 2 || rowNum == 4) {
    colorRowWithInaccuracy(P2, rowNum);
  }
}

function colorRowWithInaccuracy(inaccuracy, rowNum) {
  var totalValue = parseFloat($("[id='totalRoad" + rowNum + " ']").text().replace(/ /g, '') == "" ? "0" : $("[id='totalRoad" + rowNum + " ']").text().replace(/ /g, ''));

  if (!((totalValue * (1 + inaccuracy) >= sum) && (totalValue * (1 - inaccuracy) <= sum))) {
    $("[id='row" + rowNum + " '] td").each(function (index, el) {
      if (index != 12) {
        $(el).css('background-color', "#ffa4a4");
        $(el).css('color', "#910000")
        needWarning = true;
      }
    });
  } else {
    $("[id='row" + rowNum + " '] td").each(function (index, el) {
      if (index != 12) {
        $(el).css("background-color", "#FFFFFF");
        $(el).css("color", "#000000");
      }
    });
  }
}
