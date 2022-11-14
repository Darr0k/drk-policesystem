Darrk = {};
Darrk.Functions = {};
Darrk.OpenSystem = false;
Darrk.OpenMic = false;
Darrk.Alerts = {};
Darrk.Alerts.Html = {};
Darrk.Alerts.OpenControl = false;
Darrk.OpenedSettings = false;
Darrk.Me = {};
Darrk.ShowCursor = false;
Darrk.DroppedList = false;

var lastnumber = 0

$(function () {
    window.addEventListener('message', function (event) {
        var data = event.data;
        switch (data.action) {
            case 'open':
                $(':root').css('--color-3', data.defultColor);
                $(':root').css('--color-10', data.defultColor + "80");
                if (!Darrk.Alerts.OpenControl && !Darrk.ShowCursor) {
                    Darrk.Functions.OpenSystem(data)
                } else {
                    Darrk.Functions.ShowMessage('Close The control panel')
                }
                break;
            case 'refresh':
                Darrk.Functions.InsertDataToSystem(data)
                break;
            case 'close':
                Darrk.Functions.CloseSystem()
                break;
            case 'Message':
                Darrk.Functions.ShowMessage(data.message)
                break;
            case 'NewCall':
                Darrk.Alerts.AddAlert(data.timer, data.info, data.isPolice)
                break;
            case 'OpenAlertControl':
                if (!Darrk.OpenSystem && !Darrk.ShowCursor) {
                    Darrk.Functions.ShowControls(data.activeCops)
                } else {
                    Darrk.Functions.ShowMessage('Close System')
                }
                break;
            case 'OpenHub':
                Darrk.Functions.OpenMiniHub(data);
                break;
            case 'refresh_hub':
                $(':root').css('--color-3', data.defultColor);
                $(':root').css('--color-10', data.defultColor + "80");
                Darrk.Functions.InsertDataToHub(data)
                break;
            case 'hide_hub':
                $('.minihub-container').fadeOut();
                break;
            default:
                break;
        }
    })

    $('.heavy-weapons').click(function () {
        Darrk.Functions.SearchWings('heavy-weapons', 'Heavy Weapons')
    });

    $('.dogs').click(function () {
        Darrk.Functions.SearchWings('dogs', 'K9 Wings')
    });

    $('.undercover').click(function () {
        Darrk.Functions.SearchWings('undercover', 'Undercover')
    });

    $('.helicopters').click(function () {
        Darrk.Functions.SearchWings('helicopters', 'Pilots')
    });

    $('.fa-times-circle').click(function () {
        Darrk.Functions.CloseSystem()
    });

    $('.fa-microphone-alt').click(function () {
        Darrk.OpenMic = !Darrk.OpenMic
        $('.fa-microphone-alt').hide();
        $('.fa-microphone-alt-slash').show();
    });

    $('.fa-microphone-alt-slash').click(function () {
        Darrk.OpenMic = !Darrk.OpenMic
        $('.fa-microphone-alt-slash').hide();
        $('.fa-microphone-alt').show();
    });

    $('.fa-sync').click(function (e) {
        $.post('https://drk-policesystem/refresh_System');
    });

    $('#Send-Direction').click(function () {
        let area = escapeHtml($('#Direction-area').val())
        let id = escapeHtml($('#Direction-id').val())

        // console.log(area, id)

        if (!area || !id) {
            $('.nb-text').html('Undefined Area, Id');
            setTimeout(() => {
                $('.nb-text').html('');
            }, 1000);
        } else {
            $('.dispatch').css('opacity', '0.7');
            setTimeout(() => {
                $('.dispatch').css('opacity', '1');
            }, 10000);
            $.post('https://drk-policesystem/send_Dir', JSON.stringify({
                area: area,
                id: id
            }));
        }
    });

    $('#search-citizen').click(function () {
        let Info = escapeHtml($('#citizen-info').val())


        if (!Info) {
            $('.nb-text').html('Undefined CitizenId');
            setTimeout(() => {
                $('.nb-text').html('');
            }, 1000);
        } else {
            // $('.dispatch').css('opacity', '0.7');
            // setTimeout(() => {
            //     $('.dispatch').css('opacity', '1');
            // }, 10000);
            $.post('https://drk-policesystem/SearchForCitizen', JSON.stringify({
                info: Info
            }));
        }
    });

    $('#search-vehicle').click(function () {
        let Plate = escapeHtml($('#vehicle-plate').val())


        if (!Plate) {
            $('.nb-text').html('Undefined Plate');
            setTimeout(() => {
                $('.nb-text').html('');
            }, 1000);
        } else {
            $('.dispatch').css('opacity', '0.7');
            setTimeout(() => {
                $('.dispatch').css('opacity', '1');
            }, 10000);
            $.post('https://drk-policesystem/SearchForVehicle', JSON.stringify({
                info: Plate
            }));
        }
    });

    $('#Send-Announcement').click(function () {
        let Info = escapeHtml($('#announce-message').val())


        if (!Info) {
            $('.nb-text').html('Undefined Message');
            setTimeout(() => {
                $('.nb-text').html('');
            }, 1000);
        } else {
            $('.dispatch').css('opacity', '0.7');
            setTimeout(() => {
                $('.dispatch').css('opacity', '1');
            }, 10000);
            $.post('https://drk-policesystem/SendAnnouncement', JSON.stringify({
                info: Info
            }));
        }
    });

    $('#Watch-Camera').click(function () {
        let Info = escapeHtml($('#Camera-Id').val())


        if (!Info) {
            $('.nb-text').html('Undefined Camera');
            setTimeout(() => {
                $('.nb-text').html('');
            }, 1000);
        } else {
            Darrk.Functions.CloseSystem()
            $.post('https://drk-policesystem/WatchCamera', JSON.stringify({
                info: Info
            }));
        }
    });

    $('.icon-camera').click(function (e) {
        e.preventDefault();
        console.log(this)
    });

    $(document).on('click', '.icon-dir', function () {
        var area = $(this).data('area');
        if (area == undefined) {
            area = 'Never directed before'
        }
        Darrk.Functions.ShowMessage(area)
    });

    $(document).on('click', '.cl-officer', function () {
        var id = $(this).data('id');
        copyToClipboard(id);
    });


    // 

    $(document).on('click', '.mh-settings', function () {
        if (!Darrk.OpenedSettings) {
            $(".mh-setting-container").show();
            $(".mh-setting-container").animate({
                right: "21.7vw"
            })
        } else {
            $(".mh-setting-container").animate({
                right: "12.7vw"
            })
            setTimeout(() => {
                $(".mh-setting-container").hide();
            }, 1000);
        }
        Darrk.OpenedSettings = !Darrk.OpenedSettings
    });

    $(document).on('click', '#mhob-radio', function () {
        var radioChannel = $(this).data('channel');
        var showradio = $(this).data('showradio');
        console.log(radioChannel, showradio);
        if (!showradio) {
            Darrk.Functions.ShowMessage('This Officer does\'nt allow to see radio channel')
        } else if (showradio && radioChannel <= 0) {
            Darrk.Functions.ShowMessage('This Officer is not on any channel !')
        } else if (showradio && radioChannel > 0) {
            Darrk.Functions.ShowMessage('Channel : ' + radioChannel)
        }
    })

    $(document).on('click', '#mhob-mark', function () {
        var officer = $(this).data('officerid');
        $.post("https://drk-policesystem/markOfficer", JSON.stringify({
            id: officer
        }));
    })

    $(document).on('click', '.toggle-switch', function () {
        var type = $(this).data('type');
        $.post("https://drk-policesystem/update", JSON.stringify({
            type: type,
            variable: Darrk.Me.Radio
        }));
    });

    Darrk.Functions.OpenSystem = function (Data) {
        Darrk.Functions.InsertDataToSystem(Data);
        $('.dispatch').fadeIn();
        $('.dispatch').animate({
            left: "0vw",
        });
        Darrk.OpenSystem = true;
    }

    Darrk.Functions.InsertDataToSystem = function (Data) {
        $('#onduty').html('On Duty : ' + Data.OnDutyPolice);
        $('#outduty').html('Out Of Duty : ' + Data.OffDutyPolice);
        $('#busy').html('Busy : ' + Data.BusyDutyPolice);
        $('.sandy_amount').html(Data.Sandy);
        $('.los_amount').html(Data.Los);
        $('.great_amount').html(Data.Great);
        $('.paleto_amount').html(Data.Paleto);
        $('.cl-beam').html('');
        for (var officer of Data.Data) {
            var html;

            if (officer.self) {
                html = `
                <div class="cl-officer" data-id=${officer.id}>
                    <div class="o-data">
                        <i class="fas fa-circle" style="color:  ${Darrk.Functions.GetStatus(officer.duty, officer.busy)};"></i>
                        ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                        <p class="o-icons">
                            <img data-id=${officer.id} src="./images/camera_icon.svg" class="icon-camera">
                            <img data-area=${officer.area} src="./images/dir_icon.svg " class="icon-dir">
                        </p>
                    </div>
                </div>
                `
                // <img class="Officer-Location loc" id="'`+ officer.id +`'" data-id="'`+ officer.id +`'" src="./location.svg" alt="" srcset="">
                $('.cl-beam').append(html);
            } else {
                html = `
                <div class="cl-officer">
                    <div class="o-data">
                        <i class="fas fa-circle" style="color: ${Darrk.Functions.GetStatus(officer.duty, officer.busy)};"></i>
                        ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                        <p class="o-icons">
                            <img data-id=${officer.id} src="./images/camera_icon.svg" class="icon-camera">
                            <img data-area=${officer.area} src="./images/dir_icon.svg " class="icon-dir">
                        </p>
                    </div>
                </div>
                `
                $('.cl-beam').append(html);
            }
        }
    }

    Darrk.Functions.InsertDataToHub = function (Data) {
        $('.mh-header').html('MINI POLICE HUB (' + Data.OfficersCount + ')');
        $('.mh-officers-list').html('');
        for (var officer of Data.Data) {
            var html;
            var unit = '<i class="fas fa-walking"></i>';

            if (officer.vehicle != undefined && officer.vehicle != null && officer.vehicle != '0') {
                if (officer.Vehicleclass === 0) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 1) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 2) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 3) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 4) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 5) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 6) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 7) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 8) {
                    unit = '<i class="fa-solid fa-motorcycle vehicles"></i>'
                } else if (officer.Vehicleclass === 9) {
                    unit = '<i class="fa-solid fa-truck-monster vehicles"></i>'
                } else if (officer.Vehicleclass === 10) {
                    unit = '<i class="fa-solid fa-truck-ramp-box vehicles"></i>'
                } else if (officer.Vehicleclass === 11) {
                    unit = '<i class="fas fa-car vehicles"></i>'
                } else if (officer.Vehicleclass === 12) {
                    unit = '<i class="fa-solid fa-van-shuttle vehicles"></i>'
                } else if (officer.Vehicleclass === 13) {
                    unit = '<i class="fa-solid fa-person-biking vehicles"></i>'
                } else if (officer.Vehicleclass === 14) {
                    unit = '<i class="fa-solid fa-ship vehicles"></i>'
                } else if (officer.Vehicleclass === 15) {
                    unit = '<i class="fa-solid fa-helicopter vehicles"></i>'
                } else if (officer.Vehicleclass === 16) {
                    unit = '<i class="fa-solid fa-jet-fighter vehicles"></i>'
                } else if (officer.Vehicleclass === 17) {
                    unit = '<i class="fa-solid fa-taxi vehicles"></i>'
                } else if (officer.Vehicleclass === 18) {
                    unit = '<i class="fa-solid fa-car-on vehicles"></i>'
                } else if (officer.Vehicleclass === 19) {
                    unit = '<i class="fa-solid fa-truck-field vehicles"></i>'
                } else if (officer.Vehicleclass === 20) {
                    unit = '<i class="fa-solid fa-truck-moving vehicles"></i>'
                } else if (officer.Vehicleclass === 21) {
                    unit = '<i class="fa-solid fa-train-tram vehicles"></i>'
                }
            }

            if (officer.self) {
                html = `
                <div class="mh-officer">
                    <img class="mho-police" src="./images/Icons/police-icon.svg" style="fill: ${Darrk.Functions.GetStatus(officer.duty, officer.busy)};" onload="SVGInject(this)">
                    <span class="mho-data">${officer.name + ' || ' + officer.callsign + ' || ' + unit}</span>
                    <div class="mho-buttons">
                        <img id="mhob-radio" src="./images/icons/radio.svg" onload="SVGInject(this)" data-showradio="${officer.radioShow}" data-channel="${officer.radioChannel}" style="fill: ${Darrk.Functions.GetRadioState(officer.radioShow, officer.radioChannel)};">
                        <img id="mhob-mark" src="./images/icons/mark.svg" onload="SVGInject(this)" data-officerid="${officer.id}">
                        <!-- <img id="mhob-" src="./images/icons/walking.svg" onload="SVGInject(this)" data-officerid="${officer.id}">-->
                    </div>
                </div>
                `

                // <img class="Officer-Location loc" id="'`+ officer.id +`'" data-id="'`+ officer.id +`'" src="./location.svg" alt="" srcset="">
                $('.mh-officers-list').append(html);
            } else {
                html = `
                <div class="mh-officer">
                    <img class="mho-police" src="./images/Icons/police-icon.svg" style="fill: ${Darrk.Functions.GetStatus(officer.duty, officer.busy)};" onload="SVGInject(this)">
                    <span class="mho-data">${officer.name + ' || ' + officer.callsign + ' || ' + officer.unit}</span>
                    <div class="mho-buttons">
                        <img id="mhob-radio" src="./images/icons/radio.svg" onload="SVGInject(this)" data-showradio="${officer.radioShow}" data-channel="${officer.radioChannel}" style="fill: ${Darrk.Functions.GetRadioState(officer.radioShow, officer.radioChannel)};">
                        <img id="mhob-mark" src="./images/icons/mark.svg" onload="SVGInject(this)" data-officerid="${officer.id}">
                        <!-- <img src="./images/icons/walking.svg" onload="SVGInject(this)" data-officerid="${officer.id0}">-->
                    </div>
                </div>
                `
                $('.mh-officers-list').append(html);
            }
        }
        return true
    }

    Darrk.Functions.GetRadioState = function (radioshow, channel) {
        if (channel === 0 && radioshow) {
            return '#FF4B4B'
        } else if (!radioshow) {
            return '#7A0000'
        } else {
            return '#59FF7E'
        }
    }

    Darrk.Functions.CloseSystem = function () {
        $('.dispatch').animate({
            left: "-97vw",
        });
        $('.dispatch').fadeOut();
        $.post('https://drk-policesystem/close_System');
        Darrk.OpenSystem = false
        Darrk.OpenMic = false
    }

    Darrk.Functions.OpenMiniHub = function (data) {
        if (Darrk.Functions.InsertDataToHub(data)) {
            $('.minihub-container').fadeIn();
        }
    }

    Darrk.Functions.GetStatus = function (duty, busy) {
        if (busy) {
            return '#FFC700'
        } else if (duty) {
            return '#4FFF4B'
        } else {
            return '#FF4B4B'
        }
    }

    Darrk.Functions.SearchWings = function (wingType, wingText) {
        $.post('https://drk-policesystem/GetWings', JSON.stringify({
            WingType: wingType
        }), function (Data) {
            $('.nb-text').html('Getting Data');
            setTimeout(() => {
                $('.nb-text').html('Getting Data.');
                setTimeout(() => {
                    $('.nb-text').html('Getting Data..');
                    setTimeout(() => {
                        $('.nb-text').html('Getting Data...');
                        setTimeout(() => {
                            var html = "" + wingText + " : ";
                            $('.nb-text').html('');
                            for (var officer of Data) {
                                if (html != '' + wingText + ' : ') {
                                    html += ", " + officer.name;
                                } else {
                                    html += officer.name
                                }
                            }
                            if (Data != 'nothing') {
                                $('.nb-text').html(html);
                            } else {
                                $('.nb-text').html('No one have this wing');
                            }
                            setTimeout(() => {
                                $('.nb-text').html("");
                            }, 5000);
                        }, 1000);
                    }, 1000);
                }, 1000);
            }, 1000);
        });
    }

    Darrk.Functions.ShowMessage = function (Message) {
        $('#notify-box').fadeIn();
        $('#nb-text').html(Message);
        setTimeout(() => {
            $('#notify-box').fadeOut();
        }, 10000);
    }

    Darrk.Functions.ShowControls = function (activeCops) {
        $('.Alerts').fadeOut();
        $('.Alerts-Control').fadeIn();

        $('.A-C-Box').animate({
            right: '0vw',
        })
        Darrk.Alerts.OpenControl = true
        $('.A-C-ActiveCops').html(activeCops);
        $('.A-C-LastAlert').html("#" + lastnumber);
    }

    Darrk.Functions.HideControls = function () {
        $('.A-C-Box').animate({
            right: '29vw',
        })

        setTimeout(() => {
            $('.Alerts').fadeIn();
            $('.Alerts-Control').fadeOut();
        }, 1000);
        Darrk.Alerts.OpenControl = false
        $.post('https://drk-policesystem/HideControl');
    }

    document.onkeyup = function (data) {
        if (data.which == 27) {
            if (!Darrk.Alerts.OpenControl && !Darrk.OpenedSettings && Darrk.OpenSystem) {
                Darrk.Functions.CloseSystem()
            } else if (!Darrk.OpenSystem && !Darrk.OpenedSettings && Darrk.Alerts.OpenControl) {
                Darrk.Functions.HideControls()
            } else if (!Darrk.OpenSystem && !Darrk.Alerts.OpenControl && Darrk.OpenedSettings) {
                $(".mh-setting-container").animate({
                    right: "12.7vw"
                })
                setTimeout(() => {
                    $(".mh-setting-container").hide();
                }, 1000);
                $.post("https://drk-policesystem/hide_cursor");
            } else {
                $.post("https://drk-policesystem/hide_cursor");
            }
            return
        }
    };

    const MONTH_NAMES = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
        const day = date.getDate();
        const month = MONTH_NAMES[date.getMonth()];
        const year = date.getFullYear();
        const hours = date.getHours();
        let minutes = date.getMinutes();

        if (minutes < 10) {
            minutes = `0${minutes}`;
        }

        if (prefomattedDate) {
            return `${prefomattedDate} at ${hours}:${minutes}`;
        }

        if (hideYear) {
            return `${day}. ${month} at ${hours}:${minutes}`;
        }

        return `${day}. ${month} ${year}. at ${hours}:${minutes}`;
    }

    function timeAgo(dateParam) {
        if (!dateParam) {
            return null;
        }

        const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
        const DAY_IN_MS = 86400000;
        const today = new Date();
        const yesterday = new Date(today - DAY_IN_MS);
        const seconds = Math.round((today - date) / 1000);
        const minutes = Math.round(seconds / 60);
        const isToday = today.toDateString() === date.toDateString();
        const isYesterday = yesterday.toDateString() === date.toDateString();
        const isThisYear = today.getFullYear() === date.getFullYear();

        if (seconds < 5) {
            return 'Just Now';
        } else if (seconds < 60) {
            return `${seconds} Seconds ago`;
        } else if (seconds < 90) {
            return 'About a minute ago';
        } else if (minutes < 60) {
            return `${minutes} Minutes ago`;
        } else if (isToday) {
            return getFormattedDate(date, 'Today');
        } else if (isYesterday) {
            return getFormattedDate(date, 'Yesterday');
        } else if (isThisYear) {
            return getFormattedDate(date, false, true);
        }

        return getFormattedDate(date);
    }

    Darrk.Alerts.AddAlert = function (timer, info, isPolice) {
        var callID = lastnumber + 1
        lastnumber = callID
        const prio = info['priority']
        let DispatchItem;
        if (info['isDead']) {
            DispatchItem = `
            <div class="alertbox ${callID} alertbox-${isPolice} animate__animated">
                <p class="A-title">${info.dispatchMessage}</p>
                <div class="A-info">
                    <div class="A-i">
                        <img src="./images/map-pin.svg" class="A-pin-image">
                        <p class="A-Pin-location">${info.area}</p>
                    </div>
                    <div class="A-i">
                        <img src="./images/time.svg" class="A-time-image">
                        <p class="A-time-location">00:16</p>
                    </div>
                </div>
                <div class="A-Code">
                    ${info.dispatchCode}
                </div>
                <div class="A-Number">
                    #${lastnumber}
                </div>
                <img src="${info.icon}" class="A-icon">
            `
        }
        else {
            DispatchItem = `
            <div class="alertbox ${callID} alertbox-${isPolice} animate__animated">
                <p class="A-title">${info.dispatchMessage}</p>
                <div class="A-info">
                    <div class="A-i">
                        <img src="./images/map-pin.svg" class="A-pin-image">
                        <p class="A-Pin-location">${info.area}</p>
                    </div>
            `
        }

        if (info['time']) {
            DispatchItem += `
            <div class="A-i">
                <img src="./images/time.svg" class="A-time-image">
                <p class="A-time-location">${timeAgo(info['time'])}</p>
            </div>`
        }

        DispatchItem += `
            </div>
            <div class="A-Code">
                ${info.dispatchCode}
            </div>
            <div class="A-Number">
                #${lastnumber}
            </div>
            <img src="${info.icon}" class="A-icon"> 
        </div>`
        $(".Alerts").prepend(DispatchItem)

        if (prio == 1) {
            timer = 12000
        } else if (prio == 2) {
            timer = 9000
        }

        $(`.${callID}`).addClass("animate__bounceInDown");
        setTimeout(() => {
            $(`.${callID}`).addClass("animate__bounceOutDown");
            setTimeout(() => {
                $(`.${callID}`).remove();
                $(".Alerts-Control").append(DispatchItem)
            }, 1000);
        }, timer || 4500);
    };

    function getFirstLetters(str) {
        const firstLetters = str
            .split(' ')
            .map(word => word[0])
            .join('');

        return firstLetters;
    }

    function escapeHtml(string) {
        return String(string).replace(/[&<>"'=/]/g, function (s) {
            return entityMap[s];
        });
    }

    const copyToClipboard = str => {
        const el = document.createElement('textarea');
        el.value = str;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    };
});
