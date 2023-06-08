input = {
  expenseData: [
    {
      amount: 20,
      startDate: "2020-05-01T00:00:00.000Z",
    },
    {
      amount: 30,
      startDate: "2020-03-01T00:00:00.000Z",
    },
  ],
  revenueData: [
    {
      amount: 60,
      startDate: "2020-03-01T00:00:00.000Z",
    },
    {
      amount: 0,
      startDate: "2020-02-01T00:00:00.000Z",
    },
    {
      amount: 10,
      startDate: "2020-03-01T00:00:00.000Z",
    },
    {
      amount: 40,
      startDate: "2020-01-01T00:00:00.000Z",
    },
  ],
};

// it's a helper function to calculate
function helper(arr) {
  result = [];
  mySet = new Set();

  arr.forEach((x) => {
    sum = 0;
    if (mySet.has(x.startDate)) {
      return;
    }

    mySet.add(x.startDate);
    arr.forEach((y) => {
      if (x.startDate == y.startDate) sum += y.amount;
    });

    temp = { amount: sum, startDate: x.startDate };
    result.push(temp);
  });

  return result;
}

function getMonthNumber(monthString) {
  const month = monthString.toLowerCase();

  switch (month) {
    case "january":
      return 1;
    case "february":
      return 2;
    case "march":
      return 3;
    case "april":
      return 4;
    case "may":
      return 5;
    case "june":
      return 6;
    case "july":
      return 7;
    case "august":
      return 8;
    case "september":
      return 9;
    case "october":
      return 10;
    case "november":
      return 11;
    case "december":
      return 12;
    default:
      return -1; // Indicate invalid month
  }
}

// to seprate Month And Year From given ISO timestamp String
const generateMonthAndYearFromString = (string) => {
  const date = new Date(string);

  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  return [month, year];
};

// to generate year list
function generateYears(startYear, endYear) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }

  return years;
}

// to generate dateString from the year, date
function generateDateString(year, month, date) {
  const generatedDate = new Date(year, month, date);
  const formattedDateString = `${generatedDate.getFullYear()}-${(
    generatedDate.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}-${generatedDate
    .getDate()
    .toString()
    .padStart(2, "0")}T00:00:00.000Z`;
  return formattedDateString;
}

// to generate what are the month not present in between start and end date of startdate
function generateRemaining(sortedResult, presentDates) {
  const startYearString = sortedResult[0].startDate;
  const endYearString = sortedResult[sortedResult.length - 1].startDate;

  const [monthStart, yearStart] =
    generateMonthAndYearFromString(startYearString);
  const [monthEnd, yearEnd] = generateMonthAndYearFromString(endYearString);

  const yearsList = generateYears(yearStart, yearEnd);

  monthStartNum = getMonthNumber(monthStart);
  monthEndNum = getMonthNumber(monthEnd);

  result = [];

  yearsList.forEach((year) => {
    isEnd = 0;

    for (var i = 0; i < 12; i++) {
      str = generateDateString(year, i, 1);

      if (year == yearStart && monthStartNum > i) continue;

      if (presentDates.has(str)) continue;

      if (year == yearEnd && i == monthEndNum) {
        isEnd = 1;
        break;
      }

      result.push({ amount: 0, startDate: str });
    }

    if (isEnd == 1) return;
  });

  return result;
}

// the solve function is the main function to solve this problem
function solve() {
  // expenses and revenue are array containing sum of all the instalments for particular date for expense and revenue respectively
  expenses = helper(input.expenseData);
  revenue = helper(input.revenueData);

  mySet = new Set();
  var result = { balance: [] };

  // calculate result by iterating over expenses and revenue and checking if both have same startdate
  expenses.forEach((x) => {
    sum = 0;
    revenue.forEach((y) => {
      if (x.startDate == y.startDate) sum += y.amount;
    });

    sum -= x.amount;
    mySet.add(x.startDate);

    temp = { amount: sum, startDate: x.startDate };
    result.balance.push(temp);
  });

  revenue.forEach((x) => {
    if (!mySet.has(x.startDate)) result.balance.push(x);
  });

  sortedResult = result.balance.sort((p1, p2) =>
    p1.startDate > p2.startDate ? 1 : p1.startDate < p2.startDate ? -1 : 0
  );

  presentDates = new Set();

  sortedResult.forEach((x) => {
    presentDates.add(x.startDate);
  });

  remainingResult = generateRemaining(sortedResult, presentDates);
  myResult = sortedResult.concat(remainingResult);

  myResult.sort((p1, p2) =>
    p1.startDate > p2.startDate ? 1 : p1.startDate < p2.startDate ? -1 : 0
  );

  ans = { balance: myResult };

  // final balance sheet sorted in ascending order by timestamp.
  console.log(ans);
}

solve();
