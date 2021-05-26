//https://www.wikidata.org/w/api.php?action=wbsearchentities&search=abc&language=en
// https://tools.wmflabs.org/recoin/getmissingattributes.php?lang=en&subject=Q2985668&n=10
// 1. Insert value
// 2. Get item no
// 3. Get pid for missing attributes
// 4. Make a post request to our api endpoint
// 5. Show it
let userinput = document.getElementById("userinput").value
let btn = document.querySelector("button")
btn.onclick = datawiki

console.log(userinput);

let url = "https://www.wikidata.org/w/api.php?action=wbsearchentities&origin=*&format=json&search="
let language = "&language=en"
let val = userinput
let result1 = url + val + language

async function datawiki(){
  //JSON.parse(theStringThatIsNotJson)
  console.log(result1)
  const response  = await fetch(result1)
  const data = await response.json()
  console.log(data)
  
}
//btn.onclick = datawiki