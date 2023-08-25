const { promises: fs } = require("node:fs")

const main = async () => {
  console.log('generating shot..')
  const response = await fetch("http://localhost:3000/api/shot", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: process.env.VC_SECRET_ACCESS_TOKEN,
      shotPrompt: "video of a dancing cat"
    })
  });

  console.log('response:', response)
  const buffer = await response.buffer()

  fs.writeFile(`./test-juju.mp4`, buffer)
}

main()