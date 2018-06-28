function identityFilter(){
  if(wx.getStorageSync('loginStatus')=='no'){
       return false;
       }
  return true;
  }

exports.identityFilter = identityFilter;