$(document).ready(function () {
    // let userLikeTotalCount = {{users.length}}

  $('a[name="showLess"]').hide()
  $('ul[name="usersLikedCar"] li:nth-child(5)').nextAll('li').hide()

  $('a[name="showLess"]').click(function () {
    $('ul[name="usersLikedCar"] li:nth-child(5)').nextAll('li').hide()
    $(this).hide()
  })

  $('a[name="showMore"]').click(function () {
    $('ul[name="usersLikedCar"] li:nth-child(5)').nextAll('li').show()
    $('a[name="showLess"]').show()
  })

  $('a[name="showMore"]').click(function () {
    $('ul[name="usersLikedCar"] li:nth-child(5)').nextAll('li').show()
    $('a[name="showLess"]').show()
  })
})
