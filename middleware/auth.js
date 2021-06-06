module.exports = {
  // 匯出一個物件，物件裡是一個叫做 authenticator 的函式
  authenticator: (req, res, next) => {
    // req.isAuthenticated() 是 Passport.js 提供的函式，根據 request 的登入狀態回傳 true 或 false
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('warning_msg', 'Please log in first.')
    res.redirect('/users/login')
  }
}