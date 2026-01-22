(async ()=>{
  try{
    const username = 'testuser'+Date.now()
    const passwd = 'P@ssw0rd'
    const signup = await fetch('http://localhost:3000/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password:passwd,email:'',name:'Test User'})})
    console.log('SIGNUP', signup.status)
    console.log(await signup.text())

    const login = await fetch('http://localhost:3000/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({usernameOrEmail:username,password:passwd})})
    console.log('LOGIN', login.status)
    const loginBody = await login.json().catch(()=>null)
    console.log('LOGIN BODY', loginBody)

    const profile = await fetch(`http://localhost:3000/api/users/${username}`)
    console.log('PROFILE', profile.status)
    console.log(await profile.text())
  }catch(e){console.error('ERROR',e.message);process.exit(1)}
})()