function onEdit() {


  // Open the event calendar
  var spreadsheet = SpreadsheetApp.getActiveSheet();
  var calendarId = spreadsheet.getRange("Sheet2!A2").getValue();
  var eventCal = CalendarApp.getCalendarById(calendarId);

  // Added: get active row (trigger starts the script on update of a cell)
  var currRow = spreadsheet.getActiveCell().getRow();
  

  // Pull info from sheet up to row 274

  var lectureDateTimes = spreadsheet.getRange(getShortRangeFromRowAndColumns(currRow, "A", "B")).getValues();
  var lectureNames = spreadsheet.getRange(getShortRangeFromRowAndColumns(currRow, "G", "G")).getValues();
  var lectureNotes = spreadsheet.getRange(getShortRangeFromRowAndColumns(currRow, "I", "I")).getValues();
  var lectureRooms = spreadsheet.getRange(getShortRangeFromRowAndColumns(currRow, "J", "J")).getValues();

  // Create events

  for(x=0; x<lectureDateTimes.length; x++) {
    var lectureDateTime = lectureDateTimes[x];
    var lectureName = lectureNames[x];
    var lectureNote = lectureNotes[x];
    var lectureRoom = lectureRooms[x];

    var startTime = new Date(lectureDateTime[0]);
    var endTime = new Date(lectureDateTime[1]);

    // Delete events on that datetime to avoid duplicates
    eventCal.getEvents(startTime, endTime).forEach(e => {
      if(e.getTitle().localeCompare(lectureName) == 0){
        e.deleteEvent();
      }
    });
    var event = eventCal.createEvent(lectureName, startTime, endTime);
    event.setDescription(lectureNote);
    event.setLocation(lectureRoom);
  }

}

function getShortRangeFromRowAndColumns(row, column1, column2) {
  var startRow = Math.max(2, row);
  var endRow = row + 13;

  var rangeString = column1 + startRow + ":" + column2 + endRow;
  Logger.log(rangeString);
  return rangeString;
}
