function getSchoolData(school, grade, classNum) {
  const sheet = SpreadsheetApp.openById("11BWInDVYX7HdKveBfFd6soZarIR7s3awGxvDlP-8bBc")
    .getSheetByName("카드정보");
  const data = sheet.getDataRange().getValues();

  const result = data
    .filter(row => {
      if (String(row[0]).trim() !== String(school).trim()) return false;
      if (grade && String(row[1]).substring(0, 1) !== grade) return false;
      if (classNum && String(row[1]).substring(1, 2) !== classNum) return false;
      return true;
    })
    .map(row => {
      const id = String(row[1]);
      return {
        grade: id.substring(0, 1),
        class: id.substring(1, 2),
        number: id.substring(2),
        name: row[2],
        stage: row[4],
        title: row[5],
        content: row[6],
        time: row[7]
      };
    });

  return result.sort((a, b) => {
    if (a.grade !== b.grade) return a.grade.localeCompare(b.grade);
    if (a.class !== b.class) return a.class.localeCompare(b.class);
    return a.number.localeCompare(b.number);
  });
}

function doGet(e) {
  const page = e && e.parameter && e.parameter.page;
  const type = e && e.parameter && e.parameter.type;

  if (type === "admin" && e.parameter.school) {
    return ContentService
      .createTextOutput(JSON.stringify(getSchoolData(e.parameter.school, e.parameter.grade, e.parameter.class)))
      .setMimeType(ContentService.MimeType.JSON);
  }

  if (page === "login") return HtmlService.createHtmlOutputFromFile("login");
  if (page === "activity") return HtmlService.createHtmlOutputFromFile("activity");
  if (page === "mypage") return HtmlService.createHtmlOutputFromFile("mypage");
  if (page === "admin") return HtmlService.createHtmlOutputFromFile("admin");

  return HtmlService.createHtmlOutput("잘못된 접근입니다.");
}
