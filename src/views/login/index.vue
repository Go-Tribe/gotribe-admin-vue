<template>
  <div class="login-content" :style="{ backgroundImage: `url(${imgSrc})` }">
    <div class="top-logo">
      <img :src="logo" class="site-logo">
      <div class="site-name">{{ title }}</div>
    </div>
    <div class="container">
      <div class="title-content">
        <!-- <div class="title">登录</div> -->
        <img :src="logo" class="site-logo">
        <div class="site-name">{{ title }}</div>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
        <el-form-item prop="username" class="inputbox">
          <el-input
            ref="username"
            v-model="loginForm.username"
            placeholder="用户名"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
            style="width: 100%;"
          />
        </el-form-item>

        <el-form-item prop="password" class="inputbox">
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            style="width: 100%;"
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

      </el-form>
      <el-button
        type="primary"
        class="submit-btn"
        @click="handleLogin"
      >立即登录</el-button>
    </div>
    <div class="copyright">
      © {{ currentYear }}
      由
      <a
        href="https://www.gotribe.cn"
        target="_blank"
      >GoTribe</a>
      &
      <a
        href="https://www.mactribe.cn"
        target="_blank"
      >微椒网络</a>
      强力驱动
    </div>
  </div>
</template>

<script>
import JSEncrypt from 'jsencrypt'
import defaultSettings from '@/settings'
import { mapGetters } from 'vuex'

export default {
  name: 'Login',
  computed: {
    ...mapGetters([
      'systemConfig'
    ]),
    title() {
      return this.systemConfig.title
    },
    logo() {
      return this.systemConfig.logo
    }
  },
  data() {
    return {
      currentYear: '',
      imgSrc: require('@/assets/backgd-image/bg.png'),
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '请填写用户名' }],
        password: [
          { required: true, trigger: 'blur', message: '请填写密码' }
        ]
      },
      passwordType: 'password',
      publicKey: defaultSettings.publickey,
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
    this.getCurYear()
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    getCurYear() {
      const currentDate = new Date()
      this.currentYear = currentDate.getFullYear()
    },
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && key >= 'A' && key <= 'Z'
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          // 密码RSA加密处理
          const encryptor = new JSEncrypt()
          // 设置公钥
          encryptor.setPublicKey(this.publicKey)
          // 加密密码
          const encPassword = encryptor.encrypt(this.loginForm.password)
          const encLoginForm = {
            username: this.loginForm.username,
            password: encPassword
          }
          this.$store
            .dispatch('user/login', encLoginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || '/',
                query: this.otherQuery
              })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
.login-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .top-logo {
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 32px;
    margin-bottom: 24px;
    font-size: 24px;
    font-weight: 600;
    position: fixed;
    top: 16px;
    left: 72px;
    .site-logo {
      height: 32px;
      width: 32px;
      margin-right: 10px;
    }
  }
  .container {
    overflow: hidden;
    width: 560px;
    background: linear-gradient(180deg, hsla(0, 0%, 100%, .9), hsla(0, 0%, 100%, .75));
    border: 2px solid #fff;
    box-shadow: 0 20px 50px rgba(29, 42, 165, .05);
    -webkit-backdrop-filter: blur(7.5px);
    backdrop-filter: blur(7.5px);
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 64px 80px 34px;
    .title-content {
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 32px;
      margin-bottom: 24px;
      font-size: 24px;
      font-weight: 600;
      .site-logo {
        height: 32px;
        width: 32px;
        margin-left: 10px;
        margin-right: 10px;
      }
    }
    .login-form {
      width: 100%;
      margin-top: 32px;
      .inputbox + .inputbox {
        margin-top: 32px;
      }
    }
    .submit-btn {
      width: 100%;
      margin-top: 40px;
    }
  }
  .copyright {
    font-size: 12px;
    text-align: center;
    width: 100%;
    position: fixed;
    bottom: 20px;
    left: 0;
    a {
      text-decoration: underline;
      font-weight: bold;
      font-size: 12px;
    }
  }
}
</style>
