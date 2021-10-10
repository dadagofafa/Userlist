const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"

const friends = JSON.parse(localStorage.getItem('favoriteFriends')) || []

const dataPanel = document.querySelector("#data-panel")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector('#search-form')


// render friend list
function myFriendList(data) {
  let rawHTML = "";

  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-3">
        <div class="mb-2">
          <div class="card">
            <img
              src="${item.avatar}"
              class="card-img-top" alt="friend poster">
            <div class="card-body">
              <h5 class="card-title">${item.name} ${item.surname}</h5>
            </div>
            <div class="card-footer">
              <button class="btn btn-info btn-show-friend" data-toggle="modal"
                data-target="#friend-modal" data-id="${item.id}">More</button>
              <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">x</button>
            </div>
          </div>
        </div>
      </div>    
    `
  })

  dataPanel.innerHTML = rawHTML;
}

// function part
function showFriendModal(id) {
  const modalTitle = document.querySelector("#friend-modal-title")
  const modalBirthday = document.querySelector("#friend-modal-birthday")
  const modalAge = document.querySelector("#friend-modal-age")
  const modalGender = document.querySelector("#friend-modal-gender")
  const modalEmail = document.querySelector("#friend-modal-email")
  const modalRegion = document.querySelector("#friend-modal-region")

  axios.get(INDEX_URL + id).then((response) => {
    const data = response.data
    modalTitle.innerText = data.name + " " + data.surname
    modalBirthday.innerText = " ➤ Birthday: " + data.birthday
    modalAge.innerText = " ➤ Age: " + data.age;
    modalGender.innerText = " ➤ Gender: " + data.gender
    modalEmail.innerText = " ➤ Email: " + data.email
    modalRegion.innerText = " ➤ Region: " + data.region
  })
}

function removeFromFavorite(id) {
  const friendIndex = friends.findIndex((friend) => friend.id === id)
  friends.splice(friendIndex, 1)

  localStorage.setItem('favoriteFriends', JSON.stringify(friends))
  myFriendList(friends)
}

// 監聽器
dataPanel.addEventListener("click", function nPanelClicked(event) {
  if (event.target.matches(".btn-show-friend")) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-remove-favorite')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

myFriendList(friends)