'use strict';

// Data
const account1 = {
  owner: 'Mohamed Khedr',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2023-11-18T21:31:17.178Z',
    '2023-12-23T07:42:02.383Z',
    '2023-01-28T09:15:04.904Z',
    '2023-04-01T10:17:24.185Z',
    '2023-05-08T14:11:59.604Z',
    '2023-06-27T17:01:17.194Z',
    '2023-06-30T12:36:17.929Z',
    '2023-07-01T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2023-11-01T13:15:33.035Z',
    '2023-11-30T09:48:16.867Z',
    '2023-12-25T06:04:23.907Z',
    '2023-01-25T14:18:46.235Z',
    '2023-02-05T16:33:06.386Z',
    '2023-04-10T14:43:26.374Z',
    '2023-06-25T18:49:59.371Z',
    '2023-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];

// Variables
let sorted = false;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


// Start Logout Timer
const startLogoutTimer = () => {
  // Time before logout
  let time = 300;

  // calc and display time each sec
  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String((time % 60)).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;

    // logout
    if (time === 0) {
      clearInterval(timer)
      labelWelcome.textContent = 'Log in to get Started';
      containerApp.style.opacity = 0;
    }
    time--;
  }
  // Execute immediately on login
  tick();
  const timer = setInterval(tick, 1000);
  return timer;

}

// Calc Days Passed
function calcDaysPassed(date1, date2) {
  let days = Math.floor(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));
  return days;
}

// Format Date
function formatMovementDate(date) {
  const daysPassed = calcDaysPassed(date, new Date());
  const day = `${date.getDate()}`.padStart(2, 0);
  const month = `${date.getMonth() + 1}`.padStart(2, 0);
  const year = date.getFullYear();

  if (daysPassed === 0) return 'Today'
  else if (daysPassed === 1) return 'Yesterday'
  else if (daysPassed <= 7) return `${daysPassed} days ago`
  else return `${day}/${month}/${year}`
}



// Display Movement Function
const displayMovements = function (acc, sort = false) {
  containerMovements.innerHTML = "";

  const movs = (sort) ? acc.movements.slice().sort((a, b) => a - b) : acc.movements;

  movs.forEach((mov, i) => {
    // Type of Movement
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    // Dates
    const movDate = new Date(acc.movementsDates[i])
    const displayDate = formatMovementDate(movDate)

    const html = `   <div class="movements__row">
                      <div class="movements__type movements__type--${type}">W${i + 1}</div>
                      <div class="movements__date">${displayDate}</div>
                      <div class="movements__value">${mov.toFixed(2)}€</div>
                      </div>`

    containerMovements.insertAdjacentHTML("afterbegin", html)
  })
}




//Display Balance Function
const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((accumulator, elem) => accumulator += elem);
  labelBalance.textContent = `${acc.balance.toFixed(2)} UER`;

}


// Display Summery
const calcDisplaySummery = (acc) => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((acc, mov) => acc + mov);

  const outcomes = acc.movements
    .filter(mov => mov < 0)
    .reduce((acc, mov) => acc + mov);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => deposit * acc.interestRate / 100)
    .filter(int => int > 1)
    .reduce((acc, int) => acc += int)

  labelSumIn.textContent = `${incomes.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(outcomes).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`
}


// Update UI
const updateUI = () => {
  displayMovements(currentAccount);
  calcDisplayBalance(currentAccount);
  calcDisplaySummery(currentAccount);
}

const createUserName = (accs) => {
  accs.forEach(user => {
    // create new property = userName
    user.userName = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  })
}

// Login
let currentAccount, timer
const now = new Date();
const day = `${now.getDate()}`.padStart(2, 0)
const month = `${now.getMonth() + 1}`.padStart(2, 0)
const year = now.getFullYear()
labelDate.textContent = `${day}/${month}/${year}`;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  currentAccount = accounts
    .find(acc => acc.userName === inputLoginUsername.value)

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back 
    ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = '100';


    if (timer) clearInterval(timer);
    timer = startLogoutTimer();
    updateUI();

    // Clear Input Fields
    inputLoginUsername.value = inputLoginPin.value = '';

  } else {
    alert('Wrong')
  }
})

// Transfer
btnTransfer.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAccount = accounts
    .find(acc => acc.userName === inputTransferTo.value);

  if (amount > 0 &&
    receiverAccount &&
    amount <= currentAccount.balance &&
    receiverAccount?.userName !== currentAccount.userName) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

    //  Adding Transfer Date
    currentAccount.movementsDates.push(new Date().toISOString())
    receiverAccount.movementsDates.push(new Date().toISOString())
    updateUI();
  } else {
    alert('Invalid Transfer');
  }

  inputTransferAmount.value = inputTransferTo.value = '';

  // Reset Timer
  clearInterval(timer);
  timer = startLogoutTimer();
})

// Request Loan
btnLoan.addEventListener('click', (e) => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 &&
    currentAccount.movements.some(mov => mov >= amount / 10)) {
    currentAccount.movements.push(amount);
    // Adding loan date
    currentAccount.movementsDates.push(new Date().toISOString())

    updateUI();
    inputLoanAmount.value = '';

    // Reset Timer
    clearInterval(timer);
    timer = startLogoutTimer();
  }
})

// Close Account
btnClose.addEventListener('click', (e) => {
  e.preventDefault();
  if (inputCloseUsername.value === currentAccount.userName &&
    Number(inputClosePin.value) === currentAccount.pin) {
    const DeletedAccIndex = accounts
      .findIndex(acc => acc.userName === currentAccount.userName);

    // Delete Account
    accounts.splice(DeletedAccIndex, 1)

    // Hide UI
    containerApp.style.opacity = '0';

  } else {
    console.log('error')
  }

  inputCloseUsername.value = inputClosePin.value = '';

})




// Sort Movements
btnSort.addEventListener('click', (e) => {
  e.preventDefault();
  sorted = !sorted;
  displayMovements(currentAccount, sorted);
})




// Function Calls
createUserName(accounts.slice())

