// 检测是否有输入  
function checkIsNotNull(content) {
  return (content && content != null)
}
//检测输入是否合格


// 检测输入内容  
function checkPhoneNum(phoneNum) {
  if (!checkIsNotNull(phoneNum)) {
    return false
  }
  if (phoneNum.length > 11) {
    return false
  }
  if (!(/^1[34578]\d{9}$/.test(phoneNum))) {
    return false
  }
  return true
}
//检测手机号是否存在  

// 比较两个内容是否相等  
function isContentEqual(content_1, content_2) {
  if (!checkIsNotNull(content_1)) {
    return false
  }

  if (content_1 === content_2) {
    return true
  }

  return false
}

module.exports = {
  checkIsNotNull: checkIsNotNull,
  checkPhoneNum: checkPhoneNum,
  isContentEqual: isContentEqual
} 