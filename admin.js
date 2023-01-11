var items = [];
var storage;

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
  } catch(err) {
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
  location:  null,
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

const addTocarList = async function () {
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
    await fetch('http://127.0.0.1:8000/admin', {
      method: "POST",
      body: JSON.stringify(nItem),
      headers: {
        'Content-Type': 'application/json',
      }
    }).then((res) => {
      clear(name, img, lc, dsc)
      cfm()
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
        console.log(err);
  }


 
} 
const setError = (errorText) => {
    document.getElementById("error").innerText = errorText;
    console.log('yes')

  }

// removes cars from list
async function removeFromList(idx) {
  items.splice(idx, 1);
  var removedItem = JSON.parse(localStorage.getItem('items')).splice(idx, 1);
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
      
      const res = await fetch('http://127.0.0.1:8000/remove', {
        method: "DELETE",
        body: JSON.stringify(removedItem[0]),
        headers: {
          'Content-Type': 'application/json',
        }
      })
      // console.log(res)

      if(res.status === 200) {
        console.log("success");
        localStorage.setItem('items', JSON.stringify(items))
        Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
        // runAdminData(storage)
      }

      // res && Swal.fire(
      //   'Deleted!',
      //   'Your file has been deleted.',
      //   'success'
      // )

      // runAdminData(res);
    }
  }
  ).catch(err => {
    console.log('ERROR', err);
    Swal.fire(
      'Error!',
      'Could not delete item. Try again.',
      'error'
    )
  })
}


function runAdminData(myList) {
  var result = myList?.map((dt, key) => {
    return (`<div class="col-md-4 " key=${dt._id}>
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