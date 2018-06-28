
exports.seed = function(knex, Promise) {
  return knex('palettes').del() 
    .then(() => knex('projects').del()) 

    .then(() => {
      return Promise.all([
        
        knex('projects').insert({
          title: 'project 1'
        }, 'id')
        .then(project => {
          return knex('palettes').insert([
            { 
              name: 'dope palette', 
              project_id: project[0], 
              color1: rgb(131, 100, 138), 
              color2: rgb(17, 224, 242), 
              color3: rgb(148, 223, 140), 
              color4: rgb(42, 86, 135), 
              color4: rgb(35, 65, 187)},
            { 
              name: 'decent palette', 
              project_id: project[0], 
              color1: rgb(244, 73, 218), 
              color2: rgb(100, 89, 183), 
              color3: rgb(99, 89, 158), 
              color4: rgb(172, 196, 249), 
              color4: rgb(200, 200, 28)}
          ])
        })
        .then(() => console.log('Seeding complete!'))
        .catch(error => console.log(`Error seeding data: ${error}`))
      ]) 
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
