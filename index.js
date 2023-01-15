var items = [];

const ErrorText =
  `
      <div class="error_wrap">
        <p>Failed to fetch<p>
        <button style="margin: 0;" class="error_btn btn btn-danger btn_danger" onclick="window.location.reload()" > Try again</button>
      </div>
    `

const getItems = async () => {
  try {
    const resp = await fetch('http://127.0.0.1:8000/home')
    const data = await resp.json()
    return data;
  } catch (err) {
    document.getElementById('itemlist').innerHTML = ErrorText;
  }

}
getItems().then(data => {
  data;
  data && items.push(...data)
  localStorage.setItem('items', JSON.stringify(data))
  storage = JSON.parse(localStorage.getItem('items'));
  data.length > 0 && runData(data)
})

var item = {
  name: null,
  location:  null,
  date_lost: null,
  description: null,
  ticket: null
}

const claimItem = async () => {
  document.getElementById("claimItem").classList.remove("show");
  var date_lost = document.getElementById('date_lost');
  var name = document.getElementById('name');
  var location = document.getElementById('location');
  var description = document.getElementById('description');
  var ticket = document.getElementById('ticket');
  // assign values to properties
  nItem = Object.create(item)
  
  nItem.name = name.value
  nItem.description = description.value;
  nItem.date_lost = date_lost.value
  nItem.location = location.value;
  nItem.ticket = ticket.value;

  try {
  await fetch('http://127.0.0.1:8000/claim', {
    method: "POST",
    body: JSON.stringify(nItem),
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(async (res) => {
    if (res.status === 200) {
      const data = await res.json();
      data &&
      Swal.fire({
        title: 'Success!',
        html: 
        `Your claim has been documented. This is your token: ${data.claimToken}. Please copy the token and present at the help desk.`,
        icon: 'success'
      }
      )
    }
  })
  
  } catch (err) {
    console.log('ERROR', err);
    Swal.fire(
      'Error!',
      'Could not document item. Try again.',
      'error'
    )
  }
}

  // search box
  function registerInputChange() {
    var x = document.getElementById('search_btn').value.toLowerCase();
    var data = items;
    // console.log(data)
    var newItemList = [];
    data.map((dt, key) => {
      var query = dt.description.toLowerCase()
      var query2 = dt.name.toLowerCase()
      if (query.includes(`${x}`) === true || query2.includes(`${x}`) === true) {
        newItemList.push(dt)
      }
      runData(newItemList)
    })
  }

  function runData(myList) {
    var result = myList?.map((dt, key) => {
      return (
        `<div class="col-md-5 " key=${dt._id}>
          <div class="card item">
            <img src="${dt.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title car_model" id='card_model'> ${dt.name}</h5>
              <p id="card-text" class="car_desc">
              ${dt.description} </p>
              <button id="claim" class="btn btn-outline-primary" data-bs-toggle="modal" data-bs-target="#claimItem">Claim</button>
            </div>
            
          </div>
        </div>`
      )



    })
    document.getElementById('itemlist').innerHTML = result && result;
  }
