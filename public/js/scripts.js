
$( document ).ready(function() {
  $( document ).ready(getPaletteData);
  $('.new-palette').on('click', randomizePalette);
  $('.lock-btn').on('click', toggleLockColor);
  $('.palette-enter-form').on('submit', postNewPalette);
  $('.project-form').on('submit', postNewProject);
  $('.projects').on('click', '.delete-palette-btn', deletePalette);

  let palette = [];
  let finalPalette = {};

  function getPaletteData() {
    getProjects();
    getPalettes();
  }

  async function getProjects() {
    const response = await fetch('/api/v1/projects')
    const projects = await response.json();
    projects.forEach(project => {
      prependProject(project.id, project.name)
      prependProjectToOptions(project.id, project.name)
    });
  }

  async function getPalettes() {
    const response = await fetch('/api/v1/palettes');
    const palettes = await response.json();
    palettes.forEach(palette => {
      const colors = [
        palette.color1, 
        palette.color2,
        palette.color3,
        palette.color4,
        palette.color5
      ]
      prependPalette(palette.id, palette.name, colors, palette.project_id)
    })
  }

  function randomizePalette() {
    palette = [];
    for (i = 0; i < 5; i++) {
      palette.push('#'+(Math.random()*0xFFFFFF<<0).toString(16));
    };
    prependPaletteColors();
  };

  function toggleLockColor() {
    const name = this.parentElement.attributes.name.value;

    if(!finalPalette[name]) {
      finalPalette[name] = $(`.${name}`).css('background-color');
    } else {
      finalPalette[name] = null;
    };
  };
  
  function prependPaletteColors() {

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
    const url = `/api/v1/projects/`;
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
    const url = `/api/v1/palettes/`;
    const body = {
      method: 'POST',
      body: JSON.stringify({ 
        name: paletteName,
        project_id: projectId,
        ...finalPalette 
      }),
      headers: {
        "Content-Type": "application/json"        
      }
    };
    const response = await fetch(url, body);
    const palette = await response.json();
    const colors = [
      palette.color1, 
      palette.color2,
      palette.color3,
      palette.color4,
      palette.color5
    ]
    console.log(palette)
    prependPalette(palette.id, paletteName, colors, projectId);
  }

  function prependProjectToOptions(id, name) {
    $('#project-options').prepend(`
      <option value="option-${id}">${name}</option>  
    `)
  }

  function prependProject(id, name) {
    $('.project-list').prepend(`
      <div class="project-item">
        <h2 class="project-title">${name}</h2>
        <ul class="palette-list palette-list-${id}"></ul>
      </div>
    `)
  }

  function prependPalette(paletteId, name, colors, projectId) {
    const colorTemplate = colors.map(color => {
      return (
        `<div 
          class="palette-list-one-color" 
          style="background-color:${color}">
        </div>`
      )
    }).join('');
    $(`.palette-list-${projectId}`).prepend(`
      <article class="palette">
        <h4>${name}</h4>
        <div class="palette-list-all-colors">
          ${colorTemplate}
        </div>
        <button class="delete-palette-btn" value="palette-${paletteId}">delete</button>
      </article>
    `)
  };

  async function deletePalette() {
    const paletteId = this.value.split('-')[1];
    const url = `/api/v1/palettes/${paletteId}`;
    const body = {
      method: 'DELETE',
      headers: {
        "Content-Type": "application/json"        
      }
    }
    await fetch(url, body);
    this.parentNode.remove();
  }


});