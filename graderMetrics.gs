function fetchWebPage() {
  let url = 'https://artofproblemsolving.com/admin?module=Common&id=moneta&sql_id=contractor_grader_costs&first_date=2023-5-1&last_date=2023-5-31'
  
  let headers = {
    'authority': 'artofproblemsolving.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'authorization': 'Basic YWR2b2NhdGU6cGVyZmVjdGlvbi1UMg==',
    'cache-control': 'max-age=0',
    'cookie': '_fbp=fb.1.1652131906175.328074200; _hjSessionUser_774800=eyJpZCI6IjE2N2NiNzlmLTQyODktNTdlNi1hNjg0LTIxZWYwNzBkMWQ5MyIsImNyZWF0ZWQiOjE2NTIxMzE5MDcxODksImV4aXN0aW5nIjp0cnVlfQ==; _clck=1laih3c|1|f5w|0; _gcl_au=1.1.320760646.1683466030.1182618800.1686070127.1686070126; optimizelyEndUserId=oeu1686595499091r0.32963742954209496; _gid=GA1.2.1816282617.1687709410; auid=595181; alogin=s3k6ie; _gaexp=GAX1.2.tLtkSuDTRfmaTDCm-dS9fg.19566.0!NNm7-3pBTp6TxKs-Pp1iVQ.19573.0!wqSxDxUJQPahq19VESjZnQ.19620.0; _vwo_uuid=DF28A180475826D9B03EB727DCB6AA9FF; _vwo_ds=3%241688003358%3A70.09221212%3A%3A; _vis_opt_s=1%7C; _vis_opt_exp_1_combi=1; aopssid=BGPhz9dyYNLr16880917059226UJwOUe3RTWxB; aopsuid=595181; _vwo_uuid_v2=D3C7110F8DD3DBF3C24472EF13B6E511C|1733dd6de40ab137cf51be2944f3eaf6; _uetsid=c2844cc0137211ee96052768624cc6b5; _uetvid=dcc369e09b3411ed8d7a476935577b50; _ga=GA1.2.1448962543.1674488686; _hjSession_774800=eyJpZCI6ImUyYWI4ZmZjLTQxMmItNDIzMC05MjVkLWI4Y2VjNWY5Yjk2MSIsImNyZWF0ZWQiOjE2ODgwOTE3MjM4OTMsImluU2FtcGxlIjpmYWxzZX0=; _hjAbsoluteSessionInProgress=0; _ga_NVWC1BELMR=GS1.1.1688091723.673.0.1688091727.56.0.0',
    'origin': 'https://artofproblemsolving.com',
    'referer': 'https://artofproblemsolving.com/',
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  }
  let options = { 'headers': headers}

  let response = UrlFetchApp.fetch(url, options)
  let content = response.getContentText()


  Logger.log(content)
}




