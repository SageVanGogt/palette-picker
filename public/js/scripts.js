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
    for ( i = 0; i <= 5; i++ ) {
      if(finalPalette[`color${i}`]) {
        $(`.color${i}`).css('background-color', `${finalPalette['color'+i]}`)
      } else {
        $(`.color${i}`).css('background-color', `${palette[i-1]}`)
      }
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