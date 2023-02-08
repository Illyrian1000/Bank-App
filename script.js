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

const displayMovements = function (movements, sort) {
  containerMovements.innerHTML = "";

  const movs = sort ? movements.slice().sort((a, b) => a - b) : movements;
  movs.forEach(function (mov, i) {
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
    containerApp.style.opacity = 100;

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

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  const loanAmount = Number(inputLoanAmount.value);
  const loanApprove = currentAccount.movements.some(
    acc => acc >= loanAmount * 0.1
  );
  if (loanAmount > 0 && loanApprove) {
    currentAccount.movements.push(Number(loanAmount));
  }

  updateUI(currentAccount);
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    currentAccount.username === inputCloseUsername.value &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const number = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );
    accounts.splice(number, 1);
    containerApp.style.display = "none";
    containerApp.style.opacity = 0;
    inputCloseUsername.value = inputClosePin.value = "";
  }
});

let sorted = false;

btnSort.addEventListener("click", function (e) {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount.movements, sorted);
});

// const z = Array.from(
//   { length: 100 },
//   (arr, i) => Math.floor(Math.random() * 6) + 1
// );

// // console.log(z);
// // 1
// const bankDepositsSum = accounts
//   .map(arr => arr.movements)
//   .flat()
//   .filter(arr => arr > 0)
//   .reduce((acc, i) => acc + i, 0);

// console.log(bankDepositsSum);

// // 2
// const numDeposits1000 = accounts
//   .map(arr => arr.movements)
//   .flat()
//   .reduce((count, cur) => (cur >= 1000 ? count + 1 : count), 0);

// console.log(numDeposits1000);

// // 3
// const sums = accounts
//   .map(arr => arr.movements)
//   .flat()
//   .reduce(
//     (acc, cur) => {
//       cur > 0 ? (acc.deposits += cur) : (acc.withdrawls += cur);
//       return acc;
//     },
//     { deposits: 0, withdrawls: 0 }
//   );

// console.log(sums);

// 4
// this is a nice title

// const convertTitleCase = function (string) {
//   const words = string.toLowerCase().split(" ");

//   const sentence = [];

//   words.forEach(item => {
//     item = item.charAt(0).toUpperCase() + item.slice(1);
//     sentence.push(item);
//   });

//   return sentence.join(" ");
// };

// console.log(
//   convertTitleCase("this is a test and i am trying to make sure that it works")
// );
/*
Julia and Kate are still studying dogs, and this time they are studying if dogs
 are eating too much or too little.
Eating too much means the dog's current food portion is larger than the 
recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range
 10% above and 10% below the recommended portion (see hint).

1. Loop over the array containing dog objects, and for each dog, calculate the
 recommended food portion and add it to the object as a new property. Do NOT 
 create a new array, simply loop over the array. 
 Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, 
  and the weight needs to be in kg)

2. Find Sarah's dog and log to the console whether it's eating too much or too
little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the 
owners array, and so this one is a bit tricky (on purpose) 🤓

3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') 
and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

4. Log a string to the console for each array created in 3., like this: "Matilda and
 Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too 
 little!"

 5. Log to the console whether there is any dog eating EXACTLY the amount of food
 that is recommended (just true or false)

 6. Log to the console whether there is any dog eating an OKAY amount of food 
(just true or false)

7. Create an array containing the dogs that are eating an OKAY amount of food 
(try to reuse the condition used in 6.)

8. Create a shallow copy of the dogs array and sort it by recommended food 
portion in an ascending order (keep in mind that the portions are inside the
   array's objects)

   HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:
const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
  { weight: 32, curFood: 340, owners: ['Michael'] }
];

*/

const dogs = [
  { weight: 22, curFood: 250, owners: ["Alice", "Bob"] },
  { weight: 8, curFood: 200, owners: ["Matilda"] },
  { weight: 13, curFood: 275, owners: ["Sarah", "John"] },
  { weight: 32, curFood: 340, owners: ["Michael"] },
];

let users = [];

dogs.forEach(dog => {
  users.push(dog.owners);
  users = users.flat();
});

// recommendedFood = weight ** 0.75 * 28

// 1 - Added the recommendedFood to the object
dogs.forEach(dog => {
  dog.recommendedFood = dog.weight ** 0.75 * 28;
  dog.min = dog.recommendedFood * 0.9;
  dog.max = dog.recommendedFood * 1.1;
});

//8

const dogsCopy = dogs
  .slice()
  .sort((a, b) => a.recommendedFood - b.recommendedFood);

console.log(dogsCopy);
// //2

// const checkDog = function (user) {
//   user.forEach(owner => {
//     dogs.forEach(dog => {
//       if (dog.owners.includes(owner)) {
//         if (dog.curFood >= dog.min && dog.curFood <= dog.max) {
//           console.log(`${owner}'s dog is eating the right amount`);
//         } else if (dog.curFood >= dog.max) {
//           console.log(
//             `Eating to much ${
//               dog.curFood
//             }. The recommended amount is ${Math.floor(dog.recommendedFood)}`
//           );
//         } else {
//           console.log(
//             `Eating to little ${
//               dog.curFood
//             }. The recommended amount is ${Math.floor(dog.recommendedFood)}`
//           );
//         }
//       }
//     });
//   });
// };

// checkDog(users);

// //3
// const ownersEatTooLittle = [];
// const ownersEatTooMuch = [];

// const owners = function (dogs) {
//   users.flat().forEach(user => {
//     dogs.forEach(dog => {
//       if (dog.owners.includes(user)) {
//         if (dog.curFood > dog.max) {
//           ownersEatTooMuch.push(user);
//         } else if (dog.curFood < dog.min) {
//           ownersEatTooMuch.push(user);
//         }
//       }
//     });
//   });

//   console.log(`To Little: ${ownersEatTooLittle}`);
//   console.log(`To Much: ${ownersEatTooMuch}`);
// };

// owners(dogs);

// const toMuchUsers = function () {
//   const printUsers = ownersEatTooMuch.slice();
//   const lastUser = printUsers.slice(printUsers.length - 1);
//   printUsers.pop();
//   printUsers.push("and");
//   printUsers.push(lastUser);

//   console.log(`The dogs of ${printUsers.join(", ")} eat to much`);
// };

// toMuchUsers();
