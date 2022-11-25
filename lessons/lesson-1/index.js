/* eslint-disable no-console */
import colors from 'colors';

function lesson1() {
  const args = process.argv.splice(2).map((num) => parseInt(num, 10));

  const colorMap = new Map([
    [1, (prime) => colors.green(prime)],
    [2, (prime) => colors.yellow(prime)],
    [3, (prime) => colors.red(prime)],
  ]);

  function validateArgs(arg1, arg2) {
    return arg1 >= 0 && arg2 > 0 && arg1 < arg2;
  }

  function isPrime(num) {
    if (num < 2) return false;
    for (let i = 2; i <= Math.sqrt(num); i += 1) {
      if (num % i === 0) return false;
    }
    return true;
  }

  function colorPrime(prime, color) {
    const colorAction = colorMap.get(color);
    return colorAction ? colorAction(prime) : prime;
  }

  function searchPrimes(arg1, arg2) {
    let color = 0;
    for (let current = arg1; current <= arg2; current += 1) {
      if (isPrime(current)) {
        color = (color === 3) ? 1 : color + 1;
        console.log(colorPrime(current, color));
      }
    }
    if (color === 0) console.log(colors.red('No primes in diapason'));
  }

  if (!validateArgs(...args)) {
    console.log(colors.red('Incorrect numbers'));
  } else {
    searchPrimes(...args);
  }
}

export default lesson1;
