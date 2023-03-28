function main() {
  // much lighter than other version, as it creates recurring events instead of multiple single ones,
  // but it doesn't add instance-specific notes when modified

  // Open the event calendar
  var spreadsheet = SpreadsheetApp.getActiveSheet(); // WARNING: when debugging and running from here make sure to select the first sheet in google sheets
  var calendarId = spreadsheet.getRange("Sheet2!A5").getValue();
  var eventCal = CalendarApp.getCalendarById(calendarId);

  var activationCell = SpreadsheetApp.getActive().getRange('L2');
  if (!activationCell.isChecked()) { // only run script if activation cell L2 is modified
    Logger.log("Not running repeated lectures update because activation cell is not checked");
    return;
  } 
  activationCell.setValue('FALSE'); // toggle activation cell back to false

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
    weeklyRecurrence.addWeeklyRule().interval(1).until(new Date("2023-06-02T19:00:00"));
    
    var event = eventCal.createEventSeries(lectureName, startTime, endTime, weeklyRecurrence);
  
    event.setDescription(lectureNote);
    event.setLocation(lectureRoom);
    Logger.log(event.getTitle());
  }
}
