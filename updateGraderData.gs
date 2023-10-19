// const CHECKINSHEET = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('TestGraderData') //Using test sheet for now
const GRADERTRACKINGSS = SpreadsheetApp.openById('1tN90iK8k9Snd_zZm7QpyiNM5_oddc1SNwrqkQLk0hyU')

// MAIN function that runs the show
function updateGraderCheckinData() {
  // updateGraders()
  const months = getMonths(findNewestDataSheetMonth())  // An array of the most recent 6 months MONYEAR that have data sheets in Grader Tracking
  Logger.log(months)
  let graders = createGraderArr()  //An array of objects of all Graders. Instantiates totalRatings array and monthlyRatings object for each grader

  months.forEach((month, idx) => {
    setMonthHeadings(month, idx) // Prints month headings in sheet
    getRating(month, graders, idx)
    getGradingTotals(month, graders)
  })

  const rows = []
  graders.forEach((grader) => {
    rows.push(buildRow(grader, months))
  })
  
  CHECKINSHEET.getRange(3, findColumnNumber(CHECKINSHEET, 'Graders'), CHECKINSHEET.getLastRow(), CHECKINSHEET.getLastColumn()).clear()
  rows.forEach((row, idx) => {
    CHECKINSHEET.getRange(idx+3, 1).setRichTextValue(row[0])
    CHECKINSHEET.getRange(idx+3, 2).setValue(row[1])
    row[2] ? CHECKINSHEET.getRange(idx+3, 3).setRichTextValue(row[2]): CHECKINSHEET.getRange(idx+3, 3).setValue('')
    CHECKINSHEET.getRange(idx+3, 4, 1, row.length-3).setValues([row.slice(3)])
  })
}


function setMonthHeadings(month, idx) {
    let date = new Date(`2000-${month.slice(0,3)}-01`)
    CHECKINSHEET.getRange(1, 20+6*idx).setValue(date.toLocaleDateString(undefined, { month: 'long' }))
}


function buildRow(grader, months) {
  const graderRow = findRowByUsername(grader.username)
  const checkInData = getCheckInData(graderRow)
  const sixMonthAverageRating = getRatingAverage(grader.totalRatings)
  const totalRatings = grader.totalRatings.reduce((sum, curr) => sum + curr, 0)
  const averageGrading = grader.totalgradingTime/grader.totalgrading ? grader.totalgradingTime/grader.totalgrading : 0
  const averageReleasing = grader.totalreleasingTime/grader.totalreleasing ? grader.totalreleasingTime/grader.totalreleasing : 0

  let row = [grader.usernameRichText,...checkInData,
  sixMonthAverageRating, totalRatings, averageGrading, averageReleasing, grader.totalgrading, grader.totalreleasing, 
  0, 0, 0, 0, 0, 0] //Place holder for averages since last check in
  months.forEach((month) => {
    row = [...row, grader.monthlyRatings[`${month}averageRtg`], grader.monthlyRatings[`${month}ratings`].reduce((sum, curr) => sum + curr, 0), 
    grader[`${month}gradingTime`], grader[`${month}releasingTime`], grader[`${month}gradingSubmissions`], grader[`${month}releasingSubmissions`]]
  })
  return row
}


// Returns the row of the grader in the Check-In Sheet (GraderData)
// May need to defend against not finding grader
function findRowByUsername(username) {
  // const graders = CHECKINSHEET.getRange(3, 1, getLastRow(1, CHECKINSHEET)-2).getDisplayValues()
  const realGraderSheet =  SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
  const graders = realGraderSheet.getRange(3, 1, getLastRow(1, realGraderSheet)-2).getDisplayValues()
  return graders.findIndex((grader) => grader[0] === username) + 3
}


// Returns an array of CheckIn Data (Date, Reviewer, Next, #) as RichText
function getCheckInData(row) {
  if (row === 2) {
    return [,,,]
  }
  const realGraderSheet =  SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
  const gradeRelease = realGraderSheet.getRange(row, 2).getDisplayValue()

  const dateCell = realGraderSheet.getRange(row, 3)
  const hyperlink = dateCell.getRichTextValue().getLinkUrl()
  const date = SpreadsheetApp.newRichTextValue().setText(dateCell.getDisplayValue()).setLinkUrl(hyperlink).build()

  const data = realGraderSheet.getRange(row, 4, 1, 4).getDisplayValues()
  // const gradeRelease = CHECKINSHEET.getRange(row, 2).getDisplayValue()
  // const date = CHECKINSHEET.getRange(row, 3).getDisplayValue()
  // const data = CHECKINSHEET.getRange(row, 4, 1, 4).getDisplayValues()

  return [gradeRelease, date, ...data[0]]
}


// Returns an array of 6 months beginning with start: an integer from 0 to 11
function getMonths(start) {
  const today = new Date()
  const monthArr = []
  let monthAsNum = start + 1 // Loop subtracts 1 first interation, thus the +1 on initialization

  for (let i = 0; i < 6; i++) {
    var year = today.getFullYear()
    monthAsNum -= 1
    if (monthAsNum < 0) {
      monthAsNum += 12
      year -= 1
    }
    today.setMonth(monthAsNum)
    monthArr.push(`${today.toLocaleString('en-US', { month: 'short' })}${year}`)
  }
  return monthArr
}


