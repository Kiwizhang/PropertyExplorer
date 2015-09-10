function sliderRange () {
    
     
        $( "#slider-range" ).slider({
            range: true,
            min: 0,
            max: 18000,
            values: [ 0, 18000 ],
            slide: function( event, ui ) {
                $( "#amount" ).val( "$" + ui.values[ 0 ].toLocaleString() + "K - $" + ui.values[ 1 ].toLocaleString()+"K" );
            }
        });
        $( "#amount" ).val( "$" + $( "#slider-range" ).slider( "values", 0 ).toLocaleString() +
            "K - $" + $( "#slider-range" ).slider( "values", 1 ).toLocaleString() +"K");
    };

function sliderSize() {
        $( "#slider-size" ).slider({
            range: true,
            min: 0,
            max: 7000,
            values: [ 0, 43927 ],
            slide: function( event, ui ) {
                $( "#size" ).val(ui.values[ 0 ].toLocaleString() + " - " + ui.values[ 1 ].toLocaleString() + "ft²");
            }
        });
        $( "#size" ).val($( "#slider-size" ).slider( "values", 0 ).toLocaleString() +
            " - " + $( "#slider-size" ).slider( "values", 1 ).toLocaleString() + " ft²" );
    };