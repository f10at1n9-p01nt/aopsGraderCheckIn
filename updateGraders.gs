// Global Variables
const CHECKINSHEET = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('TestGraderData') //Using test sheet for now
const CONTRACTORSUNIVERAL = SpreadsheetApp.openById('1QFD2-76RIHwd_WEe5HooOKDkggiMuS5gR3iA7mCv8rc').getSheetByName('Master List')

// Returns 2D array of grader usernames from Contractor's Universal - adapted from Grader Tracking
function getGraders() {
  const lastRow = CONTRACTORSUNIVERAL.getLastRow()
  const graderColumn = findColumnNumber(CONTRACTORSUNIVERAL, 'Grade')
  const hqColumn = findColumnNumber(CONTRACTORSUNIVERAL, 'Type')
  const data = CONTRACTORSUNIVERAL.getRange(2, 1, lastRow, graderColumn).getDisplayValues() // User ID is index 0 and Grade index is graderColumn - 1
  const graderUsernames = []

  data.forEach((datum) => {
    if (datum[graderColumn - 1] ==='Y' && datum[hqColumn - 1] !== 'HQ') {
      graderUsernames.push([datum[2]])
    }
  })
  return graderUsernames
}

// Main Function: Updates username column with all graders
function updateGraders() {
  const graderUsernames = makeGraderLinks()
  const allGradersCol = findColumnNumber(CHECKINSHEET, 'Graders')

  CHECKINSHEET.getRange(3, allGradersCol, CHECKINSHEET.getLastRow()).clear()
  CHECKINSHEET.getRange(3, allGradersCol, graderUsernames.length).setRichTextValues(graderUsernames)
}


// Helper function to find column number based on column name
function findColumnNumber (sheet, columnName) {
  const columnHeaders = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getDisplayValues()

  return columnHeaders[0].indexOf(columnName) + 1
}


// Grabs all grader usernames from Contractors Universal and links the username to Grader Admin
function makeGraderLinks() {
  const graders = getGraders()
  const linkedGraders = []

  graders.forEach((grader) => {
    let hyperlink = `https://artofproblemsolving.com/grader/admin.php/${grader[0]}`
    let linkedUsername = SpreadsheetApp.newRichTextValue().setText(grader[0]).setLinkUrl(hyperlink).build()
    linkedGraders.push([linkedUsername])
  })
  return linkedGraders
}