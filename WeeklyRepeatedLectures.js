function main() {


  // Open the event calendar
  var spreadsheet = SpreadsheetApp.getActiveSheet();
  var calendarId = spreadsheet.getRange("Sheet2!A5").getValue();
  var eventCal = CalendarApp.getCalendarById(calendarId);

  // Added: get active row (trigger starts the script on update of a cell)
  var currRow = spreadsheet.getActiveCell().getRow();
  var currCol = spreadsheet.getActiveCell().getColumn();
  //if (currRow != "2" || currCol !="L") return; // only run script if cell L2 is modified
  

  // Pull info from sheet up to row 274

  var lectureDateTimes = spreadsheet.getRange("A2:B12").getValues();
  var lectureNames = spreadsheet.getRange("G2:G12").getValues();
  var lectureNotes = spreadsheet.getRange("I2:I12").getValues();
  var lectureRooms = spreadsheet.getRange("J2:J12").getValues();

  Logger.log(lectureNames);

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

    var weeklyRecurrence = CalendarApp.newRecurrence();
    weeklyRecurrence.addDailyRule().interval(1).until(new Date("2023-06-02T19:00:00"));
    
    var event = eventCal.createEventSeries(lectureName, startTime, endTime, weeklyRecurrence);
  
    event.setDescription(lectureNote);
    event.setLocation(lectureRoom);
    Logger.log(event.getTitle());
  }
}

function getShortRangeFromRowAndColumns(row, column1, column2) {
  var startRow = Math.max(2, row);
  var endRow = row + 13;

  var rangeString = column1 + startRow + ":" + column2 + endRow;
  Logger.log(rangeString);
  return rangeString;
}
