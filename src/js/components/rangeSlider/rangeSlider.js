function updateHandleTrackPos(slider, uiHandlePos) {
    var handleTrackXOffset = -((uiHandlePos / 100) * slider.clientWidth);
    $(slider).find(".handle-track").css("left", handleTrackXOffset);

    var sliderRangeInverseWidth = (100 - uiHandlePos) + "%";
    $(slider).find(".slider-range-inverse").css("width", sliderRangeInverseWidth);
}

$("#js-slider").slider({
    range: "min",
    max: 100,
    value: 50,
    create: function(event, ui) {
        var slider = $(event.target);
        
        // Append the slider handle with a center dot and its own track
        slider.find('.ui-slider-handle').append('<span class="dot"><span class="handle-track"></span></span>');
        
        // Append the slider with an inverse range
        slider.prepend('<div class="slider-range-inverse"></div>');
        
        // Set initial dimensions
        slider.find(".handle-track").css("width", event.target.clientWidth);
        
        // Set initial position for tracks
        updateHandleTrackPos(event.target, $(this).slider("value"));
    },
    slide: function(event, ui) {
        // Update position of tracks
        updateHandleTrackPos(event.target, ui.value);
    }
});
