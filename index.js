const { parse } = require('csv-parse');
const fs = require('fs');


//End-point for our filtered data.
const planets = [];


//function to filter the planets that are not good habitable planet candidates
//read more about what makes a planet a good candidate of a habitable one
//https://www.centauri-dreams.org/2015/01/30/a-review-of-the-best-habitable-planet-candidates/
function isHabitable(planet) {
        return planet['koi_disposition'] === 'CONFIRMED'
                && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
                && planet['koi_prad'] < 1.6;
}

//fs return readable stream for our parse function
//returns buffers of bytes which needs to be parsed
fs.createReadStream('kepler_data.csv')
        
        //connect the readable stream to the writable stream of the parse function
        .pipe(parse({
        comment: '#',
        columns: true,
        }))
        .on('data', (data) => {
                if (isHabitable(data)) {
                        planets.push(data);
                }
        })
        .on('error', (err) => {
                console.log(`Something went wrong -> ${err}`);
        })
        .on('end', () => {
                console.log(planets.map(planet => {
                        return planet['kepler_name'];
                }))
                console.log(`${planets.length} habitable planets found!`);
                console.log('----> Done <----');
        })