/* 
========================
 QUESTION 1a
======================== 
*/
function titleCase(word) {
  return word.toLowerCase().split(' ').map((s) => {
    return s[0].toUpperCase() + s.substring(1, s.length);
  }).join(' ')
}

// titleCase("I'm a little tea pot");
// titleCase("I'm a little tea pot");
// titleCase("sHoRt AnD sToUt");
// titleCase("SHORT AND STOUT");

/* 
========================
 QUESTION 1b
======================== 
*/

function frequencyCount(word) {
  let map = {};
  const match = word.toLowerCase().match(/[a-zA-Z0-9]+/gm);
  for(const w of match) {
    map[w] = map.hasOwnProperty(w) ? map[w] + 1 : 0;
  }
  for(const key of Object.keys(map)){
    console.log(`${key} => ${map[key]}`);
  }
}

//frequencyCount("Four One two two three Three three four  four   four")

/* 
========================
 QUESTION 2
======================== 
*/

function delay(ms) {
  return new Promise((resolve) => {
      setTimeout(resolve, ms)
  })
}
// Refresh console before run these
// delay(1000).then(() => console.log('runs after 1 seconds'));
// delay(2000).then(() => console.log('runs after 2 seconds'));
// delay(3000).then(() => console.log('runs after 3 seconds'));

/* 
========================
 QUESTION 2.5
======================== 
*/

function timeout(delay) {
  return new Promise((resolve) => setTimeout(resolve, delay));
}

async function fetchData(url) {
  await timeout(1000);
  if(!url) return {error : "URL is required", data : null};
  return {error : null, data : `Data from ${url}`};
}

async function processData(data) {
  await timeout(1000);
  if(!data) return { error : "Data is required", data : null };
  return { error: null, data: data.toUpperCase() };
}

async function main() {
  const fetchResult = await fetchData("https://example.com");
  if(fetchResult.error) { 
    console.error("Fetch Error:", fetchResult.error);
    return;
  }
  const processResult = await processData(fetchResult.data);
  if(processResult.error) {
    console.error("Process Error", processResult.error);
    return;
  }
  console.log("Processed Data:", processResult.data);
}

main();










