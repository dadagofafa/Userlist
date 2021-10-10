const BASE_URL = "https://lighthouse-user-api.herokuapp.com"
const INDEX_URL = BASE_URL + "/api/v1/users/"
const FRIENDS_PER_PAGE = 24

const friends = []
let filteredFriends = []

const dataPanel = document.querySelector("#data-panel")
const searchInput = document.querySelector("#search-input")
const searchForm = document.querySelector('#search-form')
const paginator = document.querySelector('#paginator')

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
              <button class="btn btn-danger btn-add-favorite" data-id="${item.id}"> ♥ </button>
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

function addToFavorite(id) {
  const list = JSON.parse(localStorage.getItem('favoriteFriends')) || []
  const friend = friends.find((friend) => friend.id === id)

  if (list.some((friend) => friend.id === id)) {
    return alert('此好友已在最愛中！')
  }

  list.push(friend)
  localStorage.setItem('favoriteFriends', JSON.stringify(list))
  return alert('已加入最愛中！')
}

function renderPaginator(amount) {
  const numberOfPage = Math.ceil(amount / FRIENDS_PER_PAGE)
  let rawHTML = ''

  for (let page = 1; page <= numberOfPage; page++) {
    rawHTML += `<li class="page-item"><a class="page-link" href="#" data-page=${page}>${page}</a></li>`
  }

  paginator.innerHTML = rawHTML
}

function getFriendsByPage(page) {
  const data = filteredFriends.length ? filteredFriends : friends
  const startIndex = (page - 1) * FRIENDS_PER_PAGE
  return data.slice(startIndex, startIndex + FRIENDS_PER_PAGE)
}

// 監聽器
dataPanel.addEventListener("click", function onPanelClicked(event) {
  if (event.target.matches(".btn-show-friend")) {
    showFriendModal(Number(event.target.dataset.id))
  } else if (event.target.matches('.btn-add-favorite')) {
    addToFavorite(Number(event.target.dataset.id))
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return

  const page = Number(event.target.dataset.page)
  myFriendList(getFriendsByPage(page))
})

searchForm.addEventListener('submit', function onSearchInputSubmitted(event) {
  event.preventDefault()
  const keyword = searchInput.value.trim().toLowerCase()

  filteredFriends = friends.filter((friend) =>
    friend.name.toLowerCase().includes(keyword) ||
    friend.surname.toLowerCase().includes(keyword)
  )

  if (!keyword.length) {
    return alert('Please enter a valid keyword')
  }

  if (filteredFriends.length === 0) {
    return alert('Cannot find name / surname with keyword: ' + keyword)
  }

  renderPaginator(filteredFriends.length)
  myFriendList(getFriendsByPage(1))
})

axios.get(INDEX_URL).then((response) => {
  friends.push(...response.data.results)
  renderPaginator(friends.length)
  myFriendList(getFriendsByPage(1))
})