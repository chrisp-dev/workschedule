$(document).ready(function () {
    // step 1 - variables
    var hourArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    var hourLabelArray = ['9am', '10am', '11am', '12pm', '1pm', '2pm', '3pm', '4pm', '5pm'];
    var localContent = JSON.parse(localStorage.getItem('schedule')) || {};

    // test localContent object:
    // var lc = {
    //     9: "Make breakfast",
    //     10: "Begin Actual Work :)",
    //     11: "Coffee break 15min",
    //     12: "Lunch duh",
    //     13: "Extended lunch",
    //     14: "Second lunch",
    //     15: "Bathroom...",
    //     16: "Work a little",
    //     17: "Ahhhh buh bye"
    // }

    // localStorage.setItem('schedule', JSON.stringify(lc));

    // step 2 - build HTML
    const container = $('.container');

    let currentDayDisplay = $("#currentDay");
    currentDayDisplay.text('Current Day: ' + moment().format('ll'));

    // jq style function to allow chaining to style the textarea 
    // based on the time of day
    $.fn.styleHours = function (hour) {
        let nowHour = moment().hour();

        if (nowHour === hour) {
            // present
            $(this).addClass('present');
        } else if (nowHour > hour) {
            $(this).addClass('past');
        } else {
            $(this).addclass('future');
        }
        return this;
    }
    // foreach hour build a row
    hourArray.forEach(hour => {
        let div = $('<div class=row>');
        let timeBlock = $('<div class="hour col-12 col-sm-1 text-center">');
        let timeBlockText = $('<span>');
        timeBlockText.text(formatHour(hour));
        timeBlock.append(timeBlockText);

        let txtArea = $('<textarea id="area-' + hour + '" class="col-10 col-sm-10">');
        $(txtArea).styleHours(hour);

        if (localContent[hour] && localContent[hour].length) {
            $(txtArea).val(localContent[hour]);
        } else {
            $(txtArea).val("");
        }

        let saveBtn = $('<button id="save-' + hour + '" class="saveBtn col col-sm-1">');

        saveBtn.append($('<i class="fa fa-save">'));

        saveBtn.on('click', function (evt) {
            evt.preventDefault();
            let hr = this.id.split("-")[1];
            let area = $(`#area-${hr}`);

            area.addClass('blink');
            localContent[hr] = area.val();
            localStorage.setItem("schedule", JSON.stringify(localContent));
            setTimeout(function () {
                area.removeClass('blink');
            }, 4000);
        })

        div.append(timeBlock, txtArea, saveBtn);

        container.append(div);
    });

    // utility fn to print AM or PM
    // use moment right? lol
    function formatHour(hour) {
        if (hour === 12) return "12PM";
        if (hour > 12) return (hour - 12) + "PM";
        return hour + "AM";
    }
})