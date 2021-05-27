//https://www.wikidata.org/w/api.php?action=wbsearchentities&search=abc&language=en
// https://tools.wmflabs.org/recoin/getmissingattributes.php?lang=en&subject=Q2985668&n=10
// 1. Insert value
// 2. Get item no
// 3. Get pid for missing attributes
// 4. Make a post request to our api endpoint
// 5. Show it
let userinput = document.getElementById("userinput").value
let btn = document.querySelector("button")

console.log(userinput);
var recoin_val
let url = "https://www.wikidata.org/w/api.php?action=wbsearchentities&origin=*&format=json&search="
let language = "&language=en"
let val = userinput
let result1 = url + val + language
//async function datawiki(){
  const datawiki = async () => {
  console.log(result1)
  const response  = await fetch(result1)
  const data = await response.json()
  //console.log(data)
  //console.log(data)
  const {searchinfo,search,search_continue} = data
  console.log(search[0].id)
  recoin_val = search[0].id
    return recoin_val
}
const recoin = async url2 =>{
  const request = await fetch(url2)
  const data2 = await request.json()
  // request.addHeader("Access-Control-Allow-Origin", "*")
  // request.addHeader("Access-Control-Allow-Origin", url2)
  
  //console.log(data2)
  return data2
}

const main = async() =>{
  const ans = await datawiki()

  let url2 = " https://tools.wmflabs.org/recoin/getmissingattributes.php?lang=en&format=json&origin=*&subject=" + ans +"&n=10"
  const final = await recoin(url2)
  console.log(final)
}
btn.onclick = main
