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

  const datawiki = async () => {
  console.log(result1)
  const response  = await fetch(result1)
  const data = await response.json()
  const {searchinfo,search,search_continue} = data
  console.log(search[0].id)
  recoin_val = search[0].id
    return recoin_val
}
const recoin = async url2 =>{
  const request = await fetch(url2)
  const data2 = await request.json()
  return data2
}
const recoin2 = async(qid1 , pid1) =>{
await new Promise(resolve => setTimeout(resolve, 1000));
var url = "https://qanswer-svc2.univ-st-etienne.fr/ml/kgcompletion";

var xhr = new XMLHttpRequest();
xhr.open("POST", url);

xhr.setRequestHeader("accept", "application/json");
xhr.setRequestHeader("Content-Type", "application/json");

xhr.onreadystatechange = function () {
   if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
   }};

var data = '{ "qid": "Q2985668", "pid": "P407"}';

return xhr.send(data);
}
const main = async() =>{
  const ans = await datawiki()

  let url2 = " https://tools.wmflabs.org/recoin/getmissingattributes.php?lang=en&format=json&origin=*&subject=" + ans +"&n=10"
  const final = await recoin(url2)
  const {completness_level , completness_percentage , missing_properties} = final
  console.log(missing_properties[0].property)
  let qid1 = ans
  let pid1 = missing_properties[0].property
  console.log(qid1)
  console.log(pid1)
  let url3 = "https://qanswer-svc2.univ-st-etienne.fr/ml/kgcompletion"
  const final_api = await recoin2(qid1,pid1)
  console.log(final_api)

}
btn.onclick = main
