$(document).ready(function () {
    // step 1 - variables
    var hourArray = [9, 10, 11, 12, 13, 14, 15, 16, 17];
    var localContent = JSON.parse(localStorage.getItem('schedule')) || {};

    // step 2 - build HTML
    const container = $('.container');

    let currentDayDisplay = $("#currentDay");
    currentDayDisplay.text('Current Day: ' + moment().format('ll'));
    
    /**
     * styleHours
     * @usage $('#area-'+hr).styleHours();
     */
    $.fn.styleHours = function () {
        let nowHour = moment().hour();
        let hour = parseInt($(this)[0].id.split("-")[1]);
        
        if (nowHour === hour) {
            $(this).addClass('present');
        } else if (nowHour > hour) {
            $(this).addClass('past');
        } else {
            $(this).addClass('future');
        }
        return this;
    }
    
    /**
     * renderSchedule
     * @description Accepts an array of Numbers and populates HTML
     * @param {[Number]} hours 
     */
    function renderSchedule(hours) {
        // foreach hour build a row
        hours.forEach(hour => {
            // CREATE row
            let div = $('<div class=row>');
            
            // CREATE time
            let timeBlock = $('<div class="hour col-12 col-sm-1 text-center">');
            let timeBlockText = $('<span>');
            timeBlockText.text(formatHour(hour));
            timeBlock.append(timeBlockText);
            
            // CREATE text input
            let txtArea = $('<textarea id="area-' + hour + '" class="col-10 col-sm-10">');
            txtArea.styleHours();
            if (localContent[hour] && localContent[hour].length) {
                $(txtArea).val(localContent[hour]);
            } else {
                $(txtArea).val("");
            }
    
            // CREATE save button
            let saveBtn = $('<button id="save-' + hour + '" class="saveBtn col col-sm-1">');    
            saveBtn.append($('<i class="fa fa-save">'));    
            saveBtn.on('click', saveEvent);
    
            // APPEND time, txt, save to div
            div.append(timeBlock, txtArea, saveBtn);
            
            // APPEND div to container
            container.append(div);
        });    
    }

    /**
     * Saves the content of the current row to local storage
     * @param evt 
     */
    function saveEvent(evt) {
        evt.preventDefault();
        let hr = this.id.split("-")[1];
        let area = $(`#area-${hr}`);

        // update the localContent object
        localContent[hr] = area.val();

        // store the content in localStorage
        localStorage.setItem("schedule", JSON.stringify(localContent));

        // animate textarea for success indicator
        area.addClass('blink');
        setTimeout(function () {
            // remove after 3s
            area.removeClass('blink');
        }, 3000);
    }

    // utility fn to print AM or PM
    // use moment right? lol
    function formatHour(hour) {
        if (hour === 12) return "12PM";
        if (hour > 12) return (hour - 12) + "PM";
        return hour + "AM";
    }

    // render
    renderSchedule(hourArray);
})