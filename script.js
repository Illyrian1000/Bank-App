"use strict";

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: "Jonas Schmedtmann",
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: "Jessica Davis",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: "Steven Thomas Williams",
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector(".welcome");
const labelDate = document.querySelector(".date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");

const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");

const displayMovements = function (movements) {
  containerMovements.innerHTML = "";
  movements.forEach(function (mov, i) {
    const type = mov > 0 ? "deposit" : "withdrawal";
    const html = `<div class="movements__row">
    <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
    <div class="movements__date">3 days ago</div>
    <div class="movements__value">${mov}</div>
  </div>`;

    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

const calcDisplayBalance = function (account) {
  const balance = account.movements.reduce((acc, cur) => acc + cur, 0);
  labelBalance.textContent = `${balance} EUR`;
};

const displayIn = function (movements) {
  const positive = movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumIn.textContent = `${positive}€`;

  const negative = movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov, 0);
  labelSumOut.textContent = `${negative}€`;

  const interests = movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * currentAccount.interestRate) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, int) => acc + int, 0);

  labelSumInterest.textContent = `${interests.toFixed(2)}€`;
};

const createUsernames = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map(name => name[0])
      .join("");
  });
};

createUsernames(accounts);

const updateUI = function (currentAccount) {
  displayMovements(currentAccount.movements);

  // Display balance

  calcDisplayBalance(currentAccount);

  // Display summary

  displayIn(currentAccount.movements);
};

let currentAccount;

btnLogin.addEventListener("click", function (e) {
  //Prevent form for submiting
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message

    inputLoginPin.value = inputLoginUsername.value = "";
    inputLoginPin.blur();
    inputLoginUsername.blur();

    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(" ")[0]
    }`;

    containerApp.style.display = "grid";

    // Display movements

    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener("click", function (e) {
  e.preventDefault();

  console.log(`button clicked`);

  const balanceNow = currentAccount.movements.reduce(
    (acc, cur) => acc + cur,
    0
  );

  const amount = Number(inputTransferAmount.value);
  const receiver = accounts.find(acc => acc.username === inputTransferTo.value);

  if (amount > 0 && balanceNow >= amount) {
    currentAccount.movements.push(amount * -1);
    receiver.movements.push(amount);

    console.log(`money sent`);
  }
  updateUI(currentAccount);
});

/////////////////////////////////////////////////
// username list with the 2 letters
// let firstLetters = [];

// for (let i = 0; i < accounts.length; i++) {
//   let words = accounts[i].owner.split(" ");
//   let firstLetter = "";
//   for (let u = 0; u < words.length; u++) {
//     firstLetter += words[u][0].toLowerCase();
//   }
//   firstLetters.push(firstLetter);
// }
// console.log(firstLetters);

/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array 
(one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, 
and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of 
Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or 
a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀


const testOneOne = [3, 5, 2, 12, 7];
const testOneTwo = [4, 1, 15, 8, 3];
const testTwoOne = [9, 16, 6, 8, 3];
const testTwoTwo = [10, 5, 6, 1, 4];

const checkDogs = function (firstArray, secondArray) {
  let noCatsArr = [...firstArray];
  noCatsArr.pop();
  noCatsArr.pop();
  noCatsArr.shift();
  let allInfo = noCatsArr.concat(secondArray);
  console.log(allInfo);

  for (let i = 0; i < allInfo.length; i++) {
    let x =
      allInfo[i] > 2
        ? `Dog number ${i + 1} is an adult, and is ${allInfo[i]} year old`
        : `Dog number ${i + 1} is still a puppy🐶`;
    console.log(x);
  }
};

checkDogs(testTwoOne, testTwoTwo);


let toUsd = 1.1;

const testMov = [10, 20, 22, 89, 56];

// const testCopy = testMov.map(function (mov) {
//   return mov * toUsd;
// });

const testCopy = testMov.map(mov => Math.trunc(mov * toUsd));

console.log(testCopy);

*/

/*
console.log(accounts);

const deposits = movements.filter(function (mov) {
  return mov > 0;
});

console.log(movements);
console.log(deposits);

const depostiFor = [];

for (const mov of movements) if (mov > 0) depostiFor.push(mov);
console.log(depostiFor);

const withdrawalFor = movements.filter(function (mov) {
  return mov < 0;
});

console.log(withdrawalFor);

const testNegative = [];
for (const negative of movements) if (negative < 0) testNegative.push(negative);

console.log(testNegative);


const account4 = {
  owner: "Sarah Smith",
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};


[200, 450, -400, 3000, -650, -130, 70, 1300]
const maxValueTest = movements.reduce((acc, value) => {
  if (acc < value) {
    acc = value;
  }
  return acc;
}, movements[0]);

console.log(maxValueTest);

Let's go back to Julia and Kate's study about dogs. This time, they want to
 convert dog ages to human ages and calculate the average age of the dogs in
  their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages
 ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog
 is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old,
  humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same
   as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already
   know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets



const arrAge1 = [5, 2, 4, 1, 15, 8, 3];
const arrAge2 = [16, 6, 10, 5, 6, 1, 4];
//maximum value of the movements array

const calcAverageHumanAge = function (arr) {
  const humanAge = arr.map(x => (x <= 2 ? x * 2 : 16 + x * 4));
  console.log(humanAge);

  const min18 = humanAge.filter(age => age >= 18);
  console.log(min18);

  const avgAge = min18.reduce(
    (acc, curr, i, arr) => acc + curr / arr.length,
    0
  );

  return avgAge;
};

// new compressed
const calcAverageHumanAge = function (arr) {
  const humanAge = arr
    .map(x => (x <= 2 ? x * 2 : 16 + x * 4))
    .filter(age => age >= 18)
    .reduce((acc, curr, i, arr) => acc + curr / arr.length, 0);

  return humanAge;
};


console.log(calcAverageHumanAge(arrAge1));
console.log(calcAverageHumanAge(arrAge2));


const firtWithdrawl = movements.find(mov => mov < 0);

console.log(movements.indexOf(firtWithdrawl) + 1);


const account = accounts.find(acc => acc.owner === "Jessica Davis");
console.log(account);
account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);

console.log(account.balance);



// const account = accounts.find(acc => acc.owner === "Jessica Davis");
*/
