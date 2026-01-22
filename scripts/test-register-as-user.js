(async ()=>{
  try{
    const base='http://localhost:3000'
    const username='user'+Date.now()
    const password='P@ssw0rd'

    // Signup
    let r = await fetch(base+'/api/auth/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({username,password,email:username+'@example.com',name:'Test User'})})
    console.log('SIGNUP', r.status)
    const setCookie = r.headers.get('set-cookie') || ''
    console.log('SET-COOKIE', setCookie)

    if (!setCookie) throw new Error('No set-cookie returned')
    const match = setCookie.match(/rp_token=([^;]+)/)
    if(!match) throw new Error('rp_token not found in set-cookie')
    const cookieValue = match[1]

    // Fetch races
    r = await fetch(base+'/api/races')
    const races = await r.json()
    if(!races || races.length===0) throw new Error('No races found to register')
    const race = races[0]
    console.log('Using race', race.title)

    // Register as signed-in user (send Cookie header)
    r = await fetch(base+'/api/registrations',{method:'POST',headers:{'Content-Type':'application/json','Cookie':`rp_token=${cookieValue}`},body:JSON.stringify({raceId: race.externalId, preferredDistance: '10K'})})
    console.log('REGISTER', r.status)
    console.log(await r.text())

    // Fetch profile
    r = await fetch(base+`/api/users/${username}`,{headers:{'Cookie':`rp_token=${cookieValue}`}})
    console.log('PROFILE', r.status)
    console.log(await r.text())

  }catch(e){console.error('ERROR',e); process.exit(1)}
})()