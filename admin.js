var items = [];
var storage;

const ErrorText =
  `
      <div class="error_wrap">
        <p>Failed to fetch<p>
        <button style="margin: 0;" class="error_btn btn btn-danger btn_danger" onclick="window.location.reload()" > Try again</button>
      </div>
    `

// https://coneyslostisland.onrender.com/home
const getItems = async () => {
  try {
    const resp = await fetch('https://coneyslostisland.onrender.com/home')
    const data = await resp.json()
    return data;
  } catch (err) {
    document.getElementById('adminItemlist').innerHTML = ErrorText;
  }
}
getItems().then(data => {
  data;
  data && items.push(...data);
  localStorage.setItem('items', JSON.stringify(data))
  storage = JSON.parse(localStorage.getItem('items'));
  data.length > 0 && runAdminData(storage)
})

var item = {
  name: null,
  location: null,
  image: null,
  desc: null
}

function clear(name, img, lc, dsc) {
  name.value = ""
  lc.value = ""
  img.value = ""
  dsc.value = ""
}
function cfm() {
  Swal.fire(
    'Good job!',
    'Data saved Successfully',
    'success'
  )
}
function photoUpload() {
  var pht = document.getElementById('photo')
  pht.src = document.getElementById('image').value
}

const addItem = async function () {
  var img = document.getElementById('image')
  var name = document.getElementById('name')
  var lc = document.getElementById('location')
  var dsc = document.getElementById('description')
  // assign values to properties
  nItem = Object.create(item)
  nItem.image = img.value
  nItem.location = lc.value
  nItem.name = name.value
  nItem.description = dsc.value
  // console.log(nItem)
  // cars.push(nItem)

  try {
    var token = localStorage.getItem("token") ? localStorage.getItem("token") : " ";
    await fetch('https://coneyslostisland.onrender.com/admin', {
      method: "POST",
      body: JSON.stringify(nItem),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },

    }).then((res) => {
      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
        throw Error;
      }
      clear(name, img, lc, dsc);
      document.getElementById("addItem").classList.remove("show");
      cfm();
      getItems().then(data => {
        data;
        data && items.push(...data);
        localStorage.setItem('items', JSON.stringify(data))
        storage = JSON.parse(localStorage.getItem('items'));
        data.length > 0 && runAdminData(storage)
      })

      return;
    })
  } catch (err) {
    document.getElementById("addItem").classList.remove("show");
    Swal.fire(
      'Error!',
      'Could not add item. Try again',
      'error'
    )
  }



}
const setError = (errorText) => {
  document.getElementById("error").innerText = errorText;
}

// removes cars from list
async function removeFromList(idx) {
  items.splice(idx, 1);
  var removedItem = JSON.parse(localStorage.getItem('items')) ? JSON.parse(localStorage.getItem('items')).splice(idx, 1) : [];
  confirmRemove(removedItem, idx)
}


function confirmRemove(removedItem, idx) {
  Swal.fire({
    title: 'Are you sure?',
    text: "You won't be able to revert this!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!'
  }).then(async (result) => {
    if (result.isConfirmed) {

      // items.splice(idx, 1);
      // console.log(removedItem);
      var token = localStorage.getItem("token") ? localStorage.getItem("token") : " ";

      const res = await fetch('https://coneyslostisland.onrender.com/remove', {
        method: "DELETE",
        body: JSON.stringify(removedItem[0]),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`

        }
      })

      if (res.status === 401) {
        localStorage.removeItem("token");
        window.location.reload();
        throw Error;
      } else if (res.status === 200) {
        localStorage.setItem('items', JSON.stringify(items))
        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
        runAdminData(items)
      }
    }
  }
  ).catch(err => {
    Swal.fire(
      'Error!',
      'Could not delete item. Try again.',
      'error'
    )
  })
}


function runAdminData(myList) {
  var result = myList?.map((dt, key) => {
    return (`<div class="col-md-5 " key=${dt._id}>
          <div class="card item">
            <img src="${dt.image}" class="card-img-top" alt="...">
            <div class="card-body">
              <h5 class="card-title car_model" id='card_model'> ${dt.name}</h5>
              <p id="card-text" class="car_desc">
              ${dt.description} </p>
              <div class='group_btns'><button type="button" class="btn btn-danger w-40"   onclick='removeFromList("${key}")'>Remove</button>
                <button type="button" class="btn btn-success w-60" disabled onclick='editList("${key}")'>Edit/Save</button>
              </div>
            </div>
            
          </div>
        </div>`)



  })
  document.getElementById('adminItemlist').innerHTML = result && result;
}
