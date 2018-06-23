$(document).ready(function () {
  $('#description').hide()
  let text = $('#description').text()

  let readMoreLink = $('a[name="readMore"]')
  let hideText = $('a[name="hide"]')

  readMoreLink.hide()
  hideText.hide()

  let shortenedText = ''
  if (text.length > 250) {
    shortenedText = text.substr(0, 250) + '...   '
    readMoreLink.show()
  } else {
    shortenedText = text
  }

  $('#description').text(shortenedText)
  $('#description').show()

  readMoreLink.on('click', function () {
    $('#description').hide()

    $('#description').text(text)
    $('#description').fadeIn(2000)

    hideText.show()
    $(this).hide()
  })

  hideText.on('click', function () {
    $('#description').text(shortenedText)
    readMoreLink.show()
    $(this).hide()
  })
})
