$(document).ready(function () {
    
    $('#importImage').hide();
    $('#download').hide();
    $('#geometrique').hide();

    var checkedOpac = false;
    var checkedFill = false;
    var color = "#000";
    var tmp_color = "#000";
    var painting = false;
    var started = false;
    var circle = false;
    var rectangle = false;
    var erase = false;
    var imageImport = false;
    var undo = false;
    var line = false;
    var draw = true;
    var width_brush = 5;
    var canvas = $("#canvas");
    var cursorX, cursorY,prevX,prevY;
    var restoreCanvasArray = [];
    var restoreCanvasIndex = 0;
    var context = canvas[0].getContext('2d');
    context.lineJoin = 'round';
    context.lineCap = 'round';

    // Fonction color picker
    document.getElementById("color").onchange = change;
    function change(e) {
        color = this.value;
        tmp_color = this.value;
    }

    // Clique sur canvas
    canvas.mousedown(function (e) {
        painting = true;
        prevX = cursorX;
        prevY = cursorY;
        cursorX = (e.pageX - this.offsetLeft);
        cursorY = (e.pageY - this.offsetTop);
    });

    // Relachement du clique
    $(this).mouseup(function () {
        painting = false;
        started = false;
    });

    // Mouvement sur le canvas 
    canvas.mousemove(function (e) {
        if (painting) {
            cursorX = (e.pageX - this.offsetLeft);
            cursorY = (e.pageY - this.offsetTop);
            drawLine();
        }
    });

    //  Fonction qui dessine
    function drawLine() {
        if (erase === true) {
            context.lineTo(cursorX, cursorY);
            context.lineWidth = width_brush;
            context.stroke();
        } else if (undo === true){
            context.lineTo(cursorX, cursorY);
            context.lineWidth = width_brush;
            context.stroke();
        } else if (!started) {
            context.beginPath();
            context.moveTo(cursorX, cursorY);
            started = true;
        } else if (line === true) {
            context.lineTo(cursorX, cursorY);
            context.strokeStyle = color;
            context.lineWidth = width_brush;
            context.stroke();
        }
    }

    // Outil Remplissage
    $('#fill').change(function () {
        if (checkedFill === false){
            checkedFill = true;
        } else if (checkedFill === true){
            checkedFill = false;
        }
    });

    // Outil Remplissage
    $('#opacity').change(function () {
        if (checkedOpac === false){
            checkedOpac = true;
            context.globalAlpha = 0.5;
        } else if (checkedOpac === true){
            checkedOpac = false;
            context.globalAlpha = 1;
        }
    });

    // Outil rectangle
    $("#rectangle").click(function () {
        $('#geometrique').show();
        context.globalCompositeOperation = 'source-over';
        rectangle = true;
        painting = false;
        erase = false;
        circle = false;
        line = false;
        let lol = 0;

        canvas.click(function (e) {
            if (lol !== 1) {
                lol++;
                if (rectangle) {
                    context.beginPath();
                    context.lineWidth = width_brush;
                    context.rect(prevX, prevY, cursorX - prevX, cursorY - prevY);
                    if (checkedFill === true){
                        context.fillStyle = color;
                        context.fill();
                    }else {
                        context.strokeStyle = color;
                        context.stroke();
                    }
                }
            }else{
                lol = 0;
            }
        });
    });

    // Outil cercle
    $("#cercle").click(function () {
        $('#geometrique').show();
        context.globalCompositeOperation = 'source-over';
        rectangle = false;
        painting = false;
        erase = false;
        circle = true;
        line = false;
        let lol = 0;

        canvas.click(function (e) {
            if (lol !== 1) {
                lol++;
                if (circle) {
                    context.beginPath();
                    context.lineWidth = width_brush;
                    var rayon = Math.sqrt(Math.pow(prevX - cursorX, 2) + Math.pow(prevY - cursorY, 2));
                    context.arc(cursorX,cursorY,rayon,0,Math.PI*2,false);
                    if (checkedFill === true){
                        context.fillStyle = color;
                        context.fill();
                    }else {
                        context.strokeStyle = color;
                        context.stroke();
                    }
                }
            }else{
                lol = 0;
            }
        });
    });

    $("#test").click(function () {
        let clicks = $(this).data('clicks');
        if (clicks) {
            $('#importImage').show();
            $('#download').show();
            $('#geometrique').show();
        } else {
            $('#importImage').hide();
            $('#download').hide();
            $('#geometrique').hide();
        }
        $(this).data("clicks", !clicks);
    });

    // Clique Importation d'image 
    $('#import').click(function () {
        circle = false;
        rectangle = false;
        undo = false;
        erase = false;
        var clicks = $(this).data('clicks');
        if (clicks) {
            imageImport = true;
            $('#importImage').show();
            alert("appuyer sur la toucher entrer apres choix de votre image.");
        } else {
            imageImport = false;
            $('#importImage').hide();
        }
        $(this).data("clicks", !clicks);
    });

    $(document).keypress(function (e) {
        if (e.which == 13) {
            let reader = new FileReader();
            reader.onload = function (event) {
                let img = new Image();
                img.onload = function () {
                    console.log(img);
                    if (img.width > canvas.width || img.height > canvas.height){
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0);
                    } else {
                        canvas.width = img.width;
                        canvas.height = img.height;
                        context.drawImage(img, 0, 0, 1200, 700);
                    }
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    });

    // Clique pot de peinture
    $('#drip').click(function () {
        line = true;
        erase = false;
        rectangle = false;
        circle = false;
        width_brush = 2000;
        context.globalCompositeOperation = 'source-over';
    });
// Outil Pinceau
    $('#brush').click(function () {
        line = true;
        erase = false;
        circle = false;
        rectangle = false;
        undo = false;
        width_brush = 25;
        context.globalCompositeOperation = 'source-over';
    });

    // Outil Stylo
    $('#pen').click(function () {
        undo = false;
        line = true;
        erase = false;
        circle = false;
        rectangle = false;
        width_brush = 5;
        context.globalCompositeOperation = 'source-over';
    });

    // Bouton Reset :
    $("#reset").click(function () {
        undo = false;
        erase = false;
        circle = false;
        line = false;
        rectangle = false;
        clear_canvas();
        width_brush = 5;
    });

    // Bouton Gomme :
    $("#erase").click(function () {
        undo = false;
        rectangle = false;
        line = false;
        erase = true;
        width_brush = 30;
        context.beginPath();
        context.globalCompositeOperation = 'destination-out';
    });

    // Bouton undo :
    $("#undo").click(function () {
        undo = true;
        rectangle = false;
        line = false;
        erase = false;
        circle = false;
        width_brush = 30;
        context.globalCompositeOperation = 'destination-out';
    });

    // Fonction Clear
    function clear_canvas() {
        context.clearRect(0, 0, canvas.width(), canvas.height());
    }

    // Bouton Save
    $("#save").click(function () {

        rectangle = false;
        circle = false;
        erase = false;
        
        let clicks = $(this).data('clicks');
        let download = document.getElementById("download");
        let button = $('#download');
        
        if (clicks) {
            button.show();
            let image = document.getElementById("canvas").toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            download.setAttribute("href", image);
            download.setAttribute("download", "paint.png");
        } else {
            button.hide();
        }
        $(this).data("clicks", !clicks);
    });
});