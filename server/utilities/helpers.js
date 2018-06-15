module.exports = {
  extractDayNumber: (date) => {
    // "Fri Jun 01 2018 11:57:21 GMT+0300 (EEST)"
    let dateStr = '' + date
    let dateAndTime = dateStr.split(' ')
    // let onlyDate = dateAndTime.split('-')
    let day = Number(dateAndTime[2])

    return day
  },

  extractMonthNumber: (date) => {
    let dateStr = '' + date
    let dateAndTime = dateStr.split(' ')
    // let onlyDate = dateAndTime.split('-')
    let month = dateAndTime[1]

    switch (month) {
      case 'Jan':
        return 1
      case 'Feb':
        return 2
      case 'Mar':
        return 3
      case 'Apr':
        return 4
      case 'May':
        return 5
      case 'Jun':
        return 6
      case 'Jul':
        return 7
      case 'Aug':
        return 8
      case 'Sep':
        return 9
      case 'Oct':
        return 10
      case 'Nov':
        return 11
      case 'Dec':
        return 12
    }

    return month
  },

  extractYearNumber: (date) => {
    let dateStr = '' + date
    let dateAndTime = dateStr.split(' ')
    // let onlyDate = dateAndTime.split('-')
    let year = Number(dateAndTime[3])

    return year
  },

  extractDateWithoutTime: (date) => {
    let dateStr = '' + date
    let newDate = ''
    let dateAndTime = dateStr.split(' ')
    let day = Number(dateAndTime[2])
    let dayStr = '' + day

    let month = dateAndTime[1]
    let montStr = ''

    switch (month) {
      case 'Jan':
        month = 1
        break
      case 'Feb':
        month = 2
        break
      case 'Mar':
        month = 3
        break
      case 'Apr':
        month = 4
        break
      case 'May':
        month = 5
        break
      case 'Jun':
        month = 6
        break
      case 'Jul':
        month = 7
        break
      case 'Aug':
        month = 8
        break
      case 'Sep':
        month = 9
        break
      case 'Oct':
        month = 10
        break
      case 'Nov':
        month = 11
        break
      case 'Dec':
        month = 12
        break
    }

    if (month < 10) {
      montStr = '0' + month
    }

    if (day < 10) {
      dayStr = '0' + day
    }

    let year = Number(dateAndTime[3])

    newDate = '' + year + '-' + montStr + '-' + dayStr

    return newDate
  }
}
