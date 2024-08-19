const displayBlock = document.getElementById("display");

document.querySelectorAll(".drum-pad").forEach(pad => {
    pad.addEventListener("click", function() {
        document.querySelectorAll(".drum-pad").forEach(p => {
            p.style.backgroundColor = 'grey';
            p.style.color = 'black';
        });

        this.style.backgroundColor = 'orange';
        this.style.color = '#fff';

        const padId = this.id;
        displayBlock.textContent = padId;

        const audio = this.querySelector('.clip');
        audio.currentTime = 0;
        audio.play();

        setTimeout(function() {
            document.querySelectorAll(".drum-pad").forEach(p => {
                p.style.backgroundColor = 'grey';
                p.style.color = 'black';
            });
        }, 200);
    })
});

document.getElementById('volume').addEventListener('input', function (event) {
    const volume = event.target.value;
    const audioElements = document.querySelectorAll('.clip');
    displayBlock.textContent = `Volume: ${volume}`;
    audioElements.forEach(audio => {
        audio.volume = volume;
    });
});

$(document).keydown(function(event) {
    var keyPressed = event.key.toUpperCase();
    var $pad = $('#' + keyPressed).parent();
    if ($pad.length) {
        $(".drum-pad").css({
            backgroundColor: 'grey',
            color: 'black'
        });
        $pad.css({
            backgroundColor: 'orange',
            color: '#fff'
        });
        var padID = $pad.attr('id');
        $('display').text(padID);

        var audio = $('#' + keyPressed)[0];
        audio.currentTime = 0;
        audio.play();
        setTimeout(function() {
            $pad.css({
                backgroundColor: 'grey',
                color: 'black' 
            });
        }, 200);
    }

})