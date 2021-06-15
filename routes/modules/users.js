const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const bcrypt = require('bcryptjs')

router.get('/login', (req, res) => {
  res.render('login')
})

// 加入 middleware，驗證 request 登入狀態
router.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/users/login',
  failureFlash: true
}))
// router.post('/login', (req, res) => {})

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success_msg', 'You have been successfully logged out.')
  res.redirect('/users/login')
})

router.get('/register', (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  // 取得註冊表單參數
  const { name, email, password, confirmPassword } = req.body
  const errors = []
  if (!name || !email || !password || !confirmPassword) {
    errors.push({ message: 'Please complete all required fields.' })
  }
  if (password !== confirmPassword) {
    errors.push({ message: 'Password and confirm password do not match.' })
  }
  if (errors.length) {
    return res.render('register', { errors, name, email, password, confirmPassword })
  }

  try {
    // 檢查使用者是否已經註冊
    const user = await User.findOne({ email })
    // 如果已經註冊：退回原本畫面
    if (user) {
      errors.push({ message: 'This user already exists.' })
      // console.log('User already exists.')
      res.render('register', { errors, name, email, password, confirmPassword })
    } else {
      // 如果還沒註冊：寫入資料庫，並導回首頁
      const salt = await bcrypt.genSalt(10)
      const hash = await bcrypt.hash(password, salt)
      await User.create({ name, email, password: hash })
      return res.redirect('/')
    }
  } catch (err) {
    console.log(err)
  }
})

module.exports = router