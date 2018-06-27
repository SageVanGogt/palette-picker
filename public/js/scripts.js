$( document ).ready(function() {
  $('.new-palette').on('click', randomizePalette);
  $('.lock-btn').on('click', toggleLockColor);
  $('.palette-enter-form').on('submit', postNewPalette);
  $('.project-form').on('submit', postNewProject);

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
  };
  
  function prependPalette() {
    for ( i = 0; i <= 5; i++ ) {
      if(finalPalette[`color${i}`]) {
        $(`.color${i}`).css('background-color', `${finalPalette['color'+i]}`)
      } else {
        $(`.color${i}`).css('background-color', `${palette[i-1]}`)
      }
    }
  };

  async function postNewProject(event) {
    event.preventDefault();
    const projectName = $('.project-form').find('input[id="project-name"]').val();
    const url = `http://localhost:3000/api/v1/projects/`;
    const body = {
      method: 'POST',
      body: JSON.stringify({ name: projectName }),
      headers: {
        "Content-Type": "application/json"        
      }
    };
    const response = await fetch(url, body);
    const projectId = await response.json();

    prependProject(projectId.id, projectName);
    prependProjectToOptions(projectId.id, projectName);
  }

  async function postNewPalette(event) {
    event.preventDefault();
    const paletteName = $('.palette-enter-form').find('input[id="palette-name"]').val();
    const projectId = $( "select option:selected" ).val().split("-")[1];
    const url = `http://localhost:3000/api/v1/palettes/`;
    const body = {
      method: 'POST',
      body: JSON.stringify({ 
        name: paletteName,
        ...finalPalette 
      }),
      headers: {
        "Content-Type": "application/json"        
      }
    };
    const response = await fetch(url, body);
    const paletteId = await response.json();
  
    prependPalette(paletteId, paletteName, projectId);
  }

  function prependProjectToOptions(id, name) {
    $('#project-options').prepend(`
      <option value="option-${id}">${name}</option>  
    `)
  }

  function prependProject(id, name) {
    $('.project-list').prepend(`
      <h2 class="project-title">${name}</h2>
      <ul class="palette-list-${id}"></ul>
    `)
  }

  function prependPalette(paletteId, name, projectId) {
    $(`.palette-list-${projectId}`).prepend(`
      <h4>${name}</h4>
    `)
  }

});