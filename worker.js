addEventListener("fetch", event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url)

  if (url.pathname.startsWith("/content")) {
    // Rewrite the request to the target URL
    const targetUrl = `https://b395b13bd67a.ngrok-free.app${url.pathname}${url.search}`

    const newRequest = new Request(targetUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'manual'
    })

    // Rewrite the request to the target URL
    newRequest.headers.set('Host', 'b395b13bd67a.ngrok-free.app')

    return fetch(newRequest)
  }

  return fetch(request)
}