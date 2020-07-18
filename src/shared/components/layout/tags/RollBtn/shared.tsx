// Copy from packages/Dice/lib/dice.ts

function rollPoint(maxPoint, minPoint = 1) {
  maxPoint = parseInt(String(maxPoint), 10);
  minPoint = parseInt(String(minPoint), 10);
  if (maxPoint <= 1) {
    maxPoint = 100;
  }
  if (maxPoint < minPoint) {
    maxPoint = minPoint + 1;
  }

  const range = maxPoint - minPoint + 1;
  const rand = Math.random();
  return minPoint + Math.floor(rand * range);
}

export function roll(requestStr: string) {
  try {
    const pattern = /(\d*)\s*d\s*(\d*)/gi;

    requestStr = requestStr.replace(/[^\dd\+-\/\*\(\)]+/gi, ''); // 去除无效或危险字符
    const express = requestStr.replace(pattern, function(tag, num, dice) {
      num = num || 1;
      dice = dice || 100;
      const res = [];
      for (let i = 0; i < num; i++) {
        res.push(rollPoint(dice));
      }

      if (num > 1) {
        return '(' + res.join('+') + ')';
      } else {
        return res.join('+');
      }
    });

    // tslint:disable-next-line: no-eval
    const result = eval(express);
    const str = requestStr + '=' + express + '=' + result;
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
