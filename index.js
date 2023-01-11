var items = [];

const ErrorText = 
    `
      <div class="error_wrap">
        <p>Failed to fetch<p>
        <button style="margin: 0;" class="error_btn btn btn-danger btn_danger" onclick="window.location.reload()" > Try again</button>
      </div>
    `

const  getItems =  async () => {  
  try {
    const resp = await fetch('https://coneyslostisland.onrender.com/home')
    const data = await resp.json()
    return data;
  } catch(err) {
    document.getElementById('itemlist').innerHTML = ErrorText;
  }
  
}
getItems().then(data => {
  data;
  items.push(...data)
  localStorage.setItem('items', JSON.stringify(data))
  storage = JSON.parse(localStorage.getItem('items'));
  data.length > 0 && runData(data)
})


// search box
function registerInputChange(){
  var x = document.getElementById('search_btn').value.toLowerCase();
  var data = items;
  // console.log(data)
  var newItemList = [];
data.map((dt,key)=> {
  var query = dt.description.toLowerCase()
  var query2 = dt.name.toLowerCase()
  if(query.includes(`${x}`)===true || query2.includes(`${x}`) === true ){
    newItemList.push(dt)
  } 
  runData(newItemList)
})
}

function runData (myList) {
  var result = myList?.map((dt,key)=> {
         return (
          `<div class="col-md-4 " key=${dt._id}>
          <div class="card item">
            <img src="${dt.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title car_model" id='card_model'> ${dt.name}</h5>
              <p id="card-text" class="car_desc">
              ${dt.description} </p>
              
            </div>
            
          </div>
        </div>`
         )
    
      
      
  })
  document.getElementById('itemlist').innerHTML = result && result;
}
