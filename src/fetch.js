import axios from 'axios'

export function SuggestionDebounce(func, delay) {
  let timeoutId

  return function (...args) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export async function searchAutoComplete(query) {
  try {
    const response = await axios.get(`https://ac.rule34.xxx/autocomplete.php?q=${query}`)
    return response.data
  } catch (error) {
    return null
  }
}

export async function getPictures(tags = 'all', pid = 0) {
  try {
    const response = await axios.get(
      `https://rule34.xxx/index.php?page=post&s=list&tags=${tags}&pid=${pid}`
    )
    return response.data
  } catch (error) {
    return null
  }
}

export async function getParsedPictures(tags = 'all', pid = 0) {
  let rawPics = await getPictures(tags, pid)
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = rawPics

  const imageList = tempDiv.querySelectorAll('div.image-list')

  const images = []

  imageList.forEach((imageDiv) => {
    const spans = imageDiv.querySelectorAll('span')

    spans.forEach((span) => {
      const id = span.id.slice(1)
      const anchor = span.querySelector('a')
      const href = anchor ? anchor.href : ''
      const img = anchor ? anchor.querySelector('img') : null
      const imageSrc = img ? img.src : ''

      images.push({
        id: id,
        image: imageSrc,
        href: href
      })
    })
  })

  return images
}

export async function getActivePic(id) {
  try {
    const response = await axios.get(`https://rule34.xxx/index.php?page=post&s=view&id=${id}`)
    return response.data
  } catch (error) {
    return null
  }
}

function parseTags(tagList, tagClass) {
  let res = []
  const tags = tagList.querySelectorAll(`li${tagClass}`)
  tags.forEach((tag) => {
    const hrefs = tag.querySelectorAll('a')
    const count = tag.querySelector('span').innerHTML
    res.push({
      name: hrefs[1].innerHTML.replace(/ /g, '_'),
      display: hrefs[1].innerHTML,
      count: count
    })
  })
  return res
}

export async function getParsedActivePic(id) {
  let picHtml = await getActivePic(id)
  const tempDiv = document.createElement('div')
  tempDiv.innerHTML = picHtml

  const tagList = tempDiv.querySelector('ul#tag-sidebar')

  let characterTags = parseTags(tagList, '.tag-type-character')
  let artistTags = parseTags(tagList, '.tag-type-artist')
  let generalTags = parseTags(tagList, '.tag-type-general')
  let metadataTags = parseTags(tagList, '.tag-type-metadata')

  let image
  let video_poster
  let video_source

  try {
    image = tempDiv.querySelector('img#image').src
  } catch (error) {
    image = null
  }
  try {
    video_poster = tempDiv.querySelector('video').poster
  } catch (error) {
    video_poster = null
  }
  try {
    video_source = tempDiv.querySelector('video source').src
  } catch (error) {
    video_source = null
  }

  return {
    image: image,
    video: { poster: video_poster, source: video_source },
    tags: {
      character: characterTags,
      artist: artistTags,
      general: generalTags,
      metadata: metadataTags
    }
  }
}