// Returns the month (as an integer from 0 to 11) of most recent month with a data sheet
function findNewestDataSheetMonth() {
  const sheets = GRADERTRACKINGSS.getSheets()
  const sheetNames = sheets.map((sheet) => sheet.getName())
  let today = new Date()
  let month = today.toLocaleDateString('en-US', { month: 'short'}).toLowerCase()
  let year = today.getFullYear()
  let newest = null

  while (!newest) {
    newest = sheetNames.find((sheet) => sheet.slice(0,3).toLowerCase() === month && parseInt(sheet.slice(-4)) === year)
    if (!newest) {
      if (today.getMonth() === 0) {
        year -= 1
      }
      today.setMonth(today.getMonth() - 1)
      month = today.toLocaleDateString('en-US', { month: 'short'}).toLowerCase()
    } else {
      return today.getMonth()
    }
  }
}


// Updates grader objects in graderArr by username with ratings [#1's, #2's, #3's, #4's, #5's] for given month
function getRating(month, graderArr, idx) {
  const sheet = GRADERTRACKINGSS.getSheetByName(month)
  const sheetData = sheet.getRange(2, 2, sheet.getLastRow()-1, 7).getDisplayValues() //[Grader, Releaser, CourseID, Course Name, Problem #, Graded, Rating]
  let ratingArr

  // Loop through MONYEAR sheet in grader tracking, find the grader object, add a rating array to track 1s, 2s, 3s, 4s, 5s, and update array for given rating
  sheetData.forEach((row) => {
    let grader = graderArr.find(grader => grader.username === row[0])
    // Checking if the grader is in the graderArr and if they already have data for the month
    // Each month adds 2 keys to the monthlyRatings object. idx is the month iteration (0-5).
    // Thus, idx * 2 is the number of keys a grader should have for the current iteration. If not, we need to add the rating array.
    if (grader && Object.keys(grader.monthlyRatings).length === idx * 2) { 
      ratingArr = [0,0,0,0,0]
      ratingArr[row[6]-1] += 1
      grader.monthlyRatings[`${month}ratings`] =  ratingArr
      grader.totalRatings[row[6]-1] += 1
    } else if (grader) {
      grader.monthlyRatings[`${month}ratings`][row[6]-1] += 1
      grader.totalRatings[row[6]-1] += 1
    }
  })

  // Go through all graders and add empty ratings to those that didn't have any
  // Then calculate month average
  graderArr.forEach((grader) => {
    if (Object.keys(grader.monthlyRatings).length === idx * 2) {
      grader.monthlyRatings[`${month}ratings`] = [0,0,0,0,0]
    }
    let ratingData = getRatingAverage(grader.monthlyRatings[`${month}ratings`])
    grader.monthlyRatings[`${month}averageRtg`] = ratingData
  })
  return graderArr
}


// Called by getRating
// Returns weighted average rating for the month
function getRatingAverage(ratings) {
  const numMultiplier = [10, 14, 9, 4, 5] // weighting 1s as 10pts, 2s as 7pts, 3s as 3pts, 4s and 5s as 1pt
  const denMultiplier = [10, 7, 3, 1, 1]
  const numValues = arrMultiplier(ratings, numMultiplier)
  const denValues = arrMultiplier(ratings, denMultiplier)

  const averageRtg = numValues.reduce((acc, curr) => acc + curr)/denValues.reduce((acc, curr) => acc + curr)

  if (isNaN(averageRtg)) { // Put in 0's for those with no grading
    return 0
  }
  return averageRtg
}


// Helper function used by getRatingAverage to multiply array for weighted average
function arrMultiplier(arr1, arr2) {
  result = []

  for (let i = 0; i < arr1.length; i++) {
    result.push(arr1[i] * arr2[i])
  }
  return result
}


// Called by MAIN function. 
// Returns an array of objects for each grader that is 'Y' in Contractors Universal
function createGraderArr() {
  // const graders = getGraders()
  const graders = makeGraderLinks()
  const graderArr = []

  graders.forEach((grader) => {
    graderArr.push({username: grader[0].getText(), usernameRichText: grader[0], monthlyRatings: {}, totalRatings: [0,0,0,0,0]})
  })
  return graderArr
}


// Helper function to get the last row for a given column
function getLastRow(col, sheet) {
  let lastRow;
  const colVals = sheet.getRange(1, col, sheet.getLastRow()).getDisplayValues();
  colVals.forEach((val, idx) => {
    if (val[0].length > 0) {
      lastRow = idx + 1
    }
  })
  return lastRow;
}


// Called by MAIN function for each month in month array
// Updates grader objects with number of submissions graded/released and average time per task for given month.
// Keeps a running total of time billed per task and submissions graded
function getGradingTotals(month, graderArr) {
  const sheet = GRADERTRACKINGSS.getSheetByName(month);
  const lastRow = getLastRow(11, sheet); // Ensures we get only the rows for the data we want as left side of sheet has more rows
  const sheetData = sheet.getRange(2, 11, lastRow, 6).getDisplayValues(); //[Username, Task, #Submissions, PayRatePerSub, TotalTime, AverageTimePerTask]

  sheetData.forEach((row) => {
    let grader = graderArr.find((grader) => grader.username === row[0]);
    if (grader) {
      grader[`${month}${row[1].toLowerCase()}Submissions`] = row[2];
      grader[`${month}${row[1].toLowerCase()}Time`] = row[5];

      // Set up total time and total graded keys if they don't exist
      if (grader[`total${row[1].toLowerCase()}Time`] === undefined || grader[`total${row[1].toLowerCase()}`] === undefined) {
        grader[`total${row[1].toLowerCase()}Time`] = 0
        grader[`total${row[1].toLowerCase()}`] = 0
      }
      grader[`total${row[1].toLowerCase()}Time`] += parseInt(row[4]);
      grader[`total${row[1].toLowerCase()}`] += parseInt(row[2])
    }
  });
  return graderArr;
}