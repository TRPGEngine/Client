// Copy from packages/Dice/lib/dice.ts

function rollPoint(maxPoint, minPoint = 1) {
  maxPoint = parseInt(String(maxPoint));
  minPoint = parseInt(String(minPoint));
  if (maxPoint <= 1) {
    maxPoint = 100;
  }
  if (maxPoint < minPoint) {
    maxPoint = minPoint + 1;
  }

  var range = maxPoint - minPoint + 1;
  var rand = Math.random();
  return minPoint + Math.floor(rand * range);
}

export function roll(requestStr: string) {
  try {
    let pattern = /(\d*)\s*d\s*(\d*)/gi;

    requestStr = requestStr.replace(/[^\dd\+-\/\*]+/gi, ''); //去除无效或危险字符
    let express = requestStr.replace(pattern, function(tag, num, dice) {
      num = num || 1;
      dice = dice || 100;
      let res = [];
      for (var i = 0; i < num; i++) {
        res.push(rollPoint(dice));
      }

      if (num > 1) {
        return '(' + res.join('+') + ')';
      } else {
        return res.join('+');
      }
    });

    let result = eval(express);
    let str = requestStr + '=' + express + '=' + result;
    return {
      result: true,
      str,
      value: result,
    };
  } catch (err) {
    return {
      result: false,
      str: '投骰表达式错误，无法进行运算',
    };
  }
}
