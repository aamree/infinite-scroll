const imageContainer = document.getElementById('image-container')
const loader = document.getElementById('loader')

let ready = false
let imagesLoaded = 0
let totalImages = 0
let photosArray = []
let isInitialLoad = true

// Unsplash API
let initialCount = 5;
const apiKey = 'Run9w3PAoC13WFUzUexvYuAbfeoY1VSR_E4qsr3nces'
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialCount}`

function updateAPIURLWithNewCount(picCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${picCount}`
}

// Проверка загрузились ли все фото
function imageLoaded() {
  imagesLoaded++
  if (imagesLoaded === totalImages) {
    ready = true
    loader.hidden = true
  }
}

// Функция setAttributes для вставки в DOM элементы 
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key])
  }
}

// Создание ссылок и фото, добавление в DOM
function displayPhotos() {
  imagesLoaded = 0
  totalImages = photosArray.length

  photosArray.forEach((photo) => {
    const item = document.createElement('a')
    setAttributes(item, {
      href: photo.links.html,
      target: '_blank'
    })

    const img = document.createElement('img')
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    })

    img.addEventListener('load', imageLoaded)

    item.appendChild(img)
    imageContainer.appendChild(item)
  })
}

// Получение фото из Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl)
    photosArray = await response.json()
    displayPhotos()
    if (isInitialLoad) {
      updateAPIURLWithNewCount(30)
      isInitialLoad = false
    }
  } catch (error) {
    //Обработка ошибок
  }
}

// Проверка, если скролл приблизлся конца страницы, то загружать еще фото
window.addEventListener('scroll', ()=>{
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
    ready = false
    getPhotos()
  }
})

// On Load
getPhotos()