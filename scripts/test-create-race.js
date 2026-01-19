(async () => {
  try {
    const body = {
      title: 'Test Race ' + Date.now(),
      date: '2026-06-01',
      location: 'Istanbul',
      distance: '5 km',
      category: 'Test',
      description: 'desc',
      websiteUrl: '',
      registrationUrl: ''
    }

    const res = await fetch('http://localhost:3000/api/races', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    console.log('STATUS', res.status)
    const text = await res.text()
    console.log('BODY', text)
  } catch (e) {
    console.error('ERROR', e.message)
    process.exit(1)
  }
})()
