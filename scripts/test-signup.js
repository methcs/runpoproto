(async ()=>{
  try{
    const signup = await fetch('http://localhost:3000/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username:'testuser'+Date.now(),password:'P@ssw0rd',email:'',name:'Test User'})})
    console.log('SIGNUP STATUS',signup.status)
    console.log(await signup.text())
  }catch(e){console.error('ERROR',e.message);process.exit(1)}
})()