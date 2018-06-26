$( document ).ready(function() {
  $('.new-palette').on('click', randomizePalette);
  $('.lock-btn').on('click', toggleLockColor);

  let palette = [];
  let finalPalette = {};

  function randomizePalette() {
    palette = [];
    for (i = 0; i < 5; i++) {
      palette.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
    };
    prependPalette();
  };

  function toggleLockColor() {
    const name = this.parentElement.attributes.name.value;
    
    if(!finalPalette[name]) {
      finalPalette[name] = $(`.${name}`).css('background-color');
    } else {
      finalPalette[name] = null;
    };
  }
  
  function prependPalette() {
    if(finalPalette['color1']) {
      $('.color1').css('background-color', `${finalPalette['color1']}`)
    } else {
      $('.color1').css('background-color', `${palette[0]}`)
    }
    if(finalPalette['color2']) {
      $('.color2').css('background-color', `${finalPalette['color2']}`)
    } else {
      $('.color2').css('background-color', `${palette[1]}`)
    }
    if(finalPalette['color3']) {
      $('.color3').css('background-color', `${finalPalette['color3']}`)
    } else {
      $('.color3').css('background-color', `${palette[2]}`)
    }
    if(finalPalette['color4']) {
      $('.color4').css('background-color', `${finalPalette['color4']}`)
    } else {
      $('.color4').css('background-color', `${palette[3]}`)
    }
    if(finalPalette['color5']) {
      $('.color5').css('background-color', `${finalPalette['color5']}`)
    } else {
      $('.color5').css('background-color', `${palette[4]}`)
    }
  };
});



      // $('.color').css('background-color', `${color}`)
      // $('.color-palette').prepend(`
      // <div 
      //   class="color"
      //   style="background-color:${color};"
      // >
      //   <button></button>
      //   <h3>${color}</h3>
      // </div>
      // `);