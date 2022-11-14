Darrk = {};
Darrk.Functions = {};
Darrk.OpenMic = false;

$(function () {
    window.addEventListener('message', function (event) {
        var data = event.data;
        switch (data.action) {
            case 'open':
                Darrk.Functions.OpenSystem(data)
                break;
            case 'refresh':
                Darrk.Functions.UpdateSystem(data)
                break;
            case 'close':
                Darrk.Functions.CloseSystem()
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
        $.post('https://drk-policesystem/refresh_System', JSON.stringify({}));
    });

    // Open System (Manaul)
    Darrk.Functions.OpenSystem = function (Data) {
        Darrk.Functions.InsertData(Data)
        $('.dispatch').show('.dispatch')
        $('.dispatch').animate({
            left: "0vw",
        })
    }

    // Update System (Automatic) By Lua side
    Darrk.Functions.UpdateSystem = function (Data) {
        Darrk.Functions.InsertData(Data)
    }

    // Refresh System (Manaul)
    Darrk.Functions.RefreshSystem = function (Data) {
        Darrk.Functions.InsertData(Data)
    }

    // Insert Data To Officers List
    Darrk.Functions.InsertData = function (Data) {
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
                //Darrk.Functions.GetStatus
                if (officer.busy) {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color:  #FFC700;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                    // <img class="Officer-Location loc" id="'`+ officer.id +`'" data-id="'`+ officer.id +`'" src="./location.svg" alt="" srcset="">
                } else if (officer.duty) {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color: #4FFF4B;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                } else {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color: #FF4B4B;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                }
                $('.cl-beam').append(html);
            } else {
                if (officer.busy) {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color: #FFC700;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                } else if (officer.duty) {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color: #4FFF4B;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                } else {
                    html = `
                    <div class="cl-officer">
                        <div class="o-data">
                            <i class="fas fa-circle" style="color: #FF4B4B;"></i>
                            ${officer.name} - ${officer.callsign} - ${getFirstLetters(officer.rank)}.
                            <p class="o-icons">
                                <img src="./images/camera_icon.svg" class="icon-camera">
                                <img id="'`+ officer.id + `'" data-id="'` + officer.id + `'" src="./images/dir_icon.svg " class="icon-dir">
                            </p>
                        </div>
                    </div>
                    `
                }
                $('.cl-beam').append(html);
            }
        }
    }

    Darrk.Functions.CloseSystem = function () {
        $('.dispatch').animate({
            left: "-97vw",
        })
        $('.dispatch').hide('.dispatch')
        $.post('https://drk-policesystem/close_System', JSON.stringify({}));
    }

    Darrk.Functions.GetStatus = function (duty, busy) {
        
    }

    Darrk.Functions.SearchWings = function (wingType, wingText) {
        $.post('https://drk-policesystem/GetWings', JSON.stringify({
            WingType: wingType // 'helicopters'
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

    function getFirstLetters(str) {
        const firstLetters = str
            .split(' ')
            .map(word => word[0])
            .join('');

        return firstLetters;
    }
    
});