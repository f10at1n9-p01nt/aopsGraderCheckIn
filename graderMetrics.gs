function fetchWebPage(url) {
  let response = UrlFetchApp.fetch(url)
  let content = response.getContentText()
  return content
}


function scrapeWebPage() {
  let url = 'https://artofproblemsolving.com/admin?module=Common&id=moneta&sql_id=contractor_grader_costs&first_date=2023-5-1&last_date=2023-5-31'
  let html = fetchWebPage(url)

  Logger.log(html)
}