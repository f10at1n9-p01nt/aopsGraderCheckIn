//This addresses some initialization problem that I still don't understand.
/**
* @type {FormApp.Form}
*/
var form
/**
* @type {SpreadsheetApp.Sheet}
*/
var sheet


//loads ops data
function loadOpsData() {
   form = FormApp.openById('1eFkhQjHxgu5wR9g6DCXQCDM8EUU4vh69OfWmJ3LJk2Q')
   sheet = SpreadsheetApp.openById('1P6zePMqCGSBxmLiv3sgIidoTKOF61vTV6-wXX5t_psg').getSheetByName('GraderData')
}


//loads testing data
function loadTestData() {
  form = FormApp.openById('1hzKtf2JqItoCy6EF8AA3R1yE6ROQw7d52pr17a5eraM')
  sheet = SpreadsheetApp.openById('16ULr8qHyQ0uceIqgZ7rnSqvCqOTMHoOanT988ti3RKs').getSheetByName('GraderData')
}


//This finds column headers by number
function findColumnNumber (sheet, columnName) {

  const columnHeaders = sheet.getRange(1, 1, 2, sheet.getLastColumn()).getDisplayValues()
  if (columnHeaders[0].includes(columnName)) {
    return columnHeaders[0].indexOf(columnName) + 1
  } else if(columnHeaders[1].includes(columnName)) {
    return columnHeaders[1].indexOf(columnName) + 1
  } else {
    throw(new Error(`Column "${columnName}" not found.`))
  }
}

function nextUpdate (cuberating) {

  const today = new Date()
  const yyyy = today.getFullYear();
  let mm = (today.getMonth() + 1 + Number(cuberating)) % 12; // Months start at 0!
  let dd = today.getDate();
  return mm + '/'  + dd + '/' + yyyy

}

//This updates the next and last check-in columns based on the form
function updateCheckIns() {

  loadOpsData()     //this loads the goods  

//Format the date correctly
const date = new Date();
const yyyy = date.getFullYear();
let mm = date.getMonth() + 1; // Months start at 0!
let dd = date.getDate();
const formattedToday = mm + '/' + dd + '/' + yyyy


//initialization party
  const formResponses = form.getResponses() ;                   
  const latestResponse = formResponses[formResponses.length - 1]
  const usernameItem = form.getItems()[0]
  const cuberating = latestResponse.getResponseForItem(form.getItems()[4]).getResponse()
  const username = latestResponse.getResponseForItem(usernameItem).getResponse()
  const frontLinkItem = form.getItems()[5]
  const linkResponse = latestResponse.getResponseForItem(frontLinkItem).getResponse()
  const data = sheet.getDataRange().getValues()
  const gradersCol = findColumnNumber(sheet,"Graders") - 1;
  var dateLink = SpreadsheetApp.newRichTextValue().setText(formattedToday).setLinkUrl(`${linkResponse}`).build()
  var numMatchingUsers = 0
  var userMatchIdx 
  var nextDate = new Date();
  nextDate.setMonth(nextDate.getMonth() + 3)



//Loop through the columns in the grader row and count how many matches we have and where they are up to case.
  for (i = 0; i<data.length; i++) {
    if (data[i][gradersCol].toLowerCase() === username.toLowerCase()) {
      numMatchingUsers++  
      userMatchIdx = i
    }
  }


//Throw errors if the username is bogus or there is capitalization nonsense
  if (numMatchingUsers == 0){
    throw(new Error(`No users found with name ${username}`))
  }

  if (numMatchingUsers > 1){
    throw(new Error(`Multiple instances of ${username} found.`))
  }


  const nxt = nextUpdate(cuberating)

  //This is the case where numMatchingUsers == 1 so we do the stuff:
  sheet.getRange(userMatchIdx + 1, findColumnNumber(sheet, 'Date')).setRichTextValue(dateLink)
  sheet.getRange(userMatchIdx + 1, findColumnNumber(sheet, 'Next')).setValue(nxt)
 

  
  //This is replaced with a number representing urgency
  //sheet.getRange(userMatchIdx + 1, findColumnNumber(sheet, 'Next')).setValue(nextDate)
  


}
